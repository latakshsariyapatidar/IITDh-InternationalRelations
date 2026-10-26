/**
 * The site's signature frame: an arched doorway. "Dharwad" comes from
 * "Dwarawata" (door town), and the office is the institute's door to the
 * world, so portraits and campus photographs are shown through an arch.
 *
 *      ╭───╮ ╮      a saffron outline sits just behind and to the side
 *     │     ││      of the photo, like the edge of a door frame
 *     │     ││
 *     └─────┘┘
 *
 * Pass `src` for a single image, or children (e.g. a crossfading slideshow)
 * to fill the arch yourself.
 */
export default function ArchFrame({
  src,
  alt = '',
  children,
  className = '',
  outline = 'saffron',
  imgClassName = 'object-cover',
}) {
  const outlineColor = outline === 'mist' ? 'border-mist' : outline === 'none' ? 'border-transparent' : 'border-saffron'

  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden="true"
        className={`absolute inset-0 translate-x-3 -translate-y-3 rounded-t-full border ${outlineColor}`}
      />
      <div className="relative h-full w-full overflow-hidden rounded-t-full bg-mist">
        {children || (src && <img src={src} alt={alt} className={`h-full w-full ${imgClassName}`} />)}
      </div>
    </div>
  )
}
