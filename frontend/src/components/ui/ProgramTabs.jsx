import { useId, useRef, useState } from 'react'

/**
 * A list of programmes on the left, the chosen programme's sheet on the right.
 * On small screens the list becomes a row of scrollable tabs above the sheet.
 *
 * items: [{ id, label, meta?, content }]
 */
export default function ProgramTabs({ items = [], label, tone = 'plum' }) {
  const [activeId, setActiveId] = useState(items[0]?.id)
  const tabRefs = useRef({})
  const baseId = useId()
  const active = items.find((item) => item.id === activeId) || items[0]

  const activeTab = tone === 'ink'
    ? 'lg:border-ink bg-ink text-white lg:bg-white lg:text-ink-deep'
    : 'lg:border-plum bg-plum text-white lg:bg-white lg:text-plum-deep'

  // Arrow keys move between tabs, as in any tab list.
  const onKeyDown = (event, index) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    if (!(event.key in keys)) return
    event.preventDefault()
    const next = items[(index + keys[event.key] + items.length) % items.length]
    setActiveId(next.id)
    tabRefs.current[next.id]?.focus()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-12">
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="vertical"
        className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-l lg:border-mist lg:px-0"
      >
        {items.map((item, index) => {
          const selected = item.id === active?.id
          return (
            <button
              key={item.id}
              ref={(el) => { tabRefs.current[item.id] = el }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-left text-sm font-medium transition-colors lg:-ml-px lg:rounded-none lg:border-l-2 lg:px-5 lg:py-3.5 ${
                selected
                  ? activeTab
                  : 'border-transparent bg-white text-body ring-1 ring-mist hover:text-plum-deep lg:bg-transparent lg:ring-0'
              }`}
            >
              <span className="block lg:text-base">{item.label}</span>
              {item.meta && (
                <span className={`hidden text-xs font-normal lg:mt-0.5 lg:block ${selected ? 'text-quiet' : 'text-quiet/80'}`}>
                  {item.meta}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active?.id}`}
        className="min-w-0"
      >
        {active?.content}
      </div>
    </div>
  )
}
