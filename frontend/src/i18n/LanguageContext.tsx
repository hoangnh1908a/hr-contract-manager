'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations, Translations } from './translations'

interface LanguageContextType {
  language: Language
  t: Translations
  changeLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Get saved language from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>('en')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage)
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: translations[language],
        changeLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 
