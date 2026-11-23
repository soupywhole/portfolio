import { useEffect, useRef } from 'react'
import type { CSSProperties, FocusEvent, PointerEvent, ReactNode } from 'react'
import { m, useAnimationControls, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import type { MotionStyle } from 'framer-motion'
import { cardOrigin, pointerPosition } from './portfolio-motion'

const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return (
    <m.div className={className} initial={reduced ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease }}>
      {children}
    </m.div>
  )
}

export function ScrollTitle({ id, lines, className = '' }: { id: string; lines: { text: string; className?: string }[]; className?: string }) {
  const heading = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()
  const length = lines.reduce((count, line) => count + Array.from(line.text).length, 0)
  // Finish near the viewport bottom so the final heading needs no extra page padding.
  const { scrollYProgress } = useScroll({ target: heading, offset: ['start 0.94', 'end 0.82'] })
  const written = useMotionValue(0)

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    // Keep revealed letters readable when the visitor scrolls back up.
    written.set(Math.max(written.get(), progress * (length + 3)))
  })

  useEffect(() => {
    written.set(reduced ? length + 3 : Math.max(written.get(), scrollYProgress.get() * (length + 3)))
  }, [length, reduced, scrollYProgress, written])

  let character = 0

  return (
    <m.h2 ref={heading} id={id} className={`scroll-title ${className}`} style={{ '--written': written } as MotionStyle}>
      <span className="sr-only">{lines.map((line) => line.text).join(' ')}</span>
      <span aria-hidden="true">
        {lines.map((line, lineIndex) => (
          <span className={`title-line ${line.className ?? ''}`} key={lineIndex}>
            {line.text.split(/(\s+)/).map((word, wordIndex) => (
              <span className={word.trim() ? 'title-word' : undefined} key={wordIndex}>
                {Array.from(word).map((letter) => {
                  const index = character++
                  return <span className="reveal-character" style={{ '--character': index } as CSSProperties} key={index}>{letter}</span>
                })}
              </span>
            ))}
          </span>
        ))}
      </span>
    </m.h2>
  )
}

export function AnimatedCard({ children, className, slotClassName = '', delay = 0 }: { children: ReactNode; className: string; slotClassName?: string; delay?: number }) {
  const slot = useRef<HTMLDivElement>(null)
  const bounds = useRef<DOMRect | null>(null)
  const revealed = useRef(false)
  const inView = useInView(slot, { once: true, amount: 0.1 })
  const reduced = useReducedMotion()
  const card = useAnimationControls()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 22, mass: 0.7 })
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 22, mass: 0.7 })
  const x = useTransform(smoothX, [-1, 1], [-6, 6])
  const y = useTransform(smoothY, [-1, 1], [-4, 4])
  const rotateX = useTransform(smoothY, [-1, 1], [4, -4])
  const rotateY = useTransform(smoothX, [-1, 1], [-4, 4])

  useEffect(() => {
    if (reduced) {
      revealed.current = true
      card.set({ opacity: 1, scale: 1, x: 0, y: 0 })
      pointerX.set(0)
      pointerY.set(0)
      return
    }
    if (!inView || revealed.current || !slot.current) return
    revealed.current = true
    const rectangle = slot.current.getBoundingClientRect()
    const group = slot.current.parentElement!.getBoundingClientRect()
    const origin = cardOrigin(rectangle, group)
    card.set({ ...origin, opacity: 0, scale: 0.012 })
    void card.start({ x: 0, y: 0, scale: 1, opacity: 1, transition: { duration: 0.95, delay, ease } })
  }, [card, delay, inView, pointerX, pointerY, reduced])

  function resetPointer() {
    bounds.current = null
    pointerX.set(0)
    pointerY.set(0)
  }

  function movePointer(event: PointerEvent<HTMLElement>) {
    if (reduced || !bounds.current) return
    const position = pointerPosition(event.clientX, event.clientY, bounds.current)
    pointerX.set(position.x)
    pointerY.set(position.y)
  }

  function startPointer(event: PointerEvent<HTMLElement>) {
    if (reduced) return
    bounds.current = slot.current?.getBoundingClientRect() ?? null
    movePointer(event)
  }

  function revealForKeyboard(event: FocusEvent<HTMLElement>) {
    if (!event.target.matches(':focus-visible')) return
    revealed.current = true
    card.stop()
    card.set({ opacity: 1, scale: 1, x: 0, y: 0 })
    resetPointer()
  }

  return (
    <div ref={slot} className={`emerge-slot ${slotClassName}`} onFocusCapture={revealForKeyboard}>
      <m.div className="emerge-card" initial={reduced ? false : { opacity: 0, scale: 0.012 }} animate={card}>
        <m.article
          className={`tilt-card ${className}`}
          style={reduced ? undefined : { x, y, rotateX, rotateY, transformPerspective: 1100 }}
          onPointerEnter={startPointer}
          onPointerDown={startPointer}
          onPointerMove={movePointer}
          onPointerUp={(event) => { if (event.pointerType !== 'mouse') resetPointer() }}
          onPointerLeave={resetPointer}
          onPointerCancel={resetPointer}
        >
          {children}
        </m.article>
      </m.div>
    </div>
  )
}
