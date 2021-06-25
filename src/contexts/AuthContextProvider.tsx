import { useState, useEffect, ReactNode } from 'react'
import { useHistory } from 'react-router-dom'

import { auth, firebase } from '../services/firebase'
import { AuthContext } from './AuthContext'

interface User {
  id: string
  name: string
  avatar: string
}

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [ user, setUser ] = useState<User>()
  const history = useHistory()

  /** Descrição:
   * Manter sessão de usuario conectado ao dar F5
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if(!displayName || !photoURL) {
          throw new Error('Missing Information from Google Account.')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  /** Descrição:
   * Função de autenticação com Google
   */
  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(provider)

    if(result.user) {
      const { displayName, photoURL, uid } = result.user

      if(!displayName || !photoURL) {
        throw new Error('Missing Information from Google Account.')
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  async function signOut() {
    await auth.signOut()
    setUser(undefined)
    history.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }} >
      {props.children}
    </AuthContext.Provider>
  )
}
