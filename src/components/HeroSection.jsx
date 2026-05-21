import { useState } from 'react'
import CTAButton from './ui/CTAButton'

export default function HeroSection({ title, subtitle, backgroundImage, cta }) {
  return (
    <div
      className="relative min-h-[50vh] md:min-h-[calc(100vh-140px)] bg-[#7F5283] overflow-hidden flex items-center"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#3D3C42]/80 mix-blend-multiply"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 flex flex-col items-start text-left">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#FEFBF6] mb-6 leading-tight animate-fadeUp">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-[#A6D1E6] font-light max-w-2xl mb-10 animate-fadeUp d1">
              {subtitle}
            </p>
          )}
          {cta && (
            <div className="animate-fadeUp d2">
              <CTAButton
                label={cta.label}
                onClick={cta.onClick}
                variant="primary"
                size="lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
