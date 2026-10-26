/**
 * A photograph, shown plainly: a rectangle with a slight corner radius and
 * nothing around it. Portraits and campus photographs carry the page on their
 * own, the way they would in a printed prospectus.
 *
 * Pass `src` for a single image, or children (e.g. a crossfading slideshow)
 * to fill the frame yourself.
 */
export default function PhotoFrame({
  src,
  alt = '',
  children,
  className = '',
  imgClassName = 'object-cover',
}) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-mist ${className}`}>
      {children || (src && <img src={src} alt={alt} className={`h-full w-full ${imgClassName}`} />)}
    </div>
  )
}
