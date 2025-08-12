"use client"

import { useAuthListener } from "../hooks/use-auth"

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Inicializar el listener de autenticación de Firebase
  useAuthListener()
  
  return <>{children}</>
}
