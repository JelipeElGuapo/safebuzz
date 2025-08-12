"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductCard from "./product-card"
import { useCart } from "../hooks/use-cart"

const allProducts = [
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

interface ProductsPageProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProductsPage({ isOpen, onClose }: ProductsPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { addToCart } = useCart()

  const filteredProducts = allProducts
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "all" || product.category === selectedCategory),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Todos los Productos</h1>
          <Button variant="ghost" onClick={onClose} className="text-gray-300 hover:text-white">
            Volver al Inicio
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Filtros y Búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="sistemas">Sistemas</SelectItem>
                  <SelectItem value="camaras">Cámaras</SelectItem>
                  <SelectItem value="sensores">Sensores</SelectItem>
                  <SelectItem value="kits">Kits</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="rating">Mejor Calificación</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="bg-slate-700 border-slate-600"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="bg-slate-700 border-slate-600"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                onAddToCart={() => {
                  // Asegura que el precio sea un número
                  addToCart({ ...product, price: Number(product.price) })
                }}
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No se encontraron productos</p>
            <p className="text-gray-500 text-sm mt-2">Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
