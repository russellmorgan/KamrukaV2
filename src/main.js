import './style.css'
import Alpine from 'alpinejs'
import { gsap } from 'gsap'

window.Alpine = Alpine
Alpine.start()

// Hero animation — timings ported from the Revolution Slider reference (st/sp values, ms → s)
const gifFinal = { xPercent: 31.4, yPercent: -11.8, scale: 0.9, transformOrigin: '65% 65%' }

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.set('#hero-gif', gifFinal)
} else if (window.matchMedia('(min-width: 768px)').matches) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from('#hero-gif', { autoAlpha: 0, duration: 0.5 }, 0) // GIF itself plays its ~4s build
    .to('#hero-gif', { ...gifFinal, duration: 1.5 }, 4)
    .from('#hero-slope', { xPercent: -105, duration: 2 }, 4)
    .from('#hero-title', { xPercent: -145, autoAlpha: 0, duration: 1.5 }, 4.69)
    .from('#hero-tri', { xPercent: -105, autoAlpha: 0, duration: 1.2 }, 4.98)
    .from('#hero-diamond', { xPercent: -160, autoAlpha: 0, duration: 1.2 }, 4.99)
    .from('#hero-btn', { x: -250, autoAlpha: 0, duration: 1.2 }, 5)
    .from('#hero-avail', { autoAlpha: 0, duration: 0.2 }) // fades in once everything else has landed

  // ponytail: test hook — #seek=N freezes the hero timeline at N seconds (headless screenshots)
  const seek = location.hash.match(/seek=([\d.]+)/)
  if (seek) tl.pause(parseFloat(seek[1]))
} else {
  gsap.set('#hero-gif', gifFinal) // mobile shows the static hero; keep canvas state final if resized up
}
