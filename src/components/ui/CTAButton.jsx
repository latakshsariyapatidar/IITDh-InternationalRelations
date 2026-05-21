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
    primary: 'bg-[#A6D1E6] text-[#FEFBF6] hover:bg-[#A6D1E6] font-bold shadow-lg hover:shadow-xl',
    secondary: 'bg-[#7F5283] text-white hover:bg-[#3D3C42] font-bold shadow-lg hover:shadow-xl',
    outline: 'bg-transparent text-[#7F5283] border-2 border-[#7F5283] font-bold hover:bg-[#7F5283] hover:text-white',
    ghost: 'bg-transparent text-[#7F5283] hover:bg-[#FEFBF6] font-semibold'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-lg'
  }

  const baseStyles = `inline-flex items-center justify-center gap-2 transition-all duration-300 ${
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
      onClick={disabled ? null : onClick}
      disabled={disabled}
      className={baseStyles}
    >
      {icon && <span>{icon}</span>}
      {content}
    </button>
  )
}
