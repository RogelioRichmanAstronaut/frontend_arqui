"use client"

import Link from "next/link"
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react"

interface FooterProps {
  locale: string
}

export function Footer({ locale }: FooterProps) {
  const t = (es: string, en: string) => (locale === "es" ? es : en)

  return (
    <footer className="bg-[#F7F9FC] border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-[#0A2540] text-lg mb-4">Trip-In</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t(
                "Viajar es más que llegar a un destino: es vivir experiencias únicas. En Trip-In te ayudamos a planear, comparar y disfrutar tu viaje ideal, con opciones de paquetes, vuelos, hoteles y servicios financieros en un solo lugar.",
                "Travel is more than reaching a destination: it's living unique experiences. At Trip-In we help you plan, compare and enjoy your ideal trip, with packages, flights, hotels and financial services in one place."
              )}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#0A2540] text-lg mb-4">
              {t("Links", "Links")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-[#00C2A8] transition-colors"
                >
                  {t("Inicio", "Home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/packages"
                  className="text-sm text-gray-600 hover:text-[#00C2A8] transition-colors"
                >
                  {t("Paquetes", "Packages")}
                </Link>
              </li>
              <li>
                <Link
                  href="/flights"
                  className="text-sm text-gray-600 hover:text-[#00C2A8] transition-colors"
                >
                  {t("Vuelos", "Flights")}
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-sm text-gray-600 hover:text-[#00C2A8] transition-colors"
                >
                  {t("Soporte", "Support")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[#0A2540] text-lg mb-4">
              {t("Contacto", "Contact")}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Carrera 15 No. 45-10</li>
              <li>Bogotá, Colombia</li>
              <li className="pt-2">
                {t("Teléfono", "Phone")}: +57 (1) 456 7890
              </li>
              <li>
                {t("Correo", "Email")}: contacto@tripin.com.co
              </li>
              <li className="pt-2">
                <a
                  href="https://maps.google.com/?q=Bogotá,Colombia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00C2A8] hover:underline"
                >
                  {t("Mapa: Bogotá, Colombia", "Map: Bogotá, Colombia")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[#0A2540] text-lg mb-4">
              {t("Redes sociales", "Social media")}
            </h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#00C2A8] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#00C2A8] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#00C2A8] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#00C2A8] transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
          © 2025 Trip-In. {t("Todos los derechos reservados", "All rights reserved")}.
        </div>
      </div>
    </footer>
  )
}
