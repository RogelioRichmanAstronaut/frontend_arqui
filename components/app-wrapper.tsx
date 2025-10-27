"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguageStore } from "@/lib/store"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useLanguageStore()

  return (
    <>
      <Navbar locale={locale} onLocaleChange={setLocale} />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer locale={locale} />
    </>
  )
}
