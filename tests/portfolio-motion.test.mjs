import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { cardOrigin, pointerPosition } from '../src/portfolio-motion.ts'

test('карточки одного ряда появляются из общей точки и сохраняют раскладку', () => {
  const group = { left: 40, top: 200, width: 1000, height: 600 }
  const left = { left: 40, top: 200, width: 480, height: 600 }
  const right = { ...left, left: 560 }
  const first = cardOrigin(left, group)
  const second = cardOrigin(right, group)
  assert.deepEqual(first, { x: 260, y: -210 })
  assert.deepEqual(second, { x: -260, y: -210 })
  assert.equal(left.left + left.width / 2 + first.x, right.left + right.width / 2 + second.x)
  assert.equal(cardOrigin({ ...group, height: 400 }, group).x, 0)
})

test('следование за курсором ограничено краями карточки и безопасно для нулевого размера', () => {
  const rectangle = { left: 10, top: 20, width: 200, height: 100 }
  assert.deepEqual(pointerPosition(110, 70, rectangle), { x: 0, y: 0 })
  assert.deepEqual(pointerPosition(10, 20, rectangle), { x: -1, y: -1 })
  assert.deepEqual(pointerPosition(210, 120, rectangle), { x: 1, y: 1 })
  assert.deepEqual(pointerPosition(900, -500, rectangle), { x: 1, y: -1 })
  assert.deepEqual(pointerPosition(100, 100, { ...rectangle, width: 0, height: 0 }), { x: 0, y: 0 })
})

test('появление карточек использует отдельный слой и освобождает его при reduced motion', () => {
  const css = readFileSync(new URL('../src/portfolio.css', import.meta.url), 'utf8')
  assert.match(css.match(/\.emerge-card\s*\{[^{}]*\}/)?.[0] ?? '', /will-change: transform, opacity/)
  const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
  assert.match(reduced, /\.emerge-card\s*\{[^{}]*will-change: auto/)
})

test('оранжевый маркер появления удалён из компонента и его стилей', () => {
  const component = readFileSync(new URL('../src/PortfolioEffects.tsx', import.meta.url), 'utf8')
  const css = readFileSync(new URL('../src/portfolio.css', import.meta.url), 'utf8')
  assert.equal(/emerge-spark|\bspark\b/.test(component), false)
  assert.equal(css.includes('emerge-spark'), false)
})
