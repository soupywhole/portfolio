import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Asterisk, Check, Coffee, Info, Mail, MessageCircle, Minus, Plus, Search, Send, ShoppingBag, Smartphone, Trash2, Wrench, X } from 'lucide-react'
import { cartTotal, catalogs, contacts, demos, filterItems, formatPrice } from './data'
import type { CatalogItem, DemoId } from './data'
import { ProductArt } from './SitePreview'
import RepairHero from './RepairHero'
import TechHero from './TechHero'
import repairBackground from '../assets/remont.jpg'
import './demo.css'

export default function DemoPage({ id }: { id: DemoId }) {
  const demo = demos.find((item) => item.id === id)!
  const items = catalogs[id]
  const [category, setCategory] = useState('Все')
  const [search, setSearch] = useState('')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [detail, setDetail] = useState<CatalogItem | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const cartDialog = useRef<HTMLDialogElement>(null)
  const detailDialog = useRef<HTMLDialogElement>(null)
  const reducedMotion = useReducedMotion()
  const categories = ['Все', ...new Set(items.map((item) => item.category))]
  const filtered = filterItems(items, category, search)
  const selectedItems = items.filter((item) => (quantities[item.id] ?? 0) > 0)
  const count = selectedItems.reduce((total, item) => total + quantities[item.id], 0)
  const total = cartTotal(items, quantities)
  const isCafe = id === 'cafe'
  const isRepair = id === 'repair'
  const basketName = isCafe ? 'Демо-заказ' : 'Демо-корзина'

  useEffect(() => {
    document.getElementById('demo-title')?.focus({ preventScroll: true })
  }, [])

  function scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' })
  }

  function changeQuantity(item: CatalogItem, delta: number) {
    setQuantities((current) => {
      const next = { ...current }
      const quantity = Math.min(99, Math.max(0, (current[item.id] ?? 0) + delta))
      if (quantity === 0) delete next[item.id]
      else next[item.id] = quantity
      return next
    })
    setAnnouncement(`${item.title}: ${delta > 0 ? 'добавлено' : 'количество уменьшено'}. Это только демонстрация.`)
  }

  function showDetails(item: CatalogItem) {
    setDetail(item)
    detailDialog.current?.showModal()
  }

  return (
    <div className={`demo-page demo-${id}`}>
      <a className="skip-link" href="#demo-main" onClick={(event) => { event.preventDefault(); document.getElementById('demo-main')?.focus(); scrollTo('demo-main') }}>К основному содержимому</a>
      <div className="demo-notice"><div className="container"><a href="#projects"><ArrowLeft size={16} aria-hidden="true" />К портфолио</a><span><span className="demo-notice-dot" />Демонстрационный сайт. Заказы и заявки не отправляются.</span><a href="#contact" className="demo-notice-brand">usurawa.dev <ArrowUpRight size={14} aria-hidden="true" /></a></div></div>
      <main id="demo-main" tabIndex={-1}>
        <div className="demo-intro">
          {isRepair && <div className="repair-hero-background" aria-hidden="true"><img src={repairBackground} alt="" width="2752" height="1536" fetchPriority="high" /></div>}
          <header className="demo-nav container"><button className="demo-logo" onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })} aria-label={`${demo.name} — наверх`}>{isCafe ? <>тепло<span>.</span></> : isRepair ? <>fixpoint<span>↗</span></> : <>orbit<span>®</span></>}</button><nav aria-label="Навигация демо-сайта"><button onClick={() => scrollTo('demo-catalog')}>{isCafe ? 'Меню' : 'Каталог'}</button><button onClick={() => scrollTo('demo-story')}>{isCafe ? 'О месте' : isRepair ? 'Как это работает' : 'О выборе'}</button></nav>{!isRepair ? <button className="demo-basket-button" onClick={() => cartDialog.current?.showModal()}><ShoppingBag size={18} aria-hidden="true" /><span>{isCafe ? 'Ваш заказ' : 'Корзина'}</span><b><span className="sr-only">Позиций: </span>{count}</b></button> : <button className="demo-basket-button repair-nav-button" onClick={() => scrollTo('demo-story')}>Всё о ремонте<ArrowUpRight size={17} aria-hidden="true" /></button>}</header>

          <section className="demo-hero container" aria-labelledby="demo-title">
            <div className="demo-hero-copy"><div className="demo-eyebrow mono">{isCafe ? <Coffee size={16} aria-hidden="true" /> : isRepair ? <Wrench size={16} aria-hidden="true" /> : <Asterisk size={18} aria-hidden="true" />}{isCafe ? 'КОФЕ & МЕДЛЕННЫЕ УТРА' : isRepair ? 'РЕМОНТ БЕЗ ЛИШНЕЙ СУЕТЫ' : 'ТЕХНИКА ДЛЯ ВАШЕЙ ЖИЗНИ'}</div><h1 id="demo-title" tabIndex={-1}>{isCafe ? <>Хороший день<br />начинается<br /><em>здесь.</em></> : isRepair ? <>Ваша техника.<br /><em>Снова в деле.</em></> : <>Технологии.<br />На вашей<br /><em>орбите.</em></>}</h1><p>{isCafe ? 'Горячий кофе, хрустящая выпечка и место, где можно чуть замедлиться. Маленькие радости — каждый день.' : isRepair ? 'От разбитого экрана до уставшего аккумулятора. Найдите свою услугу и посмотрите, что входит в работу.' : 'Хорошие устройства для больших и маленьких идей. Найдите то, что станет частью вашего дня.'}</p><button className="demo-primary-button" onClick={() => scrollTo('demo-catalog')}>{isCafe ? 'Заглянуть в меню' : isRepair ? 'Выбрать услугу' : 'Смотреть каталог'}<ArrowUpRight size={20} aria-hidden="true" /></button><div className="demo-hero-note"><span className="demo-line" />{isCafe ? 'У каждого дня может быть тёплое начало.' : isRepair ? 'Сначала понятно. Потом спокойно.' : 'Меньше лишнего. Больше вашего.'}</div></div>
            <div className="demo-hero-art" aria-hidden="true">{isCafe ? <><img className="demo-coffee-photo" src={`${import.meta.env.BASE_URL}images/coffee.webp`} alt="" width="1200" height="800" fetchPriority="high" /><span className="cafe-round-note">Ещё один<br />повод выйти<br /><em>из дома.</em><Asterisk size={23} /></span><span className="cafe-photo-caption mono">ПАУЗА, КОТОРУЮ ВЫ ЗАСЛУЖИЛИ</span></> : isRepair ? <RepairHero /> : <TechHero />}</div>
          </section>
        </div>

        <div className="demo-values"><div className="container">{(isCafe ? ['Свежий кофе', 'Завтраки без спешки', 'Место для встречи'] : isRepair ? ['Понятные услуги', 'Прозрачное описание', 'Удобный выбор'] : ['Характеристики по делу', 'Удобный каталог', 'Внимание к деталям']).map((value) => <span key={value}><Asterisk size={20} aria-hidden="true" />{value}</span>)}</div></div>

        <section className="demo-catalog-section container" id="demo-catalog" aria-labelledby="catalog-title"><div className="demo-section-top"><div><span className="demo-eyebrow mono">{isCafe ? 'МЕНЮ / МАЛЕНЬКИЕ РАДОСТИ' : isRepair ? 'КАТАЛОГ / НАЙДЁМ РЕШЕНИЕ' : 'КАТАЛОГ / ВАШ НОВЫЙ СПУТНИК'}</span><h2 id="catalog-title">{isCafe ? <>А чего хочется<br /><em>сегодня?</em></> : isRepair ? <>Что нужно<br /><em>вашей технике?</em></> : <>Следующее любимое<br /><em>устройство — здесь.</em></>}</h2></div><p>Это интерактивный пример.<br />{id === 'tech' ? 'Модели реальные, цены — демонстрационные.' : 'Все позиции и цены вымышлены.'}<br />Попробуйте поиск, фильтры и карточки.</p></div><div className="catalog-controls"><div className="category-filters" role="group" aria-label="Категории каталога">{categories.map((value) => <button key={value} aria-pressed={category === value} className={category === value ? 'selected' : ''} onClick={() => setCategory(value)}>{value}</button>)}</div><div className="catalog-search"><Search size={18} aria-hidden="true" /><label className="sr-only" htmlFor="catalog-search">{isCafe ? 'Поиск по меню' : isRepair ? 'Поиск услуг' : 'Поиск товаров'}</label><input id="catalog-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={isCafe ? 'Найти в меню...' : isRepair ? 'Найти услугу...' : 'Найти устройство...'} /></div></div><p className="catalog-result-count" role="status" aria-live="polite">{isRepair ? 'Услуг' : 'Позиций'}: {filtered.length}</p><div className={`catalog-grid${isRepair ? ' repair-catalog-grid' : ''}`}>{filtered.map((item) => <article key={item.id} className="catalog-card">{isRepair ? <div className="repair-card-top"><span>{item.category === 'Смартфоны' ? <Smartphone size={25} aria-hidden="true" /> : <Wrench size={25} aria-hidden="true" />}</span><span className="mono">{item.category}</span><ArrowUpRight size={20} aria-hidden="true" /></div> : <div className="catalog-item-art"><ProductArt kind={item.illustration} variant={items.indexOf(item)} image={item.image} /><span className="catalog-category">{item.category}</span></div>}<div className="catalog-item-info"><h3>{item.title}</h3><p>{item.description}</p><span className="item-specification">{item.specification}</span><div className="catalog-item-bottom"><strong>{formatPrice(item.price)}</strong>{isRepair ? <button className="item-detail-button" onClick={() => showDetails(item)}>Что входит<ArrowRight size={17} aria-hidden="true" /><span className="sr-only">: {item.title}</span></button> : <button className="item-add-button" disabled={(quantities[item.id] ?? 0) >= 99} onClick={() => changeQuantity(item, 1)} aria-label={`Добавить: ${item.title}`}>Добавить<Plus size={17} aria-hidden="true" /></button>}</div>{!isRepair && <button className="item-more-button" onClick={() => showDetails(item)}>Подробнее<ArrowUpRight size={13} aria-hidden="true" /><span className="sr-only">: {item.title}</span></button>}</div></article>)}</div>{filtered.length === 0 && <div className="catalog-empty"><Search size={32} aria-hidden="true" /><h3>Пока ничего не нашлось</h3><p>Попробуйте другое название или покажите все категории.</p><button className="demo-primary-button" onClick={() => { setSearch(''); setCategory('Все') }}>Сбросить поиск<ArrowRight size={18} aria-hidden="true" /></button></div>}</section>

        {isRepair && (
          <section className="repair-contact-section" id="demo-repair-contact" aria-labelledby="repair-contact-title">
            <div className="repair-contact-inner">
              <div className="repair-contact-copy">
                <span className="demo-eyebrow mono">НЕ НАШЛИ В КАТАЛОГЕ / ДАВАЙТЕ ОБСУДИМ</span>
                <h2 id="repair-contact-title">Не нашли<br /><em>нужную услугу?</em></h2>
                <p>Напишите нам, поможем с вашей проблемой.</p>
                <a href={contacts.telegram} className="demo-primary-button" target="_blank" rel="noopener noreferrer">Написать нам<Send size={18} aria-hidden="true" /></a>
              </div>
              <address className="repair-contact-links">
                <a href={contacts.telegram} target="_blank" rel="noopener noreferrer"><span className="repair-contact-icon"><Send size={19} aria-hidden="true" /></span><span><span>Telegram</span><strong>{contacts.telegramLabel}</strong></span><ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href={contacts.whatsapp} target="_blank" rel="noopener noreferrer"><span className="repair-contact-icon"><MessageCircle size={20} aria-hidden="true" /></span><span><span>WhatsApp</span><strong>{contacts.phoneLabel}</strong></span><ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href={`mailto:${contacts.email}`}><span className="repair-contact-icon"><Mail size={20} aria-hidden="true" /></span><span><span>Почта</span><strong>{contacts.email}</strong></span><ArrowUpRight size={18} aria-hidden="true" /></a>
              </address>
            </div>
            <p className="repair-contact-note"><Info size={15} aria-hidden="true" />fixpoint — демонстрация. Временно указаны личные контакты автора usurawa.dev, а не действующего сервисного центра.</p>
          </section>
        )}

        <section className="demo-story container" id="demo-story" aria-labelledby="story-title">{isCafe ? <><div className="demo-story-photo"><img src={`${import.meta.env.BASE_URL}images/cafe.webp`} alt="Уютный интерьер кофейни с растениями и мягким светом" loading="lazy" width="1200" height="800" /></div><div><span className="demo-eyebrow mono">НЕ ТОЛЬКО ПРО КОФЕ</span><h2 id="story-title">Обычный день.<br /><em>Особенное место.</em></h2><p>На сайте вашей кофейни здесь будет её история. Почему вы выбрали именно этот кофе. За что гости любят ваши завтраки. И где найти своё любимое место у окна.</p><p>В этом концепте мы показываем, как передать атмосферу ещё до первого визита.</p><Asterisk size={58} strokeWidth={1} aria-hidden="true" /></div></> : <><div><span className="demo-eyebrow mono">{isRepair ? 'ВСЁ ПО ПОРЯДКУ' : 'ПОНЯТНО. КРАСИВО. ПО ДЕЛУ.'}</span><h2 id="story-title">{isRepair ? <>Меньше вопросов.<br /><em>Больше ясности.</em></> : <>Выбирайте<br /><em>не спеша.</em></>}</h2><p>{isRepair ? 'На сайте реального сервиса здесь можно объяснить процесс ремонта, условия и способы связи. Не обещать лишнего — а помочь клиенту разобраться.' : 'Хороший каталог не мешает выбирать. Он помогает сравнить, узнать характеристики и собрать нужное в одном месте.'}</p></div><div className="demo-story-points">{(isRepair ? [{ title: 'Расскажите о проблеме', text: 'Клиент находит устройство и подходящую услугу.' }, { title: 'Узнайте, что входит', text: 'Описание, цена и детали доступны в карточке.' }, { title: 'Выберите способ связи', text: 'Контакты доступны в блоке «Не нашли нужную услугу?» выше.' }] : [{ title: 'Найдите своё', text: 'Поиск и категории без лишних переходов.' }, { title: 'Изучите детали', text: 'Характеристики и описание прямо в карточке.' }, { title: 'Соберите выбор', text: 'В этом демо корзина работает только локально.' }]).map((point, index) => <div key={point.title}><span className="mono">0{index + 1}</span><div><h3>{point.title}</h3><p>{point.text}</p></div><ArrowUpRight size={20} aria-hidden="true" /></div>)}</div></>}</section>

        <section className="demo-bottom-cta container"><div><span className="mono">ЭТО ПРИМЕР. ВАШ САЙТ БУДЕТ ВАШИМ.</span><h2>Нравится такой подход?</h2><p>Сделаем сайт с характером вашего бизнеса.</p></div><a href="#contact" className="demo-primary-button">Обсудить свой сайт<ArrowUpRight size={20} aria-hidden="true" /></a></section>
        {id === 'tech' && (
          <aside className="tech-image-credits container" aria-label="Фотографии и цены устройств">
            <p>Ценовые ориентиры на 21.11.2026 по карточкам Justalk: <a href="https://justalk.ru/product/iphone-duo-256-white/" target="_blank" rel="noopener noreferrer">iPhone Duo 256 ГБ</a> и <a href="https://justalk.ru/product/macbook-air-15-2026-m5-mdvh4/" target="_blank" rel="noopener noreferrer">MacBook Air 15″ M5, 16 / 512 ГБ</a>. Цены могут измениться; покупки отключены.</p>
            <p>Изображения предоставлены для демонстрации и служат иллюстрациями. Бренды и продавец не связаны с автором портфолио.</p>
          </aside>
        )}
      </main>
      <footer className="demo-footer container"><span className="demo-footer-logo">{demo.name}</span><span>Вымышленный бренд · демонстрация от usurawa.dev</span><a href="#projects">Все примеры<ArrowUpRight size={16} aria-hidden="true" /></a></footer>

      {!isRepair && <button className="floating-basket" onClick={() => cartDialog.current?.showModal()}><ShoppingBag size={20} aria-hidden="true" /><span>{basketName}</span><b><span className="sr-only">Позиций: </span>{count}</b><span><span className="sr-only">Сумма: </span>{formatPrice(total)}</span></button>}
      <div className="sr-only" role="status" aria-live="polite">{announcement}</div>

      <dialog ref={detailDialog} className="demo-dialog detail-dialog" aria-labelledby="detail-title" onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close() }}><div className="dialog-inner"><div className="dialog-heading"><span className="demo-eyebrow mono">ДЕМОНСТРАЦИОННАЯ КАРТОЧКА</span><button className="dialog-close" onClick={() => detailDialog.current?.close()} aria-label="Закрыть описание"><X size={22} aria-hidden="true" /></button></div><h2 id="detail-title">{detail?.title ?? 'Подробнее'}</h2>{detail && <><span className="detail-specification">{detail.specification}</span><p className="detail-description">{detail.detail}</p><div className="detail-price"><span>Демо-цена</span><strong>{formatPrice(detail.price)}</strong></div>{isRepair ? <button className="demo-primary-button" onClick={() => detailDialog.current?.close()}>Понятно<Check size={18} aria-hidden="true" /></button> : <button className="demo-primary-button" disabled={(quantities[detail.id] ?? 0) >= 99} onClick={() => { changeQuantity(detail, 1); detailDialog.current?.close() }}>Добавить в {isCafe ? 'демо-заказ' : 'демо-корзину'}<Plus size={18} aria-hidden="true" /></button>}<p className="dialog-note"><Info size={16} aria-hidden="true" />Это пример. Реальные заявки и покупки не оформляются.</p></>}</div></dialog>

      {!isRepair && <dialog ref={cartDialog} className="demo-dialog cart-dialog" aria-labelledby="cart-title" onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close() }}><div className="dialog-inner"><div className="dialog-heading"><span className="demo-eyebrow mono">ТОЛЬКО ЛОКАЛЬНАЯ ДЕМОНСТРАЦИЯ</span><button className="dialog-close" onClick={() => cartDialog.current?.close()} aria-label="Закрыть корзину"><X size={22} aria-hidden="true" /></button></div><h2 id="cart-title">{basketName}</h2>{selectedItems.length === 0 ? <div className="cart-empty"><ShoppingBag size={37} aria-hidden="true" /><h3>Здесь пока пусто</h3><p>Добавьте что-нибудь из {isCafe ? 'меню' : 'каталога'} и посмотрите, как работает выбор.</p><button className="demo-primary-button" onClick={() => cartDialog.current?.close()}>Продолжить смотреть<ArrowRight size={18} aria-hidden="true" /></button></div> : <><ul className="cart-items">{selectedItems.map((item) => <li key={item.id}><div className="cart-item-title"><h3>{item.title}</h3><span>{formatPrice(item.price)} за шт.</span></div><div className="cart-item-controls"><button aria-label={`Уменьшить количество: ${item.title}`} onClick={() => changeQuantity(item, -1)}><Minus size={15} aria-hidden="true" /></button><span aria-label={`Количество: ${quantities[item.id]}`}>{quantities[item.id]}</span><button aria-label={`Увеличить количество: ${item.title}`} disabled={quantities[item.id] >= 99} onClick={() => changeQuantity(item, 1)}><Plus size={15} aria-hidden="true" /></button><button className="cart-remove" aria-label={`Удалить: ${item.title}`} onClick={() => changeQuantity(item, -quantities[item.id])}><Trash2 size={16} aria-hidden="true" /></button></div><strong>{formatPrice(item.price * quantities[item.id])}</strong></li>)}</ul><div className="cart-total"><span>Итого в демо</span><strong>{formatPrice(total)}</strong></div><button className="demo-primary-button checkout-disabled" disabled>Оформление отключено в демо</button></>}<p className="dialog-note"><Info size={16} aria-hidden="true" />Корзина не отправляется на сервер и сбрасывается при выходе из демо или обновлении страницы.</p></div></dialog>}
    </div>
  )
}
