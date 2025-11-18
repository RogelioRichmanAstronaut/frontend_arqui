"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Luggage, User, Menu } from "lucide-react"
import { Button } from "@/components/(ui)/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/(ui)/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/(ui)/sheet"
import { useState } from "react"

interface NavbarProps {
  locale: string
  onLocaleChange: (locale: string) => void
}

export function Navbar({ locale, onLocaleChange }: NavbarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

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
                  className={`relative text-sm font-medium transition-colors hover:text-[#00C2A8] ${
                    isActive ? "text-[#00C2A8]" : "text-[#0A2540]"
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
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5 text-[#0A2540]" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Luggage className="h-5 w-5 text-[#0A2540]" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5 text-[#0A2540]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  {locale === "es" ? "Perfil" : "Profile"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {locale === "es" ? "Reservas" : "Bookings"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {locale === "es" ? "Cerrar sesión" : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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

                  <div className="border-t pt-4 flex flex-col gap-3">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Heart className="h-4 w-4" />
                      {locale === "es" ? "Favoritos" : "Favorites"}
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Luggage className="h-4 w-4" />
                      {locale === "es" ? "Mis Viajes" : "My Trips"}
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      {locale === "es" ? "Perfil" : "Profile"}
                    </Button>
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
