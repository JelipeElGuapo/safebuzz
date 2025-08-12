"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  auth,
  checkEmailExists
} from "@/lib/firebaseConfig"
import { useEffect } from "react"

interface User {
  uid: string
  name: string
  email: string
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
  setUser: (user: User | null) => void
  checkEmailExists: (email: string) => Promise<boolean>
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        
        try {
          const result = await signInWithEmailAndPassword(email, password)
          
          if (result.success && 'user' in result && result.user) {
            const user = {
              uid: result.user.uid,
              name: result.user.email?.split("@")[0] || "Usuario",
              email: result.user.email || email,
            }
            set({ user, isLoading: false })
            return true
          } else {
            const errorMessage = 'error' in result ? result.error : "Error al iniciar sesión"
            set({ error: errorMessage, isLoading: false })
            return false
          }
        } catch (error) {
          set({ error: "Error al iniciar sesión. Verifica tus credenciales.", isLoading: false })
          return false
        }
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true, error: null })
        
        try {
          const result = await createUserWithEmailAndPassword(email, password, { name })
          
          if (result.success && 'user' in result && result.user) {
            const user = {
              uid: result.user.uid,
              name: name,
              email: result.user.email || email,
            }
            set({ user, isLoading: false })
            return true
          } else {
            const errorMessage = 'error' in result ? result.error : "Error al crear la cuenta"
            set({ error: errorMessage, isLoading: false })
            return false
          }
        } catch (error) {
          set({ error: "Error al crear la cuenta. Intenta nuevamente.", isLoading: false })
          return false
        }
      },
      
      logout: async () => {
        set({ isLoading: true })
        
        try {
          await signOut()
          set({ user: null, isLoading: false, error: null })
        } catch (error) {
          set({ error: "Error al cerrar sesión", isLoading: false })
        }
      },
      
      clearError: () => {
        set({ error: null })
      },
      
      setUser: (user) => {
        set({ user })
      },
      
      checkEmailExists: async (email) => {
        try {
          const result = await checkEmailExists(email)
          return result.exists
        } catch (error) {
          console.error("Error checking email:", error)
          return false
        }
      },
    }),
    {
      name: "safebuzz-auth",
    },
  ),
)

// Hook para escuchar cambios de autenticación de Firebase
export const useAuthListener = () => {
  const { setUser } = useAuth()
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: any) => {
      if (firebaseUser) {
        // Usuario autenticado, obtener datos de Firestore
        try {
          const { db } = await import("@/lib/firebaseConfig")
          const userDoc = await db.collection('users').doc(firebaseUser.uid).get()
          const userData = userDoc.exists ? userDoc.data() : {}
          
          setUser({
            uid: firebaseUser.uid,
            name: (userData && userData.name) || firebaseUser.email?.split("@")[0] || "Usuario",
            email: firebaseUser.email || "",
          })
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.email?.split("@")[0] || "Usuario",
            email: firebaseUser.email || "",
          })
        }
      } else {
        // Usuario no autenticado
        setUser(null)
      }
    })
    
    return () => unsubscribe()
  }, [setUser])
}
