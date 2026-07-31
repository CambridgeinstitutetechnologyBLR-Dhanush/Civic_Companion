'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', native: 'English', english: 'English' },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);

    // Save to user preferences
    const prefs = localStorage.getItem('civicPrefs') || '{}';
    try {
      const p = JSON.parse(prefs);
      p.lang = code;
      localStorage.setItem('civicPrefs', JSON.stringify(p));
    } catch (e) { }

    setIsOpen(false);
    setSearch('');
  };

  const filteredLangs = LANGUAGES.filter(l =>
    l.native.toLowerCase().includes(search.toLowerCase()) ||
    l.english.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <Globe size={16} className={isOpen ? 'text-blue-600' : 'text-slate-500'} />
        <span className="hidden sm:inline-block">{currentLang.native}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-[100] mt-2 w-72 origin-top-right overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search languages..."
                className="w-full rounded-xl bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {filteredLangs.length === 0 ? (
              <p className="p-4 text-center text-sm text-slate-500">No languages found</p>
            ) : (
              filteredLangs.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${i18n.language === lang.code
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                >
                  <div className="flex flex-col">
                    <span>{lang.native}</span>
                    <span className={`text-xs ${i18n.language === lang.code ? 'text-blue-600/80' : 'text-slate-400'}`}>
                      {lang.english}
                    </span>
                  </div>
                  {i18n.language === lang.code && <Check size={16} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
