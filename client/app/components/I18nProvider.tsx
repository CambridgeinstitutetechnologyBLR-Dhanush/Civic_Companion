'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../lib/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Restore language from localStorage if available
    const prefs = localStorage.getItem('civicPrefs');
    if (prefs) {
      try {
        const p = JSON.parse(prefs);
        if (p.lang && i18n.language !== p.lang) {
          i18n.changeLanguage(p.lang);
        }
      } catch (e) {}
    }
    
    // Update RTL/LTR dir and language on the html tag based on language change
    const updateHtmlAttrs = () => {
      document.documentElement.lang = i18n.language;
      document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
      
      // Remove any existing noto font classes
      document.documentElement.className = document.documentElement.className.replace(/\bfont-noto-[\w]+\b/g, '');
      // Add font class
      const scriptMap: Record<string, string> = {
        ur: 'font-noto-nastaliq',
        hi: 'font-noto-devanagari',
        mr: 'font-noto-devanagari',
        kn: 'font-noto-kannada',
        ta: 'font-noto-tamil',
        te: 'font-noto-telugu',
        ml: 'font-noto-malayalam',
        gu: 'font-noto-gujarati',
        bn: 'font-noto-bengali',
        pa: 'font-noto-gurmukhi',
        or: 'font-noto-oriya'
      };
      const fontClass = scriptMap[i18n.language];
      if (fontClass) {
        document.documentElement.classList.add(fontClass);
      }
    };
    
    i18n.on('languageChanged', updateHtmlAttrs);
    updateHtmlAttrs();
    setMounted(true);
    
    return () => {
      i18n.off('languageChanged', updateHtmlAttrs);
    };
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return <div style={{ visibility: 'hidden' }}>{children}</div>;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
