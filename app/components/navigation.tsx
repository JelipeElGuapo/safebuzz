"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Menu, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "../hooks/use-cart"
import { useAuth } from "../hooks/use-auth"

interface NavigationProps {
  onCartClick: () => void
  onAuthClick: (type: "login" | "register") => void
  onProductsClick: () => void
}

export default function Navigation({ onCartClick, onAuthClick, onProductsClick }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items } = useCart()
  const { user, logout } = useAuth()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Shield className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">SafeBuzz</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-4 py-2 rounded-md font-medium text-white bg-transparent hover:bg-blue-700 hover:text-white transition-colors"
            >
              Inicio
            </button>
            <button onClick={onProductsClick} className="px-4 py-2 rounded-md font-medium text-white bg-transparent hover:bg-blue-700 hover:text-white transition-colors">
              Productos
            </button>
            <button
              onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 rounded-md font-medium text-white bg-transparent hover:bg-blue-700 hover:text-white transition-colors"
            >
              Videos
            </button>
            <a
              href="/app-release.apk"
              download
              className="px-4 py-2 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              App Móvil
            </a>
            <button
              onClick={() => window.open('mailto:soporte@safebuzz.com', '_blank')}
              className="px-4 py-2 rounded-md font-medium text-white bg-transparent hover:bg-blue-700 hover:text-white transition-colors"
            >
              Soporte
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative text-gray-300 hover:text-blue-400"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 hidden sm:block">Hola, {user.name}</span>
                <Button variant="ghost" size="sm" onClick={logout} className="text-gray-300 hover:text-blue-400">
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAuthClick("login")}
                  className="text-gray-300 hover:text-blue-400"
                >
                  Iniciar Sesión
                </Button>
                <Button size="sm" onClick={() => onAuthClick("register")} className="bg-blue-600 hover:bg-blue-700">
                  Crear Cuenta
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-800 py-4"
          >
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
                className="text-gray-300 hover:text-blue-400 transition-colors text-left"
              >
                Inicio
              </button>
              <button
                onClick={() => {
                  onProductsClick()
                  setIsMenuOpen(false)
                }}
                className="text-gray-300 hover:text-blue-400 transition-colors text-left"
              >
                Productos
              </button>
              <button
                onClick={() => {
                  document.getElementById("videos")?.scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
                className="text-gray-300 hover:text-blue-400 transition-colors text-left"
              >
                Videos
              </button>
              <button
                onClick={() => {
                  window.open("mailto:soporte@safebuzz.com", "_blank")
                  setIsMenuOpen(false)
                }}
                className="text-gray-300 hover:text-blue-400 transition-colors text-left"
              >
                Soporte
              </button>

              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-slate-800">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onAuthClick("login")
                      setIsMenuOpen(false)
                    }}
                    className="justify-start text-gray-300 hover:text-blue-400"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    onClick={() => {
                      onAuthClick("register")
                      setIsMenuOpen(false)
                    }}
                    className="justify-start bg-blue-600 hover:bg-blue-700"
                  >
                    Crear Cuenta
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
