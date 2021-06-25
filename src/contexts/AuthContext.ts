import { createContext, useContext } from 'react'

interface User {
  id: string
  name: string
  avatar: string
}

interface AuthContextType {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext({} as AuthContextType)

/** Utilização de useContext
 * Isto faz que não seja necesário fazer 2 imports em cada componente
 * Em vez de importar useContext(AuthContext) o unico que faz é useAuth
 */
 export const useAuth = () => {
  return useContext(AuthContext)
}

