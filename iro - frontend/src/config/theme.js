// IIT Dharwad Official Brand Colors
export const colors = {
  primary: {
    jamun: '#89288F',           // IIT Dharwad purple - primary color
    jamunDark: '#5E1C64',       // Deep plum - hover states
    jamunDarkest: '#421447',    // Deepest plum - footer background
    jamunLight: '#E7D1E9'       // Soft lavender - backgrounds, accents
  },
  accent: {
    marigold: '#EF9F27',        // Gold/Amber - accent, CTA buttons
    marigoldDark: '#D58816'     // Gold/Amber - hover states
  },
  neutral: {
    white: '#ffffff',
    darkText: '#5E1C64',
    lightText: '#4B5563',
    mutedText: '#9CA3AF',
    gray50: '#fafafa',
    gray100: '#f3f4f6',
    gray900: '#111827'
  }
}

// Tailwind class mappings for easy reference
export const tailwindClasses = {
  // Background colors
  bgPrimary: 'bg-[#89288F]',
  bgPrimaryDark: 'bg-[#5E1C64]',
  bgPrimaryDarkest: 'bg-[#421447]',
  bgPrimaryLight: 'bg-[#E7D1E9]',
  bgAccent: 'bg-[#EF9F27]',
  bgAccentDark: 'bg-[#D58816]',

  // Text colors
  textPrimary: 'text-[#89288F]',
  textAccent: 'text-[#EF9F27]',
  textAccentDark: 'text-[#D58816]',

  // Hover states
  hoverBgAccent: 'hover:bg-[#EF9F27]',
  hoverTextAccent: 'hover:text-[#EF9F27]',
  hoverBgPrimary: 'hover:bg-[#5E1C64]'
}

export default colors
