import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { demos, getDemoId } from './data'
import HomePage from './HomePage'

const DemoPage = lazy(() => import('./DemoPage'))

export default function App() {
  const [demo, setDemo] = useState(() => getDemoId(window.location.hash))
  const previousDemo = useRef(demo)

  useEffect(() => {
    const updateRoute = () => setDemo(getDemoId(window.location.hash))
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  useEffect(() => {
    const project = demos.find((item) => item.id === demo)
    document.title = project
      ? `${project.name} — интерактивный демо-сайт · usurawa.dev`
      : 'usurawa.dev — сайты с характером для бизнеса'

    if (previousDemo.current !== demo) {
      const section = !demo && document.getElementById(window.location.hash.slice(1))
      if (section) {
        section.scrollIntoView({ behavior: 'instant' })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
      if (!demo) document.getElementById('hero-title')?.focus({ preventScroll: true })
      previousDemo.current = demo
    }
  }, [demo])

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <Suspense fallback={<main className="page-loader" role="status">Открываю пример<span>usurawa.dev</span></main>}>
          {demo ? <DemoPage key={demo} id={demo} /> : <HomePage />}
        </Suspense>
      </LazyMotion>
    </MotionConfig>
  )
}
