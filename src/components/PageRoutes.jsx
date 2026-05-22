import { useEffect, useMemo, useRef, useState } from 'react'
import barba from '@barba/core'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import Home from '../pages/Home'
import About from '../pages/About'
import Collaboration from '../pages/Collaboration'
import Admission from '../pages/Admission'
import Partners from '../pages/Partners'
import Visa from '../pages/Visa'
import Downloads from '../pages/Downloads'
import Life from '../pages/Life'
import Visits from '../pages/Visits'
import Gallery from '../pages/Gallery'
import Contact from '../pages/Contact'

const COVER_DURATION = 650
const REVEAL_DURATION = 650

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function shouldIgnoreLink(event, anchor) {
  if (!anchor) {
    return true
  }

  if (event.defaultPrevented || event.button !== 0) {
    return true
  }

  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return true
  }

  const target = anchor.getAttribute('target')
  if (target && target !== '_self') {
    return true
  }

  if (anchor.hasAttribute('download') || anchor.getAttribute('rel') === 'external') {
    return true
  }

  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return true
  }

  return false
}

export default function PageRoutes() {
  const location = useLocation()
  const navigate = useNavigate()
  const [curtainPhase, setCurtainPhase] = useState('idle')
  const [curtainKey, setCurtainKey] = useState(0)
  const transitionLockRef = useRef(false)
  const locationRef = useRef(location)

  useEffect(() => {
    locationRef.current = location
  }, [location])

  useEffect(() => {
    barba.init({
      logLevel: 'off',
      prevent: () => true,
    })

    return () => {
      barba.destroy()
    }
  }, [])

  const runTransition = useMemo(
    () => async (nextHref) => {
      if (transitionLockRef.current) {
        return
      }

      const current = locationRef.current
      const nextUrl = new URL(nextHref, window.location.origin)
      const nextRoute = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
      const currentRoute = `${current.pathname}${current.search}${current.hash}`

      if (nextRoute === currentRoute) {
        return
      }

      transitionLockRef.current = true
      const hookData = {
        current: {
          namespace: 'iro',
          url: { href: window.location.href, path: current.pathname },
        },
        next: {
          namespace: 'iro',
          url: { href: nextUrl.href, path: nextUrl.pathname },
        },
      }

      try {
        await barba.hooks.do('before', hookData)
        await barba.hooks.do('beforeLeave', hookData)

        setCurtainKey((value) => value + 1)
        setCurtainPhase('cover')
        await delay(COVER_DURATION)

        navigate(nextRoute)

        await delay(30)

        await barba.hooks.do('afterLeave', hookData)
        await barba.hooks.do('beforeEnter', hookData)

        setCurtainPhase('reveal')
        await delay(REVEAL_DURATION)

        await barba.hooks.do('afterEnter', hookData)
        await barba.hooks.do('after', hookData)
      } finally {
        setCurtainPhase('idle')
        transitionLockRef.current = false
      }
    },
    [navigate],
  )

  useEffect(() => {
    const handleClick = (event) => {
      const anchor = event.target.closest('a[href]')
      if (shouldIgnoreLink(event, anchor)) {
        return
      }

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) {
        return
      }

      event.preventDefault()
      void runTransition(url.href)
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [runTransition])

  const curtainClassName =
    curtainPhase === 'cover'
      ? 'barba-curtain barba-curtain-cover'
      : curtainPhase === 'reveal'
        ? 'barba-curtain barba-curtain-reveal'
        : 'barba-curtain barba-curtain-hidden'

  return (
    <div className="relative min-h-screen" data-barba="wrapper">
      <div className="relative min-h-screen" data-barba="container" data-barba-namespace="iro">
        <div className={curtainClassName} key={curtainKey} aria-hidden="true">
          <div className="barba-curtain-content">
            <img
              src="/IITDh logo white.svg"
              alt="IIT Dharwad"
              className="barba-curtain-logo"
            />
            <div className="barba-curtain-wordmark ">International Relations Office</div>
            <svg
              className="barba-curtain-loader"
              viewBox="0 0 100 100"
              role="presentation"
            >
              <circle className="barba-loader-track" cx="50" cy="50" r="36" />
              <circle className="barba-loader-ring" cx="50" cy="50" r="36" />
            </svg>
          </div>
        </div>

        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/visa" element={<Visa />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/life" element={<Life />} />
          <Route path="/visits" element={<Visits />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </div>
  )
}
