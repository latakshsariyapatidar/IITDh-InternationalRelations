import { useLocation } from 'react-router-dom'
import CTAButton from './ui/CTAButton'
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
 * section, edge to edge, with the page's name and purpose set over it.
 *
 * A plum scrim (.hero-scrim in index.css) sits between photo and text,
 * heaviest behind the text on the left, so the words stay legible whatever
 * the photograph does underneath.
 */
export default function HeroSection({ title, subtitle, backgroundImage, cta, secondButton, secondaryCta, children }) {
  const location = useLocation()
  const currentPath = location?.pathname || ''
  const finalBgImage = backgroundImage || ROUTE_IMAGE_MAP[currentPath] || DEFAULT_IMAGE
  const altButton = secondButton || secondaryCta

  return (
    <div className="relative isolate overflow-hidden bg-plum-deep text-white">
      <img
        src={finalBgImage}
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />

      <div className="relative mx-auto flex min-h-[26rem] max-w-7xl items-end px-4 pt-24 pb-16 sm:px-6 md:min-h-[32rem] md:items-center md:py-24 lg:min-h-[36rem] lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.9rem] font-medium leading-[1.04] tracking-[-0.02em] text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-xl text-lg md:text-xl leading-relaxed text-white/85">
              {subtitle}
            </p>
          )}
          {(cta || altButton) && (
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {cta && (
                <CTAButton
                  label={cta.label}
                  onClick={cta.onClick}
                  to={cta.to}
                  variant="accent"
                  size="lg"
                />
              )}
              {altButton && (
                <CTAButton
                  label={altButton.label}
                  onClick={altButton.onClick}
                  to={altButton.to}
                  variant="inverse"
                  size="lg"
                />
              )}
            </div>
          )}
          {children}
        </div>
      </div>
      <ScrollDownArrow tone="dark" />
    </div>
  )
}
