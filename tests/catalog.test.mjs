import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { catalogs, services, demos, contacts, filterItems, cartTotal, getDemoId, formatPrice } from '../src/data.ts'

test('направления имеют согласованные стартовые цены и рабочие демо-маршруты', () => {
  const prices = { cafe: 20000, repair: 15000, tech: 25000 }
  assert.equal(services.length, 3)
  for (const service of services) {
    assert.equal(service.price, prices[service.id])
    assert.ok(catalogs[service.id].length > 0)
    assert.equal(getDemoId(`#/demo/${service.id}`), service.id)
  }
  assert.equal(getDemoId('#projects'), null)
  assert.equal(getDemoId('#/demo/unknown'), null)
  assert.equal(getDemoId('#/demo/cafe/extra'), null)
})

test('превью портфолио используют отдельные локальные снимки действующих демо', () => {
  assert.equal(new Set(demos.map(demo => demo.preview.src)).size, 3)
  for (const demo of demos) {
    assert.equal(demo.preview.src, `preview-${demo.id}.jpg`)
    assert.equal(demo.preview.width, 1440)
    assert.ok(Number.isInteger(demo.preview.height) && demo.preview.height > 0)
    const image = readFileSync(new URL(`../public/images/${demo.preview.src}`, import.meta.url))
    assert.deepEqual([...image.subarray(0, 3)], [0xff, 0xd8, 0xff])
  }
})

test('поиск работает с русским текстом, регистром, пробелами и категорией', () => {
  assert.equal(filterItems(catalogs.cafe, 'Все', '  КАПУЧИНО ').length, 1)
  assert.equal(filterItems(catalogs.cafe, 'Выпечка', 'круассан').length, 2)
  assert.equal(filterItems(catalogs.cafe, 'Кофе', 'круассан').length, 0)
  assert.equal(filterItems(catalogs.repair, 'Все', 'несуществующая услуга').length, 0)
  assert.equal(filterItems(catalogs.tech, 'Все', '').length, catalogs.tech.length)
})

test('корзина считает количество и не учитывает неизвестные позиции', () => {
  assert.equal(cartTotal(catalogs.cafe, {}), 0)
  assert.equal(cartTotal(catalogs.cafe, { cappuccino: 2, croissant: 1 }), 800)
  assert.equal(cartTotal(catalogs.tech, { iphone: 1, 'airpods-max': 2, unknown: 50 }), 70970)
  assert.equal(cartTotal(catalogs.tech, { 'iphone-duo': 1, 'macbook-air-15-2026': 2, 'oneplus-13t': 10, 'xiaomi-pad-8-pro': 10 }), 446670)
  assert.match(formatPrice(10000), /10\s000\s₽/)
})

test('orbit использует шесть реальных моделей с разными локальными фотографиями', () => {
  assert.deepEqual(catalogs.tech.map(item => item.title), ['Apple iPhone', 'Apple iPhone Duo', 'Apple iPad', 'Apple MacBook Air 15″ (2026)', 'Apple AirPods Max', 'Apple AirPods Pro'])
  assert.deepEqual(catalogs.tech.map(item => item.price), [44990, 192890, 32990, 126890, 12990, 5990])
  assert.equal(new Set(catalogs.tech.map(item => item.image?.src)).size, 6)
  for (const item of catalogs.tech) {
    assert.ok(item.image)
    const png = readFileSync(new URL(`../public/images/${item.image.src}`, import.meta.url))
    assert.equal(png.subarray(1, 4).toString(), 'PNG')
    assert.equal(png.readUInt32BE(16), item.image.width)
    assert.equal(png.readUInt32BE(20), item.image.height)
    assert.ok(filterItems(catalogs.tech, item.category, `  ${item.title.toUpperCase()}  `).includes(item))
  }
})

test('замена orbit использует предоставленные PNG и датированные источники цен', () => {
  const page = readFileSync(new URL('../src/DemoPage.tsx', import.meta.url), 'utf8')
  const credits = readFileSync(new URL('../public/images/orbit-photo-credits.md', import.meta.url), 'utf8')
  assert.equal(catalogs.tech[1].id, 'iphone-duo')
  assert.equal(catalogs.tech[1].image.src, 'iphoneduo.png')
  assert.equal(catalogs.tech[1].category, 'Смартфоны')
  assert.equal(catalogs.tech[3].id, 'macbook-air-15-2026')
  assert.equal(catalogs.tech[3].image.src, 'notebookair.png')
  assert.equal(catalogs.tech[3].category, 'Ноутбуки')
  assert.deepEqual(filterItems(catalogs.tech, 'Ноутбуки', ' AIR '), [catalogs.tech[3]])
  assert.deepEqual(filterItems(catalogs.tech, 'Смартфоны', '  APPLE IPHONE  '), catalogs.tech.slice(0, 2))
  assert.equal(filterItems(catalogs.tech, 'Планшеты', '').length, 1)
  for (const search of ['OnePlus', 'Xiaomi']) assert.equal(filterItems(catalogs.tech, 'Все', search).length, 0)
  for (const item of [catalogs.tech[1], catalogs.tech[3]]) assert.match(item.detail, /21\.11\.2026 по карточке Justalk, покупка недоступна/)
  for (const value of ['21.11.2026', 'https://justalk.ru/product/iphone-duo-256-white/', 'https://justalk.ru/product/macbook-air-15-2026-m5-mdvh4/']) {
    assert.ok(page.includes(value))
    assert.ok(credits.includes(value))
  }
  assert.match(credits, /Авторство, источник и лицензия предоставленных PNG не подтверждены/)
  assert.doesNotMatch(page, /OnePlus|Xiaomi|CC BY 4\.0|X-SHLIED|P1898/)
})

test('каталоги содержат уникальные идентификаторы и корректные цены', () => {
  for (const demo of demos) {
    const items = catalogs[demo.id]
    assert.equal(new Set(items.map((item) => item.id)).size, items.length)
    for (const item of items) {
      assert.ok(Number.isFinite(item.price) && item.price >= 0)
      assert.ok(item.title && item.category && item.detail && item.specification)
    }
  }
  assert.equal(contacts.brand, 'usurawa.dev')
  assert.equal(contacts.email, 'usurawa.dev@gmail.com')
  assert.equal(contacts.telegram, 'https://t.me/usurawarai')
  assert.equal(contacts.telegramLabel, '@usurawarai')
  assert.equal(contacts.telegramChannel, 'https://t.me/usurawadev')
  assert.equal(contacts.telegramChannelLabel, '@usurawadev')
  assert.equal(contacts.whatsapp, 'https://wa.me/79997272529')
})
