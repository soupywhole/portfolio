import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('движущаяся SVG-форма имеет собственный слой, а reduced motion освобождает его', () => {
  const css = readFileSync(new URL('../src/portfolio.css', import.meta.url), 'utf8')
  const sculpture = css.match(/\.hero-sculpture\s*\{[^{}]*\}/)?.[0]
  assert.ok(sculpture)
  assert.match(sculpture, /will-change: transform/)
  const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
  assert.match(reduced, /\.hero-sculpture\s*\{[^{}]*will-change: auto/)
})
