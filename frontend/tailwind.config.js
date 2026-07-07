
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         iitdh: {
//           jamun: '#7F5283',
//           'jamun-dark': '#3D3C42',
//           'jamun-darkest': '#3D3C42',
//           'jamun-light': '#FEFBF6',
//           marigold: '#A6D1E6',
//           'marigold-dark': '#A6D1E6',
//         },
//       },
//       animation: {
//         fadeUp: 'fadeUp 0.65s ease forwards',
//         marquee: 'marquee 32s linear infinite',
//         dot: 'dot 1.6s ease-in-out infinite',
//       },
//       keyframes: {
//         fadeUp: {
//           'from': {
//             opacity: '0',
//             transform: 'translateY(22px)',
//           },
//           'to': {
//             opacity: '1',
//             transform: 'translateY(0)',
//           },
//         },
//         marquee: {
//           'from': {
//             transform: 'translateX(0)',
//           },
//           'to': {
//             transform: 'translateX(-50%)',
//           },
//         },
//         dot: {
//           '0%, 100%': {
//             transform: 'translateY(0)',
//             opacity: '1',
//           },
//           '60%': {
//             transform: 'translateY(7px)',
//             opacity: '0.3',
//           },
//         },
//       },
//     },
//   },
//   plugins: [],
// }


export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        purple: {
          DEFAULT: '#6c1b85',
          hover: '#4e1161',
          dark: '#2a0535',
          light: '#f5eefa',
        },
        marigold: {
          DEFAULT: '#ffad4a',
          dark: '#e89530',
        },
        canvas: '#fafafa',
        text: '#1a0a2e',
      },
      transitionTimingFunction: {
        'custom-bezier': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
};

