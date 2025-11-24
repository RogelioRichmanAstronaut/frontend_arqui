"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguageStore } from "@/lib/store"
import { AuthProvider } from "@/lib/context/AuthProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useLanguageStore()
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Navbar locale={locale} onLocaleChange={setLocale} />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer locale={locale} />
      </AuthProvider>
    </QueryClientProvider>
  )
}
