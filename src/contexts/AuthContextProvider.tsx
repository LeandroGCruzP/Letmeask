import { useState, useEffect, ReactNode } from 'react'

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

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }} >
      {props.children}
    </AuthContext.Provider>
  )
}