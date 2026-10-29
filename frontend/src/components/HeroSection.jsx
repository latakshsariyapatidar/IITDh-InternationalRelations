import { useLocation } from 'react-router-dom'
import ScrollDownArrow from './ui/ScrollDownArrow'

// Mapping routes to specific high-res institute campus photos
// Note the exact casing and extensions: Institute1-5 are .jpg (capital I), institute6-10 are .webp (lowercase i)
const ROUTE_IMAGE_MAP = {
  '/about': '/institute/Institute1.jpg',
  '/international-admissions': '/institute/Institute2.jpg',
  '/admission': '/institute/Institute2.jpg',
  '/international-mobility': '/institute/Institute3.jpg',
  '/collaboration': '/institute/Institute3.jpg',
  '/partners': '/institute/Institute4.jpg',
  '/visa': '/institute/Institute5.jpg',
  '/downloads': '/institute/institute6.webp',
  '/life': '/institute/institute7.webp',
  '/visits': '/institute/institute8.webp',
  '/gallery': '/institute/institute9.webp',
  '/contact': '/institute/Institute1.jpg',
  '/search': '/institute/Institute2.jpg',
}

const DEFAULT_IMAGE = '/institute/Institute1.jpg'

/**
 * Page header for every inner page: a campus photograph fills the whole
 * section, edge to edge, with the page's name and purpose set in the bottom
 * left corner. No buttons — the photograph is the point of the header.
 *
 * A plum scrim (.page-hero-scrim in index.css) darkens only the bottom-left
 * corner behind the text, so the rest of the photograph stays untinted.
 */
export default function HeroSection({ title, subtitle, backgroundImage, children }) {
  const location = useLocation()
  const currentPath = location?.pathname || ''
  const finalBgImage = backgroundImage || ROUTE_IMAGE_MAP[currentPath] || DEFAULT_IMAGE

  return (
    <div className="relative isolate overflow-hidden bg-plum-deep text-white">
      <img
        src={finalBgImage}
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="page-hero-scrim absolute inset-0 -z-10" />

      <div className="relative mx-auto flex min-h-[26rem] max-w-7xl items-end px-4 pt-24 pb-10 sm:px-6 md:min-h-[32rem] md:pb-16 lg:min-h-[36rem] lg:px-8">
        <div className="max-w-xl [text-shadow:0_1px_12px_rgb(42_21_56/0.5)]">
          <h1 className="text-[2.2rem] sm:text-[2.6rem] lg:text-[3.2rem] font-medium leading-[1.06] tracking-[-0.02em] text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-lg text-base md:text-lg leading-relaxed text-white/90">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
      <ScrollDownArrow tone="dark" />
    </div>
  )
}
