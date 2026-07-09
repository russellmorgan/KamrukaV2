import './style.css'
import Alpine from 'alpinejs'
import { gsap } from 'gsap'

window.Alpine = Alpine

const HUBSPOT_PORTAL_ID = '24308407'
const HUBSPOT_FORM_GUID = '6a352cac-12ce-44f7-bae4-05705097e533'

window.subscribeForm = () => ({
  submitted: false,
  submitting: false,
  error: false,

  async onSubmit(formEl) {
    if (!formEl.checkValidity()) {
      this.error = true
      formEl.reportValidity()
      return
    }
    this.error = false
    this.submitting = true

    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: [
              { name: 'firstname', value: this.$refs.firstName.value },
              { name: 'lastname', value: this.$refs.lastName.value },
              { name: 'email', value: this.$refs.email.value },
              // ponytail: confirm this matches HubSpot's actual internal property name/option values for the dropdown
              { name: 'profession', value: this.$refs.profession.value },
              { name: 'trial_page___agreement', value: this.$refs.consent.checked },
            ],
            context: { pageUri: location.href, pageName: document.title },
          }),
        }
      )
      if (!res.ok) throw new Error(`HubSpot submit failed: ${res.status}`)
      this.submitted = true
    } catch (e) {
      console.error(e)
      this.error = true
    } finally {
      this.submitting = false
    }
  },
})

Alpine.start()

// Hero animation — timings ported from the Revolution Slider reference (st/sp values, ms → s)
const logoFinal = { xPercent: 31.4, yPercent: -11.8, scale: 0.9, transformOrigin: '65% 65%' }
const video = document.getElementById('hero-logo')

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.set('#hero-logo', logoFinal)
  video.removeAttribute('autoplay')
  video.addEventListener('loadedmetadata', () => (video.currentTime = video.duration), { once: true })
} else if (window.matchMedia('(min-width: 768px)').matches) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
  tl.from('#hero-logo', { autoAlpha: 0, duration: 0.5 }, 0) // video plays its ~4s logo build
    .to('#hero-logo', { ...logoFinal, duration: 1.5 }, 4)
    .from('#hero-slope', { xPercent: -105, duration: 2 }, 4)
    .from('#hero-title', { xPercent: -145, autoAlpha: 0, duration: 1.5 }, 4.69)
    .from('#hero-tri', { xPercent: -105, autoAlpha: 0, duration: 1.2 }, 4.98)
    .from('#hero-diamond', { xPercent: -160, autoAlpha: 0, duration: 1.2 }, 4.99)
    .from('#hero-btn', { x: -250, autoAlpha: 0, duration: 1.2 }, 5)
    .from('#hero-avail', { autoAlpha: 0, duration: 0.2 }) // fades in once everything else has landed

  // start in lockstep with the video; fall back so the hero never stays blank if autoplay is blocked
  const start = () => tl.play(video.currentTime)
  if (!video.paused && video.readyState >= 2) start()
  else video.addEventListener('playing', start, { once: true })
  setTimeout(() => tl.paused() && tl.play(), 2000)

  // ponytail: test hook — #seek=N freezes the hero timeline at N seconds (headless screenshots)
  const seek = location.hash.match(/seek=([\d.]+)/)
  if (seek) tl.pause(parseFloat(seek[1]))
} else {
  gsap.set('#hero-logo', logoFinal) // mobile shows the static hero; keep canvas state final if resized up
}
