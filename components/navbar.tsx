"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, User, LogOut, ShoppingCart } from "lucide-react"
import { Button } from "@/components/(ui)/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/(ui)/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/(ui)/sheet"
import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"

interface NavbarProps {
  locale: string
  onLocaleChange: (locale: string) => void
}

export function Navbar({ locale, onLocaleChange }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/auth')
  }

  const navLinks = [
    { href: "/", label: { es: "Inicio", en: "Home" } },
    { href: "/packages", label: { es: "Paquetes", en: "Packages" } },
    { href: "/discover", label: { es: "Descubrir", en: "Discover" } },
    { href: "/support", label: { es: "Soporte", en: "Support" } },
  ]

  const t = (key: { es: string; en: string }) => {
    return locale === "es" ? key.es : key.en
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[#0A2540] font-bold text-xl">
              Trip-In
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex gap-1">
                  {locale.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => onLocaleChange("es")}>
                  ES
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLocaleChange("en")}>
                  EN
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors hover:text-[#00C2A8] ${isActive ? "text-[#00C2A8]" : "text-[#0A2540]"
                    }`}
                >
                  {t(link.label)}
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-[#00C2A8]" />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            {isAuthenticated && (
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <ShoppingCart className={`h-5 w-5 ${pathname === '/cart' ? 'text-[#00C2A8]' : 'text-[#0A2540]'}`} />
                </Button>
              </Link>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <User className={`h-5 w-5 ${pathname.startsWith('/profile') ? 'text-[#00C2A8]' : 'text-[#0A2540]'}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className={pathname === '/profile' ? 'text-[#00C2A8] font-medium' : ''}>
                      {locale === "es" ? "Perfil" : "Profile"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/bookings" className={pathname === '/profile/bookings' ? 'text-[#00C2A8] font-medium' : ''}>
                      {locale === "es" ? "Reservas" : "Bookings"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    {locale === "es" ? "Cerrar sesión" : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="default" className="bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white hidden md:flex">
                  {locale === "es" ? "Iniciar sesión" : "Login"}
                </Button>
              </Link>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6 text-[#0A2540]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col gap-6 mt-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        {locale.toUpperCase()}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => onLocaleChange("es")}>
                        ES
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onLocaleChange("en")}>
                        EN
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-base font-medium text-[#0A2540] hover:text-[#00C2A8] transition-colors"
                    >
                      {t(link.label)}
                    </Link>
                  ))}

                  <div className="border-t pt-4">
                    {isAuthenticated ? (
                      <div className="flex flex-col gap-2">
                        <Link href="/cart" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start gap-2 ${pathname === '/cart' ? 'text-[#00C2A8] bg-[#00C2A8]/10' : ''}`}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            {locale === "es" ? "Carrito" : "Cart"}
                          </Button>
                        </Link>
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start gap-2 ${pathname === '/profile' ? 'text-[#00C2A8] bg-[#00C2A8]/10' : ''}`}
                          >
                            <User className="h-4 w-4" />
                            {locale === "es" ? "Perfil" : "Profile"}
                          </Button>
                        </Link>
                        <Link href="/profile/bookings" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start gap-2 ${pathname === '/profile/bookings' ? 'text-[#00C2A8] bg-[#00C2A8]/10' : ''}`}
                          >
                            <User className="h-4 w-4" />
                            {locale === "es" ? "Reservas" : "Bookings"}
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            handleLogout()
                            setIsOpen(false)
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          {locale === "es" ? "Cerrar sesión" : "Sign out"}
                        </Button>
                      </div>
                    ) : (
                      <Link href="/auth" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white">
                          {locale === "es" ? "Iniciar sesión" : "Login"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
