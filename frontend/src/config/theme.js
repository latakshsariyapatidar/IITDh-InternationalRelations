// International Relations Office palette (see index.css @theme for the tokens)
export const colors = {
  primary: {
    jamun: '#402052',           // Royal Plum - brand anchor
    jamunDark: '#33193F',       // Plum - hover states
    jamunDarkest: '#2A1538',    // Deep plum - footer and dark surfaces
    jamunLight: '#E8E9ED'       // Cool Mist - borders, quiet surfaces
  },
  accent: {
    marigold: '#D9A441',        // Muted Saffron - accent
    marigoldDark: '#8C6418'     // Deep saffron - accent text on light surfaces
  },
  international: {
    ink: '#243C56',             // Global Ink - partners, exchange, research
    inkDeep: '#172838'
  },
  neutral: {
    white: '#ffffff',
    canvas: '#FAF9F6',          // Soft Porcelain - page canvas
    darkText: '#2A1538',
    lightText: '#3B3F4A',
    mutedText: '#686D7A',
    gray50: '#fafafa',
    gray100: '#f3f4f6',
    gray900: '#111827'
  }
}

// Tailwind class mappings for easy reference
export const tailwindClasses = {
  // Background colors
  bgPrimary: 'bg-plum',
  bgPrimaryDark: 'bg-brand-purpleHover',
  bgPrimaryDarkest: 'bg-plum-deep',
  bgPrimaryLight: 'bg-mist',
  bgAccent: 'bg-saffron',
  bgAccentDark: 'bg-saffron-deep',
  bgInk: 'bg-ink',

  // Text colors
  textPrimary: 'text-plum',
  textAccent: 'text-saffron',
  textAccentDark: 'text-saffron-deep',

  // Hover states
  hoverBgAccent: 'hover:bg-saffron',
  hoverTextAccent: 'hover:text-saffron-deep',
  hoverBgPrimary: 'hover:bg-plum-deep'
}

export default colors
