import { useState } from 'react'
import { RiAddLine } from '@remixicon/react'

export default function FAQAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="divide-y divide-mist border-y border-mist">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={index}>
            {/* Question Button */}
            <button
              type="button"
              onClick={() => toggleAccordion(index)}
              aria-expanded={isOpen}
              className="group w-full py-5 flex justify-between items-start gap-6 text-left cursor-pointer"
            >
              <span className="font-semibold text-plum-deep text-base md:text-[1.05rem] leading-snug group-hover:text-plum">{item.question}</span>
              <RiAddLine
                size={22}
                aria-hidden="true"
                className={`mt-0.5 shrink-0 text-saffron-deep transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
              />
            </button>

            {/* Answer - Hidden by default */}
            <div
              className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <div className="pb-6 pr-10 text-body text-[0.95rem] leading-relaxed whitespace-pre-line">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
