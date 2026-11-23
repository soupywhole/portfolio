import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Check } from 'lucide-react'

export default function RepairHero() {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const angle = useTransform(scrollY, [0, 760], [0, 28])
  const turn = useSpring(angle, { stiffness: 100, damping: 26, mass: 0.6 })
  const phoneRotation = useTransform(turn, [0, 28], [12, 40])
  // The portrait iPad gets a quarter-turn before the original -22° tilt.
  const tabletRotation = useTransform(turn, [0, 28], [-112, -140])

  return (
    <>
      <span className="device-orbit orbit-one" />
      <span className="device-orbit orbit-two" />
      <div className="repair-device-back">
        <m.div className="repair-device-turn" style={{ rotate: reduced ? -112 : tabletRotation }}>
          <img className="repair-device-image" src={`${import.meta.env.BASE_URL}images/fixpoint-ipad.png`} alt="" width="454" height="660" decoding="async" />
        </m.div>
      </div>
      <div className="repair-device-front">
        <m.div className="repair-device-turn" style={{ rotate: reduced ? 12 : phoneRotation }}>
          <img className="repair-device-image" src={`${import.meta.env.BASE_URL}images/fixpoint-iphone.png`} alt="" width="200" height="408" decoding="async" />
        </m.div>
      </div>
      <span className="repair-art-tag"><span><Check size={17} /></span>Снова как надо.</span>
    </>
  )
}
