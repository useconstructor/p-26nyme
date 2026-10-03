'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Menu,
  X,
  MapPin,
  Clock,
  Phone,
  Star,
  Users,
  Leaf,
  Calendar,
  ArrowRight,
  ChevronRight,
  Utensils,
  Flame,
  Heart,
  Instagram,
  Facebook,
  Mail,
  Check,
} from 'lucide-react'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
}

const locations = [
  { name: 'Centro Histórico', area: 'Centro', hours: '10:00 - 23:00' },
  { name: 'Polanco', area: 'Miguel Hidalgo', hours: '10:00 - 00:00' },
  { name: 'Roma Norte', area: 'Cuauhtémoc', hours: '9:00 - 01:00' },
  { name: 'Coyoacán', area: 'Coyoacán', hours: '11:00 - 22:00' },
  { name: 'Condesa', area: 'Cuauhtémoc', hours: '10:00 - 23:30' },
]

const testimonials = [
  {
    quote: 'El Califa redefinió lo que significa calidad en la comida callejera. Cada taco es una obra maestra.',
    author: 'María R.',
    role: 'Chef Ejecutiva',
    initials: 'MR',
    color: 'bg-orange-100 text-orange-800',
  },
  {
    quote: 'Vengo aquí cada semana. La consistencia y el sabor son incomparables en toda la ciudad.',
    author: 'David C.',
    role: 'Abogado, CDMX',
    initials: 'DC',
    color: 'bg-emerald-100 text-emerald-800',
  },
  {
    quote: 'La mejor experiencia gastronómica por peso invertido en la ciudad. Simplemente excepcional.',
    author: 'Alejandra M.',
    role: 'Food Journalist',
    initials: 'AM',
    color: 'bg-amber-100 text-amber-800',
  },
]

const pricingTiers = [
  {
    name: 'Prueba',
    price: 180,
    description: 'Perfecto para una probadita',
    features: ['3 tacos al pastor', 'Agua fresca incluida', 'Salsas de la casa'],
    highlight: false,
  },
  {
    name: 'Favorita',
    price: 420,
    description: 'Nuestra selección más popular',
    features: ['6 tacos surtidos', 'Guacamole fresco', 'Cilantro y limón', 'Agua fresca', 'Envío local gratis'],
    highlight: true,
  },
  {
    name: 'Fiesta',
    price: 1200,
    description: 'Para compartir en grupo',
    features: ['18 tacos surtidos', 'Guacamole y jalapeños', 'Salsas roja y verde', 'Consomé caliente', 'Sirve 4 a 5 personas', 'Incluye utensilios'],
    highlight: false,
  },
]

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState('Especialidades')
  const [reservationForm, setReservationForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Centro Histórico',
    date: '',
    time: '13:00',
    party_size: 2,
    notes: '',
  })
  const [reservationStatus, setReservationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const categories = [...new Set(menuItems.map((item) => item.category))]

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setReservationStatus('loading')

    try {
      const apiUrl = process.env.NEXT_PUBLIC_CONSTRUCTOR_API
      const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

      if (apiUrl && projectId) {
        await fetch(`${apiUrl}/v1/forms/${projectId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'reservation',
            ...reservationForm,
          }),
        })
      }

      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationForm),
      })

      setReservationStatus('success')
    } catch {
      setReservationStatus('error')
    }
  }

  const navItems = [
    { label: 'Menú', href: '#menu' },
    { label: 'Ubicaciones', href: '#ubicaciones' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Pedidos', href: '#pedidos' },
  ]

  return (
    <main className="min-h-screen bg-[#FBF7F0]">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FBF7F0]/95 backdrop-blur-sm border-b border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="flex items-center gap-2">
              <Flame className="w-8 h-8 text-[#D97706]" />
              <span className="text-xl font-bold text-[#1F2937]">El Califa</span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[#6B7280] hover:text-[#D97706] transition-colors font-medium"
                >
                  {item.label}
                </a>
              ))}
              <Button asChild className="bg-[#D97706] hover:bg-[#B45309] text-white">
                <a href="#reservar">Reservar Mesa</a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1F2937]"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Panel */}
        <div
          className={`md:hidden absolute top-16 left-0 right-0 bg-[#FBF7F0] border-b border-[#E5E0D5] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-[#1F2937] hover:text-[#D97706] font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transitionDelay: mobileMenuOpen ? `${index * 60}ms` : '0ms' }}
              >
                {item.label}
              </a>
            ))}
            <Button asChild className="w-full mt-4 bg-[#D97706] hover:bg-[#B45309] text-white">
              <a href="#reservar" onClick={() => setMobileMenuOpen(false)}>
                Reservar Mesa
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Split Section */}
      <section className="pt-16 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <Badge className="bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20 border-none text-sm px-4 py-1">
                Desde 1987 • 8 Ubicaciones en CDMX
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight">
                Tacos de Verdad,{' '}
                <span className="text-[#D97706]">Desde 1987</span>
              </h1>
              <p className="text-lg sm:text-xl text-[#6B7280] leading-relaxed max-w-xl">
                Carne asada, al pastor, y barbacoa perfeccionados a través de décadas de tradición en la Ciudad de México.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-[#D97706] hover:bg-[#B45309] text-white text-lg px-8">
                  <a href="#menu">
                    Ver Menú y Ubicaciones
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-[#D97706] text-[#D97706] hover:bg-[#D97706]/10 text-lg px-8">
                  <a href="#pedidos">Ordena Ahora</a>
                </Button>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative">
              <div className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero.png"
                  alt="Taco al pastor de El Califa con piña, cilantro y cebolla"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#D97706] rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
                <div>
                  <p className="font-bold text-[#1F2937]">4.9 Estrellas</p>
                  <p className="text-sm text-[#6B7280]">+14,000 reseñas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-[#1F2937] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MapPin, value: '8', label: 'Ubicaciones en CDMX' },
              { icon: Users, value: '14,000+', label: 'Clientes Diarios' },
              { icon: Leaf, value: '100%', label: 'Carne Sostenible' },
              { icon: Calendar, value: '1987', label: 'Año de Fundación' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-[#D97706] mx-auto mb-3" />
                <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-[#9CA3AF] text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Categories Section */}
      <section id="menu" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#047857]/10 text-[#047857] hover:bg-[#047857]/20 border-none mb-4">
              Nuestro Menú
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] mb-4">
              Sabores Auténticos
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Cada platillo preparado con ingredientes frescos y técnicas tradicionales heredadas por generaciones.
            </p>
          </div>

          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-[#D97706] text-white'
                      : 'bg-white text-[#6B7280] hover:bg-[#D97706]/10 hover:text-[#D97706]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Menu Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems
              .filter((item) => item.category === activeCategory)
              .map((item) => (
                <Card key={item.id} className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl text-[#1F2937] group-hover:text-[#D97706] transition-colors">
                        {item.name}
                      </CardTitle>
                      <span className="text-xl font-bold text-[#D97706]">${item.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#6B7280]">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
          </div>

          {menuItems.length === 0 && (
            <div className="text-center py-12">
              <Utensils className="w-12 h-12 text-[#D97706] mx-auto mb-4" />
              <p className="text-[#6B7280]">Cargando menú...</p>
            </div>
          )}
        </div>
      </section>

      {/* Locations Section */}
      <section id="ubicaciones" className="py-20 lg:py-28 bg-[#FEFCF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20 border-none mb-4">
              Encuéntranos
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] mb-4">
              Nuestras Ubicaciones
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              8 sucursales en los mejores rumbos de la Ciudad de México para servirte.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <Card key={index} className="bg-white border-none shadow-lg overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-[#1F2937] to-[#374151] relative">
                  <iframe
                    src={`https://maps.google.com/maps?q=El+Califa+${location.name}+Mexico+City&output=embed`}
                    className="w-full h-full opacity-80"
                    allowFullScreen
                    loading="lazy"
                    title={`Mapa de ${location.name}`}
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#1F2937] mb-2">{location.name}</h3>
                  <div className="space-y-2 text-[#6B7280]">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D97706]" />
                      {location.area}, CDMX
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D97706]" />
                      {location.hours}
                    </p>
                  </div>
                  <Button asChild className="w-full mt-4 bg-[#D97706] hover:bg-[#B45309] text-white">
                    <a href="#reservar">
                      Reservar Mesa
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Split Section */}
      <section id="nosotros" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/feature.png"
                  alt="Ingredientes frescos de El Califa"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#D97706]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#047857]/20 rounded-full blur-2xl" />
            </div>

            {/* Right: Text Content */}
            <div className="space-y-6">
              <Badge className="bg-[#047857]/10 text-[#047857] hover:bg-[#047857]/20 border-none">
                Nuestra Filosofía
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937]">
                Ingredientes Auténticos, Preparados con Respeto
              </h2>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                Desde 1987, El Califa ha sido sinónimo de calidad en la Ciudad de México. Nuestra carne proviene de ranchos familiares en Querétaro e Hidalgo, donde las tradiciones ganaderas se mantienen vivas.
              </p>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                Cada taco es el resultado de técnicas heredadas por tres generaciones: el marinado perfecto del al pastor, el punto exacto del asado a fuego de mesquite, y la barbacoa cocinada lentamente durante 12 horas.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { icon: Leaf, text: 'Ingredientes locales' },
                  { icon: Flame, text: 'Fuego de mesquite' },
                  { icon: Heart, text: 'Recetas familiares' },
                  { icon: Star, text: 'Calidad premium' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D97706]/10 rounded-full flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#D97706]" />
                    </div>
                    <span className="text-[#1F2937] font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 lg:py-28 bg-[#1F2937]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#D97706]/20 text-[#D97706] hover:bg-[#D97706]/30 border-none mb-4">
              Testimonios
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Lo Que Dicen Nuestros Clientes
            </h2>
          </div>

          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  activeTestimonial === index
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 absolute inset-0'
                }`}
              >
                <Card className="bg-white/10 backdrop-blur border-none text-center p-8 lg:p-12">
                  <CardContent className="space-y-6">
                    <div className="flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-[#D97706] fill-[#D97706]" />
                      ))}
                    </div>
                    <p className="text-xl lg:text-2xl text-white leading-relaxed italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center font-bold`}>
                        {testimonial.initials}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white">{testimonial.author}</p>
                        <p className="text-[#9CA3AF] text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeTestimonial === index ? 'bg-[#D97706] w-8' : 'bg-white/30'
                  }`}
                  aria-label={`Ver testimonio ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pedidos" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20 border-none mb-4">
              Pedidos Para Llevar
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] mb-4">
              Paquetes de Tacos
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Lleva el sabor de El Califa a tu casa con nuestros paquetes especiales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden ${
                  tier.highlight
                    ? 'bg-[#1F2937] border-[#D97706] border-2 scale-105'
                    : 'bg-white border-none'
                } shadow-xl`}
              >
                {tier.highlight && (
                  <div className="absolute top-0 right-0 bg-[#D97706] text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                    Más Popular
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className={`text-2xl ${tier.highlight ? 'text-white' : 'text-[#1F2937]'}`}>
                    {tier.name}
                  </CardTitle>
                  <p className={`text-sm ${tier.highlight ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                    {tier.description}
                  </p>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div>
                    <span className={`text-5xl font-bold ${tier.highlight ? 'text-white' : 'text-[#1F2937]'}`}>
                      ${tier.price}
                    </span>
                    <span className={`text-lg ${tier.highlight ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}> MXN</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className={`w-5 h-5 ${tier.highlight ? 'text-[#D97706]' : 'text-[#047857]'}`} />
                        <span className={tier.highlight ? 'text-[#E5E7EB]' : 'text-[#6B7280]'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full ${
                      tier.highlight
                        ? 'bg-[#D97706] hover:bg-[#B45309] text-white'
                        : 'bg-[#1F2937] hover:bg-[#374151] text-white'
                    }`}
                  >
                    <a href="https://wa.me/5215512345678?text=Hola%2C%20quiero%20ordenar%20el%20paquete%20${tier.name}" target="_blank" rel="noopener noreferrer">
                      Ordenar Ahora
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Masonry */}
      <section className="py-20 lg:py-28 bg-[#FEFCF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#047857]/10 text-[#047857] hover:bg-[#047857]/20 border-none mb-4">
              Galería
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] mb-4">
              El Arte del Taco
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* CSS Art Gallery - no external images */}
            <div className="col-span-2 row-span-2 rounded-2xl bg-gradient-to-br from-[#D97706] to-[#B45309] p-8 flex items-end">
              <div>
                <p className="text-white/80 text-sm mb-2">Especialidad de la casa</p>
                <p className="text-white text-2xl font-bold">Al Pastor Clásico</p>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-[#047857] to-[#065F46] p-6 flex flex-col justify-between aspect-square">
              <Leaf className="w-8 h-8 text-white/60" />
              <p className="text-white font-semibold">Cilantro Fresco</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-[#1F2937] to-[#374151] p-6 flex flex-col justify-between aspect-square">
              <Flame className="w-8 h-8 text-[#D97706]" />
              <p className="text-white font-semibold">Fuego de Mesquite</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 p-6 flex flex-col justify-between aspect-square">
              <div className="w-12 h-12 rounded-full bg-[#D97706]/20" />
              <p className="text-[#1F2937] font-semibold">Tortillas Hechas a Mano</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-red-500 to-red-700 p-6 flex flex-col justify-between aspect-square">
              <Heart className="w-8 h-8 text-white/60" />
              <p className="text-white font-semibold">Salsa de la Casa</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-gradient-to-r from-[#1F2937] via-[#374151] to-[#1F2937] p-8 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#D97706] text-4xl font-bold mb-2">37+</p>
                <p className="text-white">Años de Tradición</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Full + Reservation Form */}
      <section id="reservar" className="py-20 lg:py-28 bg-gradient-to-br from-[#1F2937] to-[#374151]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: CTA Text */}
            <div className="text-center lg:text-left">
              <Badge className="bg-[#D97706]/20 text-[#D97706] hover:bg-[#D97706]/30 border-none mb-4">
                Reservaciones
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Reserva Tu Mesa
              </h2>
              <p className="text-lg text-[#9CA3AF] mb-8 max-w-xl">
                Asegura tu lugar en cualquiera de nuestras 8 ubicaciones. Reserva ahora y disfruta de la mejor experiencia taquera de la ciudad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="https://wa.me/5215512345678?text=Hola%2C%20quiero%20hacer%20una%20reservación"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  WhatsApp
                </a>
                <a
                  href="https://instagram.com/elcalifa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  Síguenos
                </a>
              </div>
            </div>

            {/* Right: Reservation Form */}
            <Card className="bg-white border-none shadow-2xl">
              <CardContent className="p-8">
                {reservationStatus === 'success' ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-[#047857]/10 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8 text-[#047857]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1F2937]">Reservación Enviada</h3>
                    <p className="text-[#6B7280]">
                      Te contactaremos pronto para confirmar tu mesa. ¡Gracias por elegir El Califa!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReservationSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold text-[#1F2937] mb-4">Solicita tu Reservación</h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1F2937] mb-1">Nombre</label>
                        <Input
                          type="text"
                          required
                          value={reservationForm.name}
                          onChange={(e) => setReservationForm({ ...reservationForm, name: e.target.value })}
                          placeholder="Tu nombre"
                          className="bg-[#FBF7F0] border-[#E5E0D5]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1F2937] mb-1">Email</label>
                        <Input
                          type="email"
                          required
                          value={reservationForm.email}
                          onChange={(e) => setReservationForm({ ...reservationForm, email: e.target.value })}
                          placeholder="tu@email.com"
                          className="bg-[#FBF7F0] border-[#E5E0D5]"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1F2937] mb-1">Teléfono</label>
                        <Input
                          type="tel"
                          value={reservationForm.phone}
                          onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                          placeholder="55 1234 5678"
                          className="bg-[#FBF7F0] border-[#E5E0D5]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1F2937] mb-1">Ubicación</label>
                        <select
                          required
                          value={reservationForm.location}
                          onChange={(e) => setReservationForm({ ...reservationForm, location: e.target.value })}
                          className="w-full h-10 px-3 rounded-md bg-[#FBF7F0] border border-[#E5E0D5] text-[#1F2937]"
                        >
                          {locations.map((loc) => (
                            <option key={loc.name} value={loc.name}>
                              {loc.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1F2937] mb-1">Fecha</label>
                        <Input
                          type="date"
                          required
                          value={reservationForm.date}
                          onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="bg-[#FBF7F0] border-[#E5E0D5]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1F2937] mb-1">Hora</label>
                        <select
                          required
                          value={reservationForm.time}
                          onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                          className="w-full h-10 px-3 rounded-md bg-[#FBF7F0] border border-[#E5E0D5] text-[#1F2937]"
                        >
                          {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1F2937] mb-1">Personas</label>
                        <select
                          required
                          value={reservationForm.party_size}
                          onChange={(e) => setReservationForm({ ...reservationForm, party_size: parseInt(e.target.value) })}
                          className="w-full h-10 px-3 rounded-md bg-[#FBF7F0] border border-[#E5E0D5] text-[#1F2937]"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'persona' : 'personas'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1F2937] mb-1">Notas (opcional)</label>
                      <Textarea
                        value={reservationForm.notes}
                        onChange={(e) => setReservationForm({ ...reservationForm, notes: e.target.value })}
                        placeholder="Alergias, ocasiones especiales, etc."
                        className="bg-[#FBF7F0] border-[#E5E0D5]"
                        rows={3}
                      />
                    </div>

                    {reservationStatus === 'error' && (
                      <p className="text-red-500 text-sm">Hubo un error. Por favor intenta de nuevo.</p>
                    )}

                    <Button
                      type="submit"
                      disabled={reservationStatus === 'loading'}
                      className="w-full bg-[#D97706] hover:bg-[#B45309] text-white text-lg py-6"
                    >
                      {reservationStatus === 'loading' ? 'Enviando...' : 'Solicitar Reservación'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] border-t border-[#374151] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-8 h-8 text-[#D97706]" />
                <span className="text-xl font-bold text-white">El Califa</span>
              </div>
              <p className="text-[#9CA3AF]">
                Tacos de verdad, desde 1987. La mejor experiencia taquera de la Ciudad de México.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/elcalifa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#374151] rounded-full flex items-center justify-center text-white hover:bg-[#D97706] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com/elcalifa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#374151] rounded-full flex items-center justify-center text-white hover:bg-[#D97706] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="mailto:contacto@elcalifa.mx"
                  className="w-10 h-10 bg-[#374151] rounded-full flex items-center justify-center text-white hover:bg-[#D97706] transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-white font-semibold mb-4">Navegación</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Menú', href: '#menu' },
                  { label: 'Ubicaciones', href: '#ubicaciones' },
                  { label: 'Nosotros', href: '#nosotros' },
                  { label: 'Pedidos', href: '#pedidos' },
                  { label: 'Reservar', href: '#reservar' },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-[#9CA3AF] hover:text-[#D97706] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div>
              <h4 className="text-white font-semibold mb-4">Ubicaciones</h4>
              <ul className="space-y-3">
                {locations.slice(0, 5).map((loc) => (
                  <li key={loc.name} className="text-[#9CA3AF]">
                    {loc.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <ul className="space-y-3 text-[#9CA3AF]">
                <li>
                  <a href="mailto:contacto@elcalifa.mx" className="hover:text-[#D97706] transition-colors">
                    contacto@elcalifa.mx
                  </a>
                </li>
                <li>Ciudad de México, México</li>
                <li className="pt-4">
                  <a
                    href="https://wa.me/5215512345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#374151] mt-12 pt-8 text-center">
            <p className="text-[#9CA3AF] text-sm">
              © {new Date().getFullYear()} El Califa. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5215512345678?text=Hola%2C%20tengo%20una%20pregunta"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white rounded-full p-4 shadow-lg hover:bg-[#128C7E] transition-colors"
        aria-label="Contactar por WhatsApp"
      >
        <Phone className="w-6 h-6" />
      </a>
    </main>
  )
}
