import { useState } from 'react'

export default function FAQAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="border-1 border-black rounded-lg overflow-hidden transition-all duration-300"
        >
          {/* Question Button */}
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-white transition-colors"
          >
            <span className="font-semibold text-gray-900 text-sm md:text-base">{item.question}</span>
            <span
              className={`text-2xl text-brand-purple font-light transition-transform duration-300 flex-shrink-0 ml-4 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            >
              ↓
            </span>
          </button>

          {/* Answer - Hidden by default */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="px-6 py-4 border-t border-brand-purpleLight/60 bg-white text-brand-purpleDark/80 text-sm leading-relaxed">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
