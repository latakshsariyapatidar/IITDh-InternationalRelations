import { Link } from 'react-router-dom'

export default function CTAButton({
  label,
  children,
  to,
  href,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  icon = null,
  disabled = false
}) {
  const variants = {
    // Filled plum: the main action on light surfaces
    primary: 'bg-plum text-white hover:bg-plum-deep',
    // Outlined plum: the second action beside a primary one
    secondary: 'bg-transparent text-plum ring-1 ring-inset ring-plum/35 hover:bg-plum-tint hover:ring-plum/60',
    outline: 'bg-transparent text-plum ring-1 ring-inset ring-plum/35 hover:bg-plum-tint hover:ring-plum/60',
    // Saffron: the main action on dark plum or ink surfaces
    accent: 'bg-saffron text-plum-deep hover:bg-[#e3b358]',
    // Outlined white: the second action on dark surfaces
    inverse: 'bg-transparent text-white ring-1 ring-inset ring-white/40 hover:bg-white/10 hover:ring-white/70',
    ghost: 'bg-transparent text-plum hover:bg-plum-tint'
  }

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-[0.95rem]',
    lg: 'h-12 px-7 text-base'
  }

  const baseStyles = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  } ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`

  const content = label || children

  if (href) {
    return (
      <a
        href={href}
        className={baseStyles}
        target="_blank"
        rel="noopener noreferrer"
        onClick={disabled ? (e) => e.preventDefault() : null}
      >
        {icon && <span>{icon}</span>}
        {content}
      </a>
    )
  }

  if (to) {
    return (
      <Link to={to} className={baseStyles} onClick={disabled ? (e) => e.preventDefault() : null}>
        {icon && <span>{icon}</span>}
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={disabled ? null : onClick}
      disabled={disabled}
      className={baseStyles}
    >
      {icon && <span>{icon}</span>}
      {content}
    </button>
  )
}
