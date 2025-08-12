"use client"

import { motion } from "framer-motion"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  rating: number
  reviews: number
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  viewMode?: "grid" | "list"
}

export default function ProductCard({ product, onAddToCart, viewMode = "grid" }: ProductCardProps) {
  if (viewMode === "list") {
    return (
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.3 }}>
        <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors overflow-hidden">
          <div className="flex">
            <div className="w-48 h-32 flex-shrink-0">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                <span className="text-2xl font-bold text-blue-400">${product.price}</span>
              </div>
              <CardDescription className="text-gray-300 mb-4">{product.description}</CardDescription>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.rating} ({product.reviews} reseñas)
                  </span>
                </div>
                <Button onClick={() => onAddToCart(product)} className="bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  // Grid view (existing code remains the same)
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors overflow-hidden group">
        <div className="relative overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-4 left-4 bg-blue-600">Nuevo</Badge>
        </div>

        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">{product.name}</CardTitle>
            <span className="text-2xl font-bold text-blue-400">${product.price}</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-400"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              {product.rating} ({product.reviews} reseñas)
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <CardDescription className="text-gray-300 mb-4">{product.description}</CardDescription>

          <Button onClick={() => onAddToCart(product)} className="w-full bg-blue-600 hover:bg-blue-700">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Agregar al Carrito
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
