# International Relations Office (IRO) Website

A modern, responsive website for the International Relations Office built with React and Tailwind CSS.

## Overview

This project is a comprehensive web platform for the International Relations Office, providing information and services related to international academic collaborations, student mobility, visa assistance, and institutional partnerships.

## Features

- **Home**: Landing page with key highlights and quick navigation
- **About**: Institution information and IRO overview
- **Admission**: International student admission information and requirements
- **Collaboration**: Details about academic partnerships and collaboration opportunities
- **Partners**: Directory of partner institutions and organizations
- **Visits**: Information about campus visits and open house events
- **Visa**: Comprehensive visa guidance and documentation support
- **Life**: Student life, accommodation, and cultural activities
- **Gallery**: Photo gallery showcasing campus and events
- **Downloads**: Important documents and resources (forms, guides, etc.)
- **Contact**: Contact information and inquiry form

## Tech Stack

- **Frontend Framework**: React 19.2
- **Build Tool**: Vite 8.0
- **Styling**: Tailwind CSS 4.3
- **Routing**: React Router DOM 7.15
- **Linting**: ESLint 10.0
- **Language**: JavaScript (ES Modules)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd IITDh-InternationalRelationss
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Build for Production

Create an optimized production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

To preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx
│   ├── HeroSection.jsx
│   ├── SubNavigation.jsx
│   ├── FAQAccordion.jsx
│   ├── LanguageSelector.jsx
│   └── ui/             # UI component library
│       ├── Card.jsx
│       ├── CTAButton.jsx
│       ├── ContactCard.jsx
│       └── SectionHeader.jsx
├── pages/              # Page components (route handlers)
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Admission.jsx
│   ├── Collaboration.jsx
│   ├── Contact.jsx
│   ├── Downloads.jsx
│   ├── Gallery.jsx
│   ├── Life.jsx
│   ├── Partners.jsx
│   ├── Visa.jsx
│   └── Visits.jsx
├── config/            # Configuration files
├── App.jsx            # Main app component with routing
├── main.jsx           # React entry point
└── index.css          # Global styles

public/               # Static assets
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint to check code quality |

## Linting

Check code quality:
```bash
npm run lint
```

## Configuration

- **Vite Config**: `vite.config.js`
- **Tailwind Config**: `tailwind.config.js`
- **ESLint Config**: `.eslintrc.js` or `.eslintrc.cjs`

## Browser Support

This application uses modern JavaScript (ES Modules) and CSS features. It supports:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is proprietary and owned by the institution.

## Support

For issues, questions, or suggestions, please contact the International Relations Office or open an issue in the repository.

---

**Last Updated**: 2026-05-21
