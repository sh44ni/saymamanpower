import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // 1. Check saved preference
    const savedLang = localStorage.getItem("language") as Language;

    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      applyLanguage(savedLang);
    } else {
      // 2. Fallback to browser language
      const browserLang = navigator.language.split("-")[0];
      const detectedLang: Language = browserLang === "ar" ? "ar" : "en";
      applyLanguage(detectedLang);
    }
  }, []);

  const applyLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const setLanguage = (lang: Language) => {
    applyLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        dir: language === "ar" ? "rtl" : "ltr",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}