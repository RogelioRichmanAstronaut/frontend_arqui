import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageStore {
  locale: string
  setLocale: (locale: string) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      locale: 'es',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'trip-in-language',
    }
  )
)
