export default function HeroSection({ title, subtitle, backgroundImage }) {
  return (
    <div
      className="relative h-80 bg-gradient-to-r from-blue-700 to-blue-600 overflow-hidden"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
