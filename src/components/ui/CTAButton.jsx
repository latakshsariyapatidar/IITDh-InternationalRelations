import { Link } from 'react-router-dom'

export default function CTAButton({ children, to, href, onClick, className = '' }) {
  const baseStyles = 'inline-block px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors'

  if (href) {
    return (
      <a href={href} className={`${baseStyles} ${className}`}>
        {children}
      </a>
    )
  }

  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${className}`}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${className}`}>
      {children}
    </button>
  )
}
