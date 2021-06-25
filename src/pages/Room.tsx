import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

import { database } from '../services/firebase'
import { useAuth } from '../contexts/AuthContext'
import { useRoom } from '../hooks/useRoom'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

import logoImg from '../assets/images/logo.svg'

import '../styles/room.scss'

interface RoomParams {
  id: string
}

export function Room() {
  const { user, signOut } = useAuth()
  const params = useParams<RoomParams>()
  const roomId = params.id
  const [newQuestion, setNewQuestion] = useState('')
  const { title, questions } = useRoom(roomId)

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') {
      return
    }

    if (!user) {
      toast.error("You must be logged in.")
      // throw new Error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id
      })
    }
  }

  return(
    <div id="page-room">
      <div>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
      </div>
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" draggable="false" />
          <div>
            <RoomCode code={roomId}/>
            <Button onClick={signOut} >
              <svg
                height="24"
                viewBox="0 0 512.016 512"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m496 240.007812h-202.667969c-8.832031 0-16-7.167968-16-16 0-8.832031 7.167969-16 16-16h202.667969c8.832031 0 16 7.167969 16 16 0 8.832032-7.167969 16-16 16zm0 0"/><path d="m416 320.007812c-4.097656 0-8.191406-1.558593-11.308594-4.691406-6.25-6.253906-6.25-16.386718 0-22.636718l68.695313-68.691407-68.695313-68.695312c-6.25-6.25-6.25-16.382813 0-22.632813 6.253906-6.253906 16.386719-6.253906 22.636719 0l80 80c6.25 6.25 6.25 16.382813 0 22.632813l-80 80c-3.136719 3.15625-7.230469 4.714843-11.328125 4.714843zm0 0"/><path d="m170.667969 512.007812c-4.566407 0-8.898438-.640624-13.226563-1.984374l-128.386718-42.773438c-17.46875-6.101562-29.054688-22.378906-29.054688-40.574219v-384c0-23.53125 19.136719-42.6679685 42.667969-42.6679685 4.5625 0 8.894531.6406255 13.226562 1.9843755l128.382813 42.773437c17.472656 6.101563 29.054687 22.378906 29.054687 40.574219v384c0 23.53125-19.132812 42.667968-42.664062 42.667968zm-128-480c-5.867188 0-10.667969 4.800782-10.667969 10.667969v384c0 4.542969 3.050781 8.765625 7.402344 10.28125l127.785156 42.582031c.917969.296876 2.113281.46875 3.480469.46875 5.867187 0 10.664062-4.800781 10.664062-10.667968v-384c0-4.542969-3.050781-8.765625-7.402343-10.28125l-127.785157-42.582032c-.917969-.296874-2.113281-.46875-3.476562-.46875zm0 0"/><path d="m325.332031 170.675781c-8.832031 0-16-7.167969-16-16v-96c0-14.699219-11.964843-26.667969-26.664062-26.667969h-240c-8.832031 0-16-7.167968-16-16 0-8.832031 7.167969-15.9999995 16-15.9999995h240c32.363281 0 58.664062 26.3046875 58.664062 58.6679685v96c0 8.832031-7.167969 16-16 16zm0 0"/><path d="m282.667969 448.007812h-85.335938c-8.832031 0-16-7.167968-16-16 0-8.832031 7.167969-16 16-16h85.335938c14.699219 0 26.664062-11.96875 26.664062-26.667968v-96c0-8.832032 7.167969-16 16-16s16 7.167968 16 16v96c0 32.363281-26.300781 58.667968-58.664062 58.667968zm0 0"/>
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion} >
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            { user ? (
              <div className="user-info" >
                <img src={user.avatar} alt={user.name} draggable="false" />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            ) }
            <Button type="submit" disabled={!user} >Enviar pergunta</Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                { !question.isAnswered && (
                  <button
                  className={`like-button ${question.likeId ? 'liked' : ''}`}
                  type="button"
                  aria-label="Marcar como gostei"
                  onClick={() => {handleLikeQuestion(question.id, question.likeId)}}
                >
                  { question.likeCount > 0 && <span>{question.likeCount}</span> }
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                )}
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}
