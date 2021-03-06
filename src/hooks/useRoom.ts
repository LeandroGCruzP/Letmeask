import { useEffect, useState } from "react"

import { database } from "../services/firebase"
import { useAuth } from "../contexts/AuthContext"

type FirebaseQuestions = Record<string, {
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likes: Record<string, {
    authorId: string
  }>
}>

interface QuestionType {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likeCount: number
  likeId: string | undefined
}

export function useRoom(roomId: string) {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomReference = database.ref(`rooms/${roomId}`)

    roomReference.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

      // Transformar Object enviado pelo firebase a um Array
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, question]) => {
        return {
          id: key,
          content: question.content,
          author: question.author,
          isHighlighted: question.isHighlighted,
          isAnswered: question.isAnswered,
          likeCount: Object.values(question.likes ?? {}).length,
          likeId: Object.entries(question.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)

      return () => {
        roomReference.off('value')
      }
    })
  }, [roomId, user?.id])

  return { questions, title }
}
