import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync(new URL('../src/HomePage.tsx', import.meta.url), 'utf8')
const header = page.slice(page.indexOf('function Header()'), page.indexOf('function Atmosphere('))
const css = readFileSync(new URL('../src/portfolio.css', import.meta.url), 'utf8')

test('шторка не удаляется при закрытии и скрытые ссылки не принимают ввод', () => {
  assert.match(header, /id="mobile-menu" data-open=\{menuOpen\} aria-hidden=\{!menuOpen\} inert=\{!menuOpen\}/)
  assert.match(header, /className="mobile-menu-clip">\s*<nav className="mobile-nav"/)
  assert.ok(header.includes('setMenuOpen((open) => !open)'))
  assert.doesNotMatch(header, /menuOpen &&|AnimatePresence|<m\.nav|height: 'auto'/)
})

test('шторка закрывается до нулевой высоты вместе с отступами и уважает reduced motion', () => {
  const closed = css.match(/#mobile-menu\s*\{[^{}]*grid-template-rows[^{}]*\}/)?.[0]
  const open = css.match(/#mobile-menu\[data-open="true"\]\s*\{[^{}]*\}/)?.[0]
  assert.ok(closed && open)
  assert.match(closed, /grid-template-rows: 0fr/)
  assert.match(closed, /pointer-events: none/)
  assert.match(closed, /visibility: hidden/)
  assert.doesNotMatch(closed, /margin|padding|border:/)
  assert.match(open, /grid-template-rows: 1fr/)
  assert.match(open, /pointer-events: auto/)
  assert.match(open, /visibility: visible/)
  assert.match(css, /\.mobile-menu-clip\s*\{[^{}]*min-height: 0;[^{}]*overflow: hidden/)
  const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
  assert.match(reduced, /#mobile-menu\s*\{\s*transition: none/)
})

test('стекло находится на отдельном декоративном слое и не перехватывает нажатия', () => {
  const shell = css.match(/\.header-shell\s*\{[^{}]*\}/)?.[0]
  const glass = css.match(/\.header-shell::before\s*\{[^{}]*\}/)?.[0]
  assert.ok(shell && glass)
  assert.doesNotMatch(shell, /backdrop-filter/)
  assert.match(glass, /pointer-events: none/)
  assert.match(glass, /z-index: -1/)
  assert.match(glass, /-webkit-backdrop-filter: blur\(18px\);\s*backdrop-filter: blur\(18px\)/)
})
