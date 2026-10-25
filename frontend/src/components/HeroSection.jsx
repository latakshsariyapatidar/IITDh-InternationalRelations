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
  '/opportunities': '/institute/institute10.webp',
  '/contact': '/institute/Institute1.jpg',
  '/search': '/institute/Institute2.jpg',
}

const DEFAULT_IMAGE = '/institute/Institute1.jpg'

export default function HeroSection({ title, subtitle, backgroundImage, cta, secondButton, secondaryCta }) {
  const location = useLocation()
  const currentPath = location?.pathname || ''
  const finalBgImage = backgroundImage || ROUTE_IMAGE_MAP[currentPath] || DEFAULT_IMAGE
  const altButton = secondButton || secondaryCta

  return (
    // On desktop the hero fills the screen below the header (--site-header-h, set in Layout)
    <div className="relative min-h-[50vh] md:min-h-[calc(100vh_-_var(--site-header-h,140px))] bg-brand-purpleDark overflow-hidden flex items-center">
      {/* Background Institute Photo */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
        style={{ backgroundImage: `url(${finalBgImage})` }}
      />

      {/* Brand Color & High-Contrast Overlays to ensure text is crystal clear */}
      <div className="absolute inset-0 bg-brand-purpleDark/75 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-brand-purpleDark/80 to-brand-purpleDark/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Content */}
      {/* Extra bottom padding keeps the content clear of the scroll cue */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-28 flex flex-col items-start text-left">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6 leading-tight animate-fadeUp drop-shadow-md">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/95 md:text-brand-purpleLight font-normal max-w-2xl mb-10 animate-fadeUp d1 leading-relaxed drop-shadow-sm">
              {subtitle}
            </p>
          )}
          {(cta || altButton) && (
            <div className="flex flex-wrap items-center gap-4 animate-fadeUp d2">
              {cta && (
                <CTAButton
                  label={cta.label}
                  onClick={cta.onClick}
                  to={cta.to}
                  variant="primary"
                  size="lg"
                />
              )}
              {altButton && (
                <CTAButton
                  label={altButton.label}
                  onClick={altButton.onClick}
                  to={altButton.to}
                  variant="secondary"
                  size="lg"
                />
              )}
            </div>
          )}
        </div>
      </div>

      <ScrollDownArrow />
    </div>
  )
}
