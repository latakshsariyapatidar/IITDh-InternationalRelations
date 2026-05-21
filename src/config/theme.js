// IIT Dharwad Official Brand Colors
export const colors = {
  primary: {
    jamun: '#7F5283',           // Jamun Purple - primary color
    jamunDark: '#3D3C42',       // Jamun Dark - hover states
    jamunDarkest: '#3D3C42',    // Jamun Darkest - footer background
    jamunLight: '#FEFBF6'       // Jamun Light - backgrounds, accents
  },
  accent: {
    marigold: '#A6D1E6',        // Marigold - accent, CTA buttons
    marigoldDark: '#A6D1E6'     // Marigold Dark - hover states
  },
  neutral: {
    white: '#ffffff',
    darkText: '#1a0a2e',
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
  bgPrimary: 'bg-[#7F5283]',
  bgPrimaryDark: 'bg-[#3D3C42]',
  bgPrimaryDarkest: 'bg-[#3D3C42]',
  bgPrimaryLight: 'bg-[#FEFBF6]',
  bgAccent: 'bg-[#A6D1E6]',
  bgAccentDark: 'bg-[#A6D1E6]',

  // Text colors
  textPrimary: 'text-[#7F5283]',
  textAccent: 'text-[#A6D1E6]',
  textAccentDark: 'text-[#A6D1E6]',

  // Hover states
  hoverBgAccent: 'hover:bg-[#A6D1E6]',
  hoverTextAccent: 'hover:text-[#A6D1E6]',
  hoverBgPrimary: 'hover:bg-[#3D3C42]'
}

export default colors
