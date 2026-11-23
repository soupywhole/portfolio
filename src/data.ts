export type DemoId = 'cafe' | 'repair' | 'tech'
export type Illustration = 'coffee' | 'croissant' | 'toast' | 'phone' | 'tablet' | 'headphones' | 'buds'

export const contacts = {
  brand: 'usurawa.dev',
  telegram: 'https://t.me/usurawarai',
  telegramLabel: '@usurawarai',
  telegramChannel: 'https://t.me/usurawadev',
  telegramChannelLabel: '@usurawadev',
  email: 'usurawa.dev@gmail.com',
  whatsapp: 'https://wa.me/79997272529',
  phoneLabel: '+7 999 727-25-29',
}

export const services: {
  id: DemoId
  title: string
  description: string
  features: string[]
  price: number
}[] = [
  {
    id: 'cafe',
    title: 'Кафе и рестораны',
    description: 'Передать атмосферу заведения ещё до первого визита.',
    features: ['Меню с категориями и фото', 'Состав и стоимость блюд', 'Контакты и расположение'],
    price: 20000,
  },
  {
    id: 'repair',
    title: 'Ремонт и услуги',
    description: 'Помочь клиенту найти нужную услугу без лишних звонков.',
    features: ['Понятный каталог услуг', 'Цены и описание работ', 'Быстрая связь с мастером'],
    price: 15000,
  },
  {
    id: 'tech',
    title: 'Магазины техники',
    description: 'Показать ассортимент так, чтобы его хотелось изучать.',
    features: ['Каталог с поиском и фильтрами', 'Карточки и характеристики', 'Подбор товаров и связь'],
    price: 25000,
  },
]

export const demos: {
  id: DemoId
  name: string
  category: string
  description: string
  tags: string[]
  preview: CatalogImage
}[] = [
  {
    id: 'cafe',
    name: 'тепло.',
    category: 'Кофейня и завтраки',
    description: 'Уют в деталях. Тёплая палитра, фотографии, которые передают атмосферу, и меню, в котором легко найти любимое.',
    tags: ['Электронное меню', 'Категории', 'Демо-заказ'],
    preview: { src: 'preview-cafe.jpg', width: 1440, height: 741 },
  },
  {
    id: 'repair',
    name: 'fixpoint',
    category: 'Сервисный центр',
    description: 'Спокойный, понятный сайт о ремонте. Услуги по типу устройства, поиск и прозрачное описание каждой работы.',
    tags: ['Каталог услуг', 'Поиск', 'Описание работ'],
    preview: { src: 'preview-repair.jpg', width: 1440, height: 699 },
  },
  {
    id: 'tech',
    name: 'orbit',
    category: 'Магазин техники',
    description: 'Техника на первом плане. Чистые карточки, фильтры по категориям, характеристики и демонстрационная корзина.',
    tags: ['Каталог товаров', 'Фильтры', 'Демо-корзина'],
    preview: { src: 'preview-tech.jpg', width: 1440, height: 724 },
  },
]

export interface CatalogImage {
  src: string
  width: number
  height: number
}

export const techImages = {
  iphone: { src: 'fixpoint-iphone.png', width: 200, height: 408 },
  duo: { src: 'iphoneduo.png', width: 1500, height: 2000 },
  ipad: { src: 'orbit-ipad.png', width: 660, height: 454 },
  macbook: { src: 'notebookair.png', width: 1100, height: 1100 },
  headphones: { src: 'orbit-airpods-max.png', width: 373, height: 411 },
  buds: { src: 'orbit-airpods-pro.png', width: 414, height: 693 },
}

export interface CatalogItem {
  id: string
  title: string
  category: string
  description: string
  price: number
  illustration: Illustration
  image?: CatalogImage
  detail: string
  specification: string
}

export const catalogs: Record<DemoId, CatalogItem[]> = {
  cafe: [
    { id: 'flat-white', title: 'Флэт уайт', category: 'Кофе', description: 'Двойной эспрессо и нежное молоко.', price: 260, illustration: 'coffee', detail: 'Насыщенный кофейный вкус и тонкая молочная текстура. В настоящем меню здесь можно указать состав, аллергены и варианты молока.', specification: '180 мл · содержит молоко' },
    { id: 'cappuccino', title: 'Капучино', category: 'Кофе', description: 'Тот самый баланс кофе и молочной пены.', price: 280, illustration: 'coffee', detail: 'Классический капучино для неспешного утра. Это демонстрационная позиция, а не предложение реальной кофейни.', specification: '250 мл · содержит молоко' },
    { id: 'latte', title: 'Латте', category: 'Кофе', description: 'Мягкий, молочный, на каждый день.', price: 320, illustration: 'coffee', detail: 'Эспрессо с большой порцией тёплого молока. В готовом сайте можно добавить выбор размера и дополнительные опции.', specification: '350 мл · содержит молоко' },
    { id: 'croissant', title: 'Круассан с маслом', category: 'Выпечка', description: 'Хрустящая корочка. Воздушная середина.', price: 240, illustration: 'croissant', detail: 'Пример карточки выпечки с составом. На сайте заведения используются ваши фотографии и актуальная информация.', specification: '80 г · содержит глютен и молоко' },
    { id: 'almond-croissant', title: 'Миндальный круассан', category: 'Выпечка', description: 'Для тех, кто любит утро чуть слаще.', price: 320, illustration: 'croissant', detail: 'Демонстрационная выпечка с миндальной начинкой. Аллергены и состав в рабочем меню согласуются с заведением.', specification: '110 г · содержит орехи, глютен и молоко' },
    { id: 'avocado-toast', title: 'Тост с авокадо', category: 'Завтраки', description: 'Хлеб, спелое авокадо и свежая зелень.', price: 460, illustration: 'toast', detail: 'Пример карточки завтрака. Здесь можно рассказать о блюде, указать вес и предложить дополнительные ингредиенты.', specification: '220 г · содержит глютен' },
  ],
  repair: [
    { id: 'screen', title: 'Замена дисплея', category: 'Смартфоны', description: 'Если экран разбит или перестал реагировать.', price: 3500, illustration: 'phone', detail: 'В демонстрационную услугу входят проверка устройства, замена дисплейного модуля и проверка сенсора. В реальном каталоге стоимость зависит от модели и деталей.', specification: 'Диагностика → замена → проверка' },
    { id: 'battery', title: 'Замена аккумулятора', category: 'Смартфоны', description: 'Когда заряда уже не хватает на день.', price: 2400, illustration: 'phone', detail: 'Пример описания замены батареи: проверка питания, подбор аккумулятора и контроль работы после установки. Никакая заявка через этот демо-сайт не отправляется.', specification: 'Проверка питания и нового аккумулятора' },
    { id: 'connector', title: 'Ремонт разъёма', category: 'Смартфоны', description: 'Зарядка снова без поиска нужного угла.', price: 1800, illustration: 'phone', detail: 'Демонстрационная карточка ремонта разъёма питания. В вашем каталоге будут реальные условия, совместимые модели и согласованная стоимость.', specification: 'Осмотр → ремонт → тест зарядки' },
    { id: 'cleaning', title: 'Чистка и обслуживание', category: 'Ноутбуки', description: 'Меньше шума, перегрева и пыли.', price: 2500, illustration: 'tablet', detail: 'Пример услуги: очистка системы охлаждения, проверка температуры и замена термоинтерфейса при необходимости. Цены в этом примере вымышлены.', specification: 'Система охлаждения и температурный тест' },
    { id: 'system', title: 'Настройка системы', category: 'Ноутбуки', description: 'Обновления, драйверы и стабильная работа.', price: 1200, illustration: 'tablet', detail: 'Карточка услуги настройки программного обеспечения. На рабочем сайте здесь можно описать ограничения и список входящих работ.', specification: 'Настройка ПО без удаления ваших данных' },
    { id: 'tablet-check', title: 'Диагностика планшета', category: 'Планшеты', description: 'Сначала узнаём причину. Потом решаем.', price: 900, illustration: 'tablet', detail: 'Демонстрационная диагностика с описанием этапов. Реальный сервис указывает свою стоимость и согласовывает ремонт с владельцем устройства.', specification: 'Проверка экрана, питания и подключения' },
  ],
  tech: [
    { id: 'iphone', title: 'Apple iPhone', category: 'Смартфоны', description: 'Всё нужное. Ничего лишнего.', price: 44990, illustration: 'phone', image: techImages.iphone, detail: 'iPhone с Face ID для повседневных задач, фото и видео. Использовано предоставленное изображение; точное поколение и конфигурация не заявлены. Цена демонстрационная, покупка недоступна.', specification: 'iOS · Face ID · OLED-дисплей' },
    { id: 'iphone-duo', title: 'Apple iPhone Duo', category: 'Смартфоны', description: 'Больше экрана. Больше возможностей.', price: 192890, illustration: 'phone', image: techImages.duo, detail: 'Складной iPhone Duo с внутренним OLED-экраном 7,6 дюйма и чипом A20 Pro. Для ценового ориентира выбрана версия 256 ГБ, Star White, eSIM. Предоставленное изображение используется как иллюстрация. Цена зафиксирована 21.11.2026 по карточке Justalk, покупка недоступна.', specification: '256 ГБ · 7,6″ · A20 Pro' },
    { id: 'ipad', title: 'Apple iPad', category: 'Планшеты', description: 'Для идей, заметок и любимых историй.', price: 32990, illustration: 'tablet', image: techImages.ipad, detail: 'Компактный iPad для чтения, заметок и приложений. Использовано предоставленное фото; поколение, память и вариант подключения не уточняются. Корзина работает только локально, покупка недоступна.', specification: 'iPadOS · компактный формат · сенсорный экран' },
    { id: 'macbook-air-15-2026', title: 'Apple MacBook Air 15″ (2026)', category: 'Ноутбуки', description: 'Большой экран. Лёгкий характер.', price: 126890, illustration: 'tablet', image: techImages.macbook, detail: 'MacBook Air 15″ 2026 года на Apple M5 с экраном Liquid Retina 15,3 дюйма. Для ценового ориентира выбрана версия с 16 ГБ объединённой памяти, SSD 512 ГБ, цветом Midnight и английской раскладкой. Предоставленное изображение используется как иллюстрация. Цена зафиксирована 21.11.2026 по карточке Justalk, покупка недоступна.', specification: '15,3″ · M5 · 16 / 512 ГБ' },
    { id: 'airpods-max', title: 'Apple AirPods Max', category: 'Аудио', description: 'Ваш плейлист. Без внешнего шума.', price: 12990, illustration: 'headphones', image: techImages.headphones, detail: 'Полноразмерные беспроводные AirPods Max с активным шумоподавлением и прозрачным режимом. Использовано предоставленное фото. Цена служит примером, реальные заказы и платежи не принимаются.', specification: 'Bluetooth · шумоподавление · прозрачный режим' },
    { id: 'airpods-pro', title: 'Apple AirPods Pro', category: 'Аудио', description: 'Хороший звук, который всегда с вами.', price: 5990, illustration: 'buds', image: techImages.buds, detail: 'Компактные AirPods Pro с активным шумоподавлением и зарядным кейсом. Использовано предоставленное изображение, точное поколение не заявлено. Эта карточка демонстрирует каталог, а не реальную продажу.', specification: 'Bluetooth · зарядный кейс · шумоподавление' },
  ],
}

const rubles = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

export function formatPrice(price: number) {
  return rubles.format(price)
}

export function getDemoId(hash: string): DemoId | null {
  return demos.find((demo) => hash === `#/demo/${demo.id}`)?.id ?? null
}

export function filterItems(items: CatalogItem[], category: string, search: string) {
  const query = search.trim().toLocaleLowerCase('ru-RU')
  return items.filter((item) =>
    (category === 'Все' || item.category === category)
    && `${item.title} ${item.description}`.toLocaleLowerCase('ru-RU').includes(query),
  )
}

export function cartTotal(items: CatalogItem[], quantities: Record<string, number>) {
  return items.reduce((total, item) => total + item.price * (quantities[item.id] ?? 0), 0)
}
