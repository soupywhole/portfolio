import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Asterisk } from 'lucide-react'
import { techImages } from './data'

export default function TechHero() {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const progress = useTransform(scrollY, [0, 600], [0, 1])
  const turn = useSpring(progress, { stiffness: 100, damping: 26, mass: 0.6 })
  const headphonesRotation = useTransform(turn, [0, 1], [-22, 0])
  const phoneRotation = useTransform(turn, [0, 1], [10, 0])

  return (
    <>
      <span className="tech-orbit-circle" />
      <div className="tech-hero-headphones">
        <m.div className="tech-device-turn" style={{ rotate: reduced ? -22 : headphonesRotation }}>
          <img className="tech-device-image" src={`${import.meta.env.BASE_URL}images/${techImages.headphones.src}`} alt="" width={techImages.headphones.width} height={techImages.headphones.height} decoding="async" fetchPriority="high" />
        </m.div>
      </div>
      <div className="tech-hero-phone">
        <m.div className="tech-device-turn" style={{ rotate: reduced ? 10 : phoneRotation }}>
          <img className="tech-device-image" src={`${import.meta.env.BASE_URL}images/${techImages.iphone.src}`} alt="" width={techImages.iphone.width} height={techImages.iphone.height} decoding="async" fetchPriority="high" />
        </m.div>
      </div>
      <span className="tech-hero-sticker"><Asterisk strokeWidth={1} size={47} /><span>Ваша следующая<br />любимая вещь.</span></span>
      <span className="tech-device-label mono">IPHONE / AIRPODS MAX</span>
    </>
  )
}
