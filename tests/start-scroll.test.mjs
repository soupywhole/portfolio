import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
const script = html.match(/<script id="start-at-top">([\s\S]*?)<\/script>/)[1]

function start({ hash = '', type = 'navigate', fonts = Promise.resolve() } = {}) {
  const location = { hash, pathname: '/portfolio/', search: '?test=1' }
  const events = new EventTarget()
  const frames = []
  const scrolls = []
  const history = {
    state: { existing: true },
    scrollRestoration: 'auto',
    replaceState(state, _, url) {
      assert.equal(state, this.state)
      assert.equal(url, '/portfolio/?test=1')
      location.hash = ''
    },
  }
  runInNewContext(script, {
    location, history, AbortController,
    performance: { getEntriesByType: () => [{ type }] },
    document: { fonts: { ready: fonts } },
    requestAnimationFrame: callback => frames.push(callback),
    window: {
      addEventListener: events.addEventListener.bind(events),
      scrollTo: position => scrolls.push({ ...position }),
    },
  })
  const frame = () => frames.splice(0).forEach(callback => callback())
  const settle = async () => { frame(); await Promise.resolve(); frame() }
  return { location, history, scrolls, frame, settle, fire: type => events.dispatchEvent(new Event(type)) }
}

test('новая загрузка портфолио очищает старый якорь и начинает страницу сверху', async () => {
  for (const type of ['navigate', 'reload']) {
    for (const hash of ['', '#top', '#projects', '#services', '#process', '#contact']) {
      const page = start({ hash, type })
      assert.equal(page.location.hash, '')
      assert.equal(page.history.scrollRestoration, 'manual')
      page.fire('pageshow')
      await page.settle()
      assert.deepEqual(page.scrolls, Array(2).fill({ top: 0, left: 0, behavior: 'instant' }))
      assert.equal(page.history.scrollRestoration, 'auto')
      page.fire('pageshow')
      await page.settle()
      assert.equal(page.scrolls.length, 2, 'Возврат в уже открытую страницу не сбрасывает её повторно')
    }
  }
})

test('история Назад/Вперёд и прямые демо-ссылки не сбрасываются', async () => {
  const cases = [
    ...['', '#projects', '#services'].map(hash => ({ hash, type: 'back_forward' })),
    ...['cafe', 'repair', 'tech'].flatMap(id => ['navigate', 'reload'].map(type => ({ hash: `#/demo/${id}`, type }))),
  ]
  for (const item of cases) {
    const page = start(item)
    page.fire('pageshow')
    await page.settle()
    assert.equal(page.location.hash, item.hash)
    assert.equal(page.history.scrollRestoration, 'auto')
    assert.deepEqual(page.scrolls, [])
  }
})

test('восстановление позиции отключено до завершения загрузки шрифтов и первого кадра', async () => {
  const fonts = Promise.withResolvers()
  const page = start({ fonts: fonts.promise })
  page.fire('pageshow')
  page.frame()
  assert.equal(page.history.scrollRestoration, 'manual')
  assert.equal(page.scrolls.length, 1)
  fonts.resolve()
  await page.settle()
  assert.equal(page.history.scrollRestoration, 'auto')
  assert.equal(page.scrolls.length, 2)
})

test('поздний сброс не мешает касанию, прокрутке, клавиатуре или переходу в раздел', async () => {
  for (const type of ['pointerdown', 'wheel', 'keydown', 'hashchange']) {
    const fonts = Promise.withResolvers()
    const page = start({ fonts: fonts.promise })
    page.fire('pageshow')
    page.frame()
    page.fire(type)
    assert.equal(page.history.scrollRestoration, 'auto')
    fonts.resolve()
    await page.settle()
    assert.equal(page.scrolls.length, 1, type)
  }
})
