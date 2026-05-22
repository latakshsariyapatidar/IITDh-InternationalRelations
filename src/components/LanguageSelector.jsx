import { useState } from 'react'

const languages = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  // ASEAN Languages
  { code: 'id', flag: '🇮🇩', name: 'Bahasa Indonesia' },
  { code: 'ms', flag: '🇲🇾', name: 'Bahasa Melayu' },
  { code: 'tl', flag: '🇵🇭', name: 'Filipino' },
  { code: 'th', flag: '🇹🇭', name: 'Thai' },
  { code: 'vi', flag: '🇻🇳', name: 'Vietnamese' },
  { code: 'my', flag: '🇲🇲', name: 'Burmese' },
  { code: 'km', flag: '🇰🇭', name: 'Khmer' },
  { code: 'lo', flag: '🇱🇦', name: 'Lao' },
  // Other Languages
  { code: 'zh-CN', flag: '🇨🇳', name: '中文 (Chinese)' },
  { code: 'ta', flag: '🇮🇳', name: 'தமிழ் (Tamil)' },
  { code: 'hi', flag: '🇮🇳', name: 'हिंदी (Hindi)' },
  { code: 'kn', flag: '🇮🇳', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية (Arabic)' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'ko', flag: '🇰🇷', name: '한국어' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'pt', flag: '🇵🇹', name: 'Português' }
]

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [current, setCurrent] = useState(languages[0])

  const handleLanguageChange = (lang) => {
    setCurrent(lang)
    setIsOpen(false)

    // TODO: Integrate with Google Translate or i18n library
    // For now, just update UI
    if (lang.code !== 'en') {
      // Trigger Google Translate or similar
      const googleTranslateElement = document.querySelector('.goog-te-combo')
      if (googleTranslateElement) {
        googleTranslateElement.value = lang.code
        googleTranslateElement.dispatchEvent(new Event('change'))
      }
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 bg-white border border-brand-purpleLight rounded-lg hover:bg-brand-purpleLight/30 transition-colors text-xs font-medium text-brand-purpleDark"
      >
        <span className="text-base">{current.flag}</span>
        <span className="hidden sm:inline">{current.name}</span>
        <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-brand-purpleLight/70 rounded-lg shadow-lg z-50 min-w-64 overflow-hidden">
          {/* Header */}
          <div className="bg-brand-purpleDark px-4 py-3">
            <p className="text-white text-xs font-bold tracking-wider">🌍 SELECT LANGUAGE</p>
          </div>

          {/* Languages Grid */}
          <div className="p-3 grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  current.code === lang.code
                    ? 'bg-brand-purple text-white'
                    : 'bg-transparent text-brand-purpleDark hover:bg-brand-purpleLight/30'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="text-xs">{lang.name}</span>
              </button>
            ))}
          </div>

          {/* English Reset Button */}
          {current.code !== 'en' && (
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={() => handleLanguageChange(languages[0])}
                className="w-full px-3 py-2 bg-brand-purpleLight/40 text-brand-purpleDark rounded-lg text-sm font-bold hover:bg-brand-marigold/20 transition-colors"
              >
                🇬🇧 Reset to English
              </button>
            </div>
          )}
        </div>
      )}

      {/* Close menu on outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden" />
    </div>
  )
}
