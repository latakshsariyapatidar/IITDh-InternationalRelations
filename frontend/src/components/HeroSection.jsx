import { useLocation } from 'react-router-dom'
import CTAButton from './ui/CTAButton'
import PhotoFrame from './ui/PhotoFrame'

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

/**
 * Page header for every inner page: the page's name and purpose on the left,
 * a campus photograph on the right (hidden on phones, where
 * the content matters more than the picture).
 *
 * `tone="ink"` sets the header on Global Ink, for the pages that face the
 * international community (partners, mobility, opportunities).
 */
export default function HeroSection({ title, subtitle, backgroundImage, cta, secondButton, secondaryCta, tone = 'light', children }) {
  const location = useLocation()
  const currentPath = location?.pathname || ''
  const finalBgImage = backgroundImage || ROUTE_IMAGE_MAP[currentPath] || DEFAULT_IMAGE
  const altButton = secondButton || secondaryCta
  const onInk = tone === 'ink'

  return (
    <div className={`relative overflow-hidden ${onInk ? 'bg-ink-deep' : 'bg-porcelain border-b border-mist'}`}>
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 md:py-16 lg:px-8 lg:py-20">
        <div className="md:col-span-7">
          <h1 className={`text-[2.6rem] sm:text-5xl lg:text-[3.9rem] font-medium leading-[1.04] tracking-[-0.02em] ${onInk ? 'text-white' : 'text-plum-deep'}`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`mt-5 max-w-xl text-lg md:text-xl leading-relaxed ${onInk ? 'text-white/75' : 'text-body'}`}>
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
                  variant={onInk ? 'accent' : 'primary'}
                  size="lg"
                />
              )}
              {altButton && (
                <CTAButton
                  label={altButton.label}
                  onClick={altButton.onClick}
                  to={altButton.to}
                  variant={onInk ? 'inverse' : 'secondary'}
                  size="lg"
                />
              )}
            </div>
          )}
          {children}
        </div>

        <div className="hidden md:col-span-5 md:flex md:justify-end">
          <PhotoFrame
            src={finalBgImage}
            alt=""
            className="aspect-[4/3] w-full max-w-[28rem]"
          />
        </div>
      </div>
    </div>
  )
}
