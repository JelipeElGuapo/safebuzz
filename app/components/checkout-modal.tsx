
"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CreditCard, Smartphone, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "../hooks/use-cart"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  })

  const { total, items, clearCart } = useCart()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setIsComplete(true)
    clearCart()

    // Auto close after success
    setTimeout(() => {
      setIsComplete(false)
      onClose()
    }, 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
            <Card className="w-full max-w-2xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute right-2 top-2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardTitle className="text-2xl text-white">
                  {isComplete ? "¡Compra Exitosa!" : "Finalizar Compra"}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {isComplete ? "Tu pedido ha sido procesado correctamente" : "Completa tu información de pago"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {isComplete ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">¡Gracias por tu compra!</h3>
                    <p className="text-gray-400 mb-4">Recibirás un email de confirmación en breve</p>
                    {/* Total eliminado, no se muestra más en la pantalla de éxito */}
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="space-y-4">
                      <Label className="text-white text-lg">Método de Pago</Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center space-x-2 p-4 border border-slate-600 rounded-lg">
                          <RadioGroupItem value="credit" id="credit" />
                          <Label htmlFor="credit" className="text-white flex items-center">
                            <CreditCard className="w-5 h-5 mr-2" />
                            Tarjeta de Crédito/Débito
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border border-slate-600 rounded-lg">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal" className="text-white flex items-center">
                            <Smartphone className="w-5 h-5 mr-2" />
                            PayPal
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Payment Form */}
                    {paymentMethod === "credit" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber" className="text-white">
                              Número de Tarjeta
                            </Label>
                            <Input
                              id="cardNumber"
                              placeholder="528134478045"
                              value={formData.cardNumber}
                              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                              className="bg-slate-800 border-slate-600 text-white"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate" className="text-white">
                                Fecha de Vencimiento
                              </Label>
                              <Input
                                id="expiryDate"
                                placeholder="MM/AA"
                                value={formData.expiryDate}
                                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                                className="bg-slate-800 border-slate-600 text-white"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv" className="text-white">
                                CVV
                              </Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange("cvv", e.target.value)}
                                className="bg-slate-800 border-slate-600 text-white"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cardName" className="text-white">
                              Nombre en la Tarjeta
                            </Label>
                            <Input
                              id="cardName"
                              placeholder="Juan Pérez"
                              value={formData.cardName}
                              onChange={(e) => handleInputChange("cardName", e.target.value)}
                              className="bg-slate-800 border-slate-600 text-white"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "paypal" && (
                      <div className="text-center py-8">
                        <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
                          <Smartphone className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                          <p className="text-white mb-4">Serás redirigido a PayPal para completar el pago</p>
                          {/* Total eliminado, no se muestra más en PayPal */}
                        </div>
                      </div>
                    )}

                    {/* Billing Information */}
                    <div className="space-y-4">
                      <Label className="text-white text-lg">Información de Facturación</Label>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="bg-slate-800 border-slate-600 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-white">Dirección</Label>
                          <Input
                            id="address"
                            placeholder="Calle 123, Colonia Centro"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className="bg-slate-800 border-slate-600 text-white"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city" className="text-white">Ciudad</Label>
                            <Input
                              id="city"
                              placeholder="Ciudad de México"
                              value={formData.city}
                              onChange={(e) => handleInputChange("city", e.target.value)}
                              className="bg-slate-800 border-slate-600 text-white"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zipCode" className="text-white">Código Postal</Label>
                            <Input
                              id="zipCode"
                              placeholder="12345"
                              value={formData.zipCode}
                              onChange={(e) => handleInputChange("zipCode", e.target.value)}
                              className="bg-slate-800 border-slate-600 text-white"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resumen Detallado de Productos */}
                    <div className="space-y-4">
                      <Label className="text-white text-lg">Resumen del Pedido</Label>
                      <Card className="bg-slate-800 border-slate-600">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center">
                                <div className="flex-1">
                                  <p className="text-white text-sm font-medium">{item.name}</p>
                                  <p className="text-gray-400 text-xs">
                                    ${item.price.toFixed(2)} × {item.quantity}
                                  </p>
                                </div>
                                <p className="text-blue-400 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator className="bg-slate-700" />


                    <a
                      href={`https://wa.me/528134478045?text=${encodeURIComponent(
                        `Hola, quiero finalizar mi compra.\nProductos:\n${items
                          .map((item) => `- ${item.name} ($${Number(item.price).toFixed(2)})`)
                          .join("\n")}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-600 hover:bg-green-700 text-xl py-8 font-bold text-center rounded-lg"
                    >
                      🟢 Finalizar y Pagar por WhatsApp
                    </a>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
