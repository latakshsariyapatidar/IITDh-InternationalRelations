import tailwindcss from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iitdh: {
          jamun: '#7F5283',
          'jamun-dark': '#3D3C42',
          'jamun-darkest': '#3D3C42',
          'jamun-light': '#FEFBF6',
          marigold: '#A6D1E6',
          'marigold-dark': '#A6D1E6',
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.65s ease forwards',
        marquee: 'marquee 32s linear infinite',
        dot: 'dot 1.6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(22px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        marquee: {
          'from': {
            transform: 'translateX(0)',
          },
          'to': {
            transform: 'translateX(-50%)',
          },
        },
        dot: {
          '0%, 100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
          '60%': {
            transform: 'translateY(7px)',
            opacity: '0.3',
          },
        },
      },
    },
  },
  plugins: [],
}
