"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "../hooks/use-auth"

interface AuthModalProps {
  type: "login" | "register" | null
  onClose: () => void
  onSwitchType: (type: "login" | "register") => void
}

export default function AuthModal({ type, onClose, onSwitchType }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [localError, setLocalError] = useState("")
  const [showEmailExistsOption, setShowEmailExistsOption] = useState(false)
  
  const { login, register, isLoading, error, clearError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    clearError()
    setShowEmailExistsOption(false)

    // Validaciones básicas
    if (type === "register") {
      if (formData.password !== formData.confirmPassword) {
        setLocalError("Las contraseñas no coinciden")
        return
      }
      if (formData.password.length < 6) {
        setLocalError("La contraseña debe tener al menos 6 caracteres")
        return
      }
      if (!formData.name.trim()) {
        setLocalError("El nombre es requerido")
        return
      }
    }

    try {
      let success = false
      
      if (type === "login") {
        success = await login(formData.email, formData.password)
      } else if (type === "register") {
        success = await register(formData.name, formData.email, formData.password)
        
        // Si el registro falló por email ya existente, mostrar opción de login
        if (!success && error && error.includes("correo ya está registrado")) {
          setShowEmailExistsOption(true)
          return
        }
      }

      if (success) {
        // Limpiar formulario y cerrar modal
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
        setShowEmailExistsOption(false)
        onClose()
      }
    } catch (err) {
      setLocalError("Error inesperado. Intenta nuevamente.")
    }
  }

  const handleSwitchToLogin = () => {
    setShowEmailExistsOption(false)
    clearError()
    setLocalError("")
    onSwitchType("login")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar errores cuando el usuario comience a escribir
    if (localError) setLocalError("")
    if (error) clearError()
  }

  const displayError = localError || error

  return (
    <AnimatePresence>
      {type && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md bg-slate-900 border-slate-700">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute right-2 top-2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardTitle className="text-2xl text-white text-center">
                  {type === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  {type === "login" ? "Ingresa a tu cuenta de SafeBuzz" : "Únete a la comunidad SafeBuzz"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {displayError && (
                  <Alert className="mb-4 border-red-500 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-400">
                      {displayError}
                      {showEmailExistsOption && (
                        <div className="mt-2">
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm"
                            onClick={handleSwitchToLogin}
                            className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                          >
                            Iniciar sesión en su lugar
                          </Button>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {type === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        Nombre completo
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Tu nombre completo"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="pl-10 bg-slate-800 border-slate-600 text-white"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Tu contraseña"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10 bg-slate-800 border-slate-600 text-white"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {type === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white">
                        Confirmar contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirma tu contraseña"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className="pl-10 bg-slate-800 border-slate-600 text-white"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {type === "login" ? "Iniciando sesión..." : "Creando cuenta..."}
                      </span>
                    ) : (
                      type === "login" ? "Iniciar Sesión" : "Crear Cuenta"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-400">{type === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      onSwitchType(type === "login" ? "register" : "login")
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {type === "login" ? "Crear cuenta" : "Iniciar sesión"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
