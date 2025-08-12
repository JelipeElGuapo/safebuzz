"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Shield, Camera, Lock, Play, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "./components/navigation"
import ProductCard from "./components/product-card"
import CartSidebar from "./components/cart-sidebar"
import AuthModal from "./components/auth-modal"
import CheckoutModal from "./components/checkout-modal"
import { useCart } from "./hooks/use-cart"
import { useAuth } from "./hooks/use-auth"
import VideoPlayer from "./components/video-player"
import ProductsPage from "./components/products-page"

const featuredProducts = [
  {
    id: 1,
    name: "Sistema de seguridad completo",
    price: 1000,
  image: "https://www.novaseguridad.com.co/wp-content/uploads/2020/11/sistema-de-seguridad-integral.jpg",
    description: "Incluye app móvil, control desde app móvil, sensor de movimiento, alarma, desactivación remota y alerta en tiempo real desde la app.",
    rating: 4.8,
    reviews: 124,
    category: "sistemas",
  },
  {
    id: 2,
    name: "Alarma en tiempo real",
    price: 700,
  image: "https://soporteyatencion.es/wp-content/uploads/2024/03/importancia-del-monitoreo-de-alarmas-en-tiempo-real-beneficios.jpg",
    description: "Alarma en tiempo real desde app móvil y alerta.",
    rating: 4.6,
    reviews: 89,
    category: "alarmas",
  },
  {
    id: 3,
    name: "Kit completo sin app móvil",
    price: 500,
  image: "https://androidayuda.com/wp-content/uploads/2025/05/Como-clonar-apps-en-Huawei-sin-root-5.jpg",
    description: "Kit completo de seguridad, sin app móvil. Incluye sensor de movimiento, alarma y alerta.",
    rating: 4.7,
    reviews: 156,
    category: "kits",
  },
]

const demoVideos = [
  {
    id: 1,
    title: "Video de demostración SafeBuzz",
    thumbnail: "https://img.youtube.com/vi/3-WGMUInaXo/0.jpg",
    videoUrl: "https://www.youtube.com/embed/3-WGMUInaXo",
    duration: "10:00",
  },
  {
    id: 2,
    title: "Video de demostración SafeBuzz",
    thumbnail: "https://img.youtube.com/vi/3-WGMUInaXo/0.jpg",
    videoUrl: "https://www.youtube.com/embed/3-WGMUInaXo",
    duration: "10:00",
  },
  {
    id: 3,
    title: "Video de demostración SafeBuzz",
    thumbnail: "https://img.youtube.com/vi/3-WGMUInaXo/0.jpg",
    videoUrl: "https://www.youtube.com/embed/3-WGMUInaXo",
    duration: "10:00",
  },
]

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()

  // Agregar estado para el reproductor de video
  const [selectedVideo, setSelectedVideo] = useState<(typeof demoVideos)[0] | null>(null)

  // Agregar estado para la página de productos
  const [isProductsPageOpen, setIsProductsPageOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={setAuthModal}
        onProductsClick={() => setIsProductsPageOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">
                <Shield className="w-4 h-4 mr-2" />
                Tecnología Arduino
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Protege tu hogar con
                <span className="text-blue-400 block">SafeBuzz</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Sistemas de seguridad inteligentes con tecnología Arduino. Monitoreo 24/7, alertas en tiempo real y
                control total desde tu móvil.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
                  onClick={() => setIsProductsPageOpen(true)}
                >
                  Ver Productos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-lg px-8 bg-transparent"
                  onClick={() => {
                    document.getElementById("videos")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Ver Demo
                  <Play className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-20">
                <img
                  src="/imagen.webp?height=500&width=600"
                  alt="SafeBuzz Security System"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">¿Por qué elegir SafeBuzz?</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Tecnología de vanguardia con la confiabilidad de Arduino
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Seguridad 24/7",
                description: "Monitoreo continuo con alertas instantáneas",
              },
              {
                icon: Camera,
                title: "Vigilancia HD",
                description: "Cámaras de alta definición con visión nocturna",
              },
              {
                icon: Lock,
                title: "Control Total",
                description: "Gestiona todo desde tu smartphone",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors">
                  <CardHeader className="text-center">
                    <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="productos" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Productos Destacados</h2>
            <p className="text-gray-300 text-lg">Los sistemas de seguridad más avanzados del mercado</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <ProductCard product={product} onAddToCart={() => addToCart(product)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Videos */}
      <section id="videos" className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Videos Demostrativos</h2>
            <p className="text-gray-300 text-lg">Aprende cómo funciona nuestro sistema paso a paso</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card
                  className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70">{video.duration}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{video.title}</CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-blue-900 to-blue-800 border-blue-700 max-w-4xl mx-auto">
              <CardHeader className="pb-8">
                <CardTitle className="text-4xl font-bold text-white mb-4">¿Listo para proteger tu hogar?</CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Únete a miles de familias que ya confían en SafeBuzz
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-blue-900 hover:bg-gray-100 text-lg px-8"
                    onClick={() => setIsProductsPageOpen(true)}
                  >
                    Comprar Ahora
                    <ShoppingCart className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-300 text-blue-100 hover:bg-blue-800 text-lg px-8 bg-transparent"
                    onClick={() => {
                      window.open("mailto:ventas@safebuzz.com", "_blank")
                    }}
                  >
                    Contactar Ventas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Modals and Sidebars */}
      <VideoPlayer video={selectedVideo!} isOpen={!!selectedVideo} onClose={() => setSelectedVideo(null)} />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      <AuthModal type={authModal} onClose={() => setAuthModal(null)} onSwitchType={setAuthModal} />

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      <ProductsPage isOpen={isProductsPageOpen} onClose={() => setIsProductsPageOpen(false)} />
    </div>
  )
}
