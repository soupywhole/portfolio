import { useEffect, useRef, useState } from 'react'
import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { ArrowDown, ArrowUp, ArrowUpRight, Asterisk, Check, ChevronDown, Coffee, Mail, Menu, MessageCircle, MonitorSmartphone, Smartphone, Wrench, X } from 'lucide-react'
import { contacts, demos, formatPrice, services } from './data'
import SitePreview from './SitePreview'
import { AnimatedCard, Reveal, ScrollTitle } from './PortfolioEffects'
import './portfolio.css'

const copyrightYear = new Date().getFullYear()
const ease = [0.22, 1, 0.36, 1] as const
const serviceIcons = { cafe: Coffee, repair: Wrench, tech: Smartphone }

function Wordmark({ footer = false }: { footer?: boolean }) {
  return <a href="#top" className={`wordmark${footer ? ' footer-wordmark' : ''}`} aria-label="usurawa.dev — на главную">usurawa<span>.dev</span><i aria-hidden="true" /></a>
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const links = [{ href: '#projects', text: 'Примеры' }, { href: '#services', text: 'Услуги и цены' }, { href: '#process', text: 'Как работаем' }]

  return (
    <header className="header-shell">
      <div className="site-header">
        <Wordmark />
        <nav className="desktop-nav" aria-label="Основная навигация">
          {links.map((link) => <a key={link.href} href={link.href}>{link.text}</a>)}
        </nav>
        <a className="header-contact" href="#contact" onClick={() => setMenuOpen(false)}>
          <span>Обсудим<span className="header-contact-extra"> проект</span></span><ArrowUpRight size={17} aria-hidden="true" />
        </a>
        <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <div id="mobile-menu" data-open={menuOpen} aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="mobile-menu-clip">
          <nav className="mobile-nav" aria-label="Мобильная навигация">
            <div className="mobile-nav-inner">
              {links.map((link) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.text}<ArrowUpRight size={18} aria-hidden="true" /></a>)}
              <a href="#contact" onClick={() => setMenuOpen(false)}>Связаться<ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

function Atmosphere({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion()
  const smoothProgress = useSpring(progress, { stiffness: 65, damping: 28, mass: 0.8 })
  const rotate = useTransform(smoothProgress, [0, 1], [-15, 165])

  return (
    <div className="atmosphere" aria-hidden="true">
      <m.div className="ambient-orbit" style={{ rotate: reduced ? -15 : rotate }}>
        <span className="ambient-glow ambient-glow-top" />
        <span className="ambient-glow ambient-glow-bottom" />
      </m.div>
      <div className="ambient-grain" />
    </div>
  )
}

function Hero() {
  const hero = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 18])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])

  return (
    <section ref={hero} className="hero" aria-labelledby="hero-title">
      <div className="hero-scene" aria-hidden="true">
        <m.div className="hero-sculpture" style={reduced ? undefined : { rotate, y }}>
          <img src={`${import.meta.env.BASE_URL}images/ribbon-sculpture.svg`} alt="" width="1200" height="860" fetchPriority="high" />
        </m.div>
        <div className="hero-vignette" />
        <span className="scene-coordinate scene-coordinate-left"><i /> ИДЕЯ → ФОРМА</span>
        <span className="scene-coordinate scene-coordinate-right">ДЕТАЛИ ИМЕЮТ ЗНАЧЕНИЕ <i /></span>
      </div>
      <div className="hero-container container">
        <m.div className="hero-copy" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 1, ease }}>
          <div className="hero-eyebrow mono"><span className="status-dot" /> НЕЗАВИСИМАЯ ВЕБ-РАЗРАБОТКА</div>
          <h1 id="hero-title" tabIndex={-1}><span className="hero-title-main">Сайты с</span><span className="hero-title-accent">характером<span className="hero-title-dot">.</span></span></h1>
          <p className="hero-description">Помогаю кафе, сервисам и магазинам выглядеть<br className="desktop-break" /> в интернете так же хорошо, как в жизни.</p>
          <div className="hero-actions">
            <a className="button button-pastel" href="#projects">Посмотреть примеры<ArrowUpRight size={19} aria-hidden="true" /></a>
            <a className="text-link" href="#contact">Есть идея? Обсудим<ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </m.div>
        <div className="hero-bottom">
          <span className="hero-signature">Дизайн, который чувствуется.<br /><span>Код, который работает.</span></span>
          <a className="scroll-hint mono" href="#projects"><span className="scroll-hint-icon"><ArrowDown size={18} aria-hidden="true" /></span>ЛИСТАЙТЕ НИЖЕ</a>
          <span className="hero-disciplines mono">ДИЗАЙН / РАЗРАБОТКА<br /><span>С ВНИМАНИЕМ К ВАМ</span></span>
        </div>
      </div>
    </section>
  )
}

const steps = [
  { title: 'Сначала — ваш бизнес', text: 'Разбираемся, для кого сайт, что вы предлагаете и какое действие должен сделать посетитель.' },
  { title: 'Находим ваш характер', text: 'Выбираем настроение, структуру и визуальный стиль. Показываю направление, обсуждаем детали.' },
  { title: 'Собираем и оживляем', text: 'Превращаю идею в сайт: каталог, адаптация, удобная навигация и те самые плавные переходы.' },
  { title: 'Проверяем каждую деталь', text: 'Смотрим на компьютере и телефоне, проверяем ссылки и содержимое. Готовим сайт к запуску.' },
]
const questions = [
  { title: 'Что входит в стоимость?', answer: 'Дизайн и разработка адаптивного сайта с согласованным каталогом. Цены в карточках — стартовые. Перед началом зафиксируем итоговую стоимость, страницы, функции и материалы. Домен, хостинг и дополнительные интеграции обсуждаются отдельно — без неожиданных обещаний.' },
  { title: 'Примеры — это реальные работы?', answer: 'Нет. «тепло», fixpoint и orbit — вымышленные бренды и демонстрационные концепты. Они показывают, какие сайты и взаимодействия я могу сделать. В них нет настоящих заказов или оплаты.' },
  { title: 'Можно будет менять меню или товары?', answer: 'Да, способ обновления каталога выберем под вашу задачу. Самостоятельное редактирование и подключение панели управления согласуем до начала работы. В текущих демо панели управления нет.' },
  { title: 'Что нужно, чтобы начать?', answer: 'Напишите пару слов о бизнесе и о том, какой сайт вам нужен. Если уже есть фотографии, меню, список услуг или понравившиеся сайты — отлично. Если нет, начнём с обсуждения структуры.' },
]

function Questions() {
  const [open, setOpen] = useState<number | null>(null)
  const reduced = useReducedMotion()

  return (
    <div className="faq-list">
      {questions.map((question, index) => {
        const expanded = open === index
        return (
          <div className={`faq-item${expanded ? ' is-open' : ''}`} key={question.title}>
            <h3><button id={`question-${index}`} className="faq-toggle" aria-expanded={expanded} aria-controls={`answer-${index}`} onClick={() => setOpen(expanded ? null : index)}>
              <span className="faq-number mono">0{index + 1}</span><span>{question.title}</span><ChevronDown size={20} aria-hidden="true" />
            </button></h3>
            <m.div id={`answer-${index}`} className="faq-answer" role="region" aria-labelledby={`question-${index}`} aria-hidden={!expanded} inert={!expanded} initial={false} animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }} transition={{ height: { duration: reduced ? 0 : 0.4, ease }, opacity: { duration: reduced ? 0 : 0.28, delay: expanded && !reduced ? 0.08 : 0 } }}>
              <p>{question.answer}</p>
            </m.div>
          </div>
        )
      })}
    </div>
  )
}

export default function HomePage() {
  const { scrollYProgress } = useScroll()

  return (
    <div className="portfolio-page" id="top">
      <Atmosphere progress={scrollYProgress} />
      <a className="skip-link" href="#main">К основному содержимому</a>
      <m.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <Header />
      <main id="main">
        <Hero />

        <section className="section projects-section container" id="projects" aria-labelledby="projects-title">
          <Reveal><div className="section-kicker mono"><span>01 /</span> ПОСМОТРЕТЬ В ДЕЛЕ<span className="section-kicker-tail">ТРИ ИДЕИ. ТРИ НАСТРОЕНИЯ.</span></div></Reveal>
          <div className="section-heading">
            <ScrollTitle id="projects-title" lines={[{ text: 'Придумано.' }, { text: 'Но уже работает.', className: 'text-blue' }]} />
            <Reveal><p>Не просто красивые картинки.<br />Три демонстрационных сайта: открывайте,<br className="desktop-break" /> нажимайте и пробуйте всё сами.</p></Reveal>
          </div>
          <div className="projects-grid">
            {demos.map((demo, index) => (
              <AnimatedCard key={demo.id} className={`project-card project-${demo.id}`} slotClassName={index === 2 ? 'project-featured' : ''} delay={index === 1 ? 0.12 : 0}>
                <a href={`#/demo/${demo.id}`} className="project-preview">
                  <span className="sr-only">Открыть демо {demo.name}: {demo.category}</span>
                  <span className="project-preview-index mono" aria-hidden="true">0{index + 1} / КОНЦЕПТ</span>
                  <SitePreview kind={demo.id} />
                  <span className="project-preview-arrow"><ArrowUpRight size={23} aria-hidden="true" /></span>
                </a>
                <div className="project-info">
                  <div className="project-meta mono"><span>{demo.category}</span><span><i /> ЖИВОЕ ДЕМО</span></div>
                  <div className="project-title-row"><h3>{demo.name}</h3><Asterisk size={28} strokeWidth={1.2} aria-hidden="true" /></div>
                  <p>{demo.description}</p>
                  <ul className="project-tags" aria-label="Возможности">{demo.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                  <a className="project-demo-link" href={`#/demo/${demo.id}`}>Открыть пример<ArrowUpRight size={19} aria-hidden="true" /><span className="sr-only"> {demo.name}</span></a>
                </div>
              </AnimatedCard>
            ))}
          </div>
          <Reveal><p className="demo-disclaimer"><span className="disclaimer-mark">*</span> Концепты, не клиентские работы. Заведения и магазины вымышлены; в orbit — реальные модели техники. Цены демонстрационные.</p></Reveal>
        </section>

        <section className="section services-section container" id="services" aria-labelledby="services-title">
          <Reveal><div className="section-kicker mono"><span>02 /</span> ДЛЯ ВАШЕГО БИЗНЕСА</div></Reveal>
          <div className="section-heading">
            <ScrollTitle id="services-title" lines={[{ text: 'Своя задача.' }, { text: 'Свой сайт.', className: 'text-peach' }]} />
            <Reveal><p>Внешний вид — это только начало.<br />Сайт должен помогать вашим клиентам<br className="desktop-break" /> находить, выбирать и связываться с вами.</p></Reveal>
          </div>
          <div className="services-grid">
            {services.map((service, index) => {
              const Icon = serviceIcons[service.id]
              return (
                <AnimatedCard key={service.id} className={`service-card service-${service.id}`} delay={index * 0.1}>
                  <div className="service-top"><span className="service-icon"><Icon size={25} strokeWidth={1.35} aria-hidden="true" /></span><span className="service-number mono">/ 0{index + 1}</span></div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul>{service.features.map((feature) => <li key={feature}><Check size={14} aria-hidden="true" />{feature}</li>)}</ul>
                  <div className="service-price"><strong>от {formatPrice(service.price)}</strong><span>за проект</span></div>
                  <a href={`#/demo/${service.id}`} className="service-link">Посмотреть пример<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only">: {service.title}</span></a>
                </AnimatedCard>
              )
            })}
          </div>
          <Reveal><div className="services-footnote"><MonitorSmartphone size={19} strokeWidth={1.3} aria-hidden="true" /><p>На большом экране. На маленьком. С вниманием к каждой детали.</p><span className="mono">АДАПТАЦИЯ ВКЛЮЧЕНА</span></div></Reveal>
        </section>

        <section className="section process-section container" id="process" aria-labelledby="process-title">
          <div className="process-layout">
            <div className="process-intro">
              <Reveal><div className="section-kicker mono"><span>03 /</span> ОТ ИДЕИ ДО САЙТА</div></Reveal>
              <ScrollTitle id="process-title" lines={[{ text: 'Без лишнего.' }, { text: 'Но с душой.', className: 'text-blue' }]} />
              <Reveal><p>Работаем напрямую. Вы рассказываете о бизнесе — я превращаю вашу идею в понятный, живой сайт.</p><a className="text-link" href="#contact">Начнём с разговора<ArrowUpRight size={18} aria-hidden="true" /></a><div className="process-symbol" aria-hidden="true"><Asterisk strokeWidth={0.6} /><span className="mono">ДИЗАЙН + КОД<br />В ОДНИХ РУКАХ</span></div></Reveal>
            </div>
            <ol className="process-steps">
              {steps.map((step, index) => <li key={step.title}><Reveal><div className="step-row"><span className="step-number mono">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div><ArrowUpRight size={20} strokeWidth={1.3} aria-hidden="true" /></div></Reveal></li>)}
            </ol>
          </div>
        </section>

        <section className="section container faq-section" aria-labelledby="faq-title">
          <div className="faq-intro">
            <Reveal><div className="section-kicker mono"><span>04 /</span> О ВАЖНОМ</div></Reveal>
            <ScrollTitle id="faq-title" lines={[{ text: 'Кстати,' }, { text: 'о деталях.', className: 'text-peach' }]} />
            <Reveal><p>Не нашли свой вопрос?<br /><a href={contacts.telegram} target="_blank" rel="noopener noreferrer">Напишите мне<ArrowUpRight size={15} aria-hidden="true" /></a></p></Reveal>
          </div>
          <Reveal><Questions /></Reveal>
        </section>

        <section className="contact-section container" id="contact" aria-labelledby="contact-title">
          <div className="contact-card">
            <div className="contact-heading">
              <Reveal><div className="section-kicker mono"><span>05 /</span> ВАШ САЙТ НАЧИНАЕТСЯ С «ПРИВЕТ»</div></Reveal>
              <ScrollTitle id="contact-title" className="contact-title" lines={[{ text: 'Давайте сделаем' }, { text: 'что-то ваше.', className: 'text-peach title-serif' }]} />
              <Reveal><p>Расскажите о своём бизнесе.<br />Найдём, как показать его в лучшем свете.</p></Reveal>
            </div>
            <Reveal className="contact-links">
              <a className="button button-pastel telegram-button" href={contacts.telegram} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} aria-hidden="true" />Написать в Telegram<ArrowUpRight size={20} aria-hidden="true" /></a>
              <a className="contact-secondary" href={contacts.telegramChannel} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /><span>Telegram-канал · {contacts.telegramChannelLabel}</span><ArrowUpRight size={17} aria-hidden="true" /></a>
              <a className="contact-secondary" href={`mailto:${contacts.email}`}><Mail size={18} aria-hidden="true" /><span>{contacts.email}</span><ArrowUpRight size={17} aria-hidden="true" /></a>
              <a className="contact-secondary" href={contacts.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /><span>WhatsApp · {contacts.phoneLabel}</span><ArrowUpRight size={17} aria-hidden="true" /></a>
              <span className="contact-small">Без брифа на двадцать страниц. Просто поговорим.</span>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="site-footer container"><Wordmark footer /><span>© {copyrightYear} · С вниманием к вашему бизнесу.</span><a href="#top">Наверх<ArrowUp size={16} aria-hidden="true" /></a></footer>
    </div>
  )
}
