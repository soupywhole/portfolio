type Bounds = { left: number; top: number; width: number; height: number }

export function cardOrigin(card: Bounds, group: Bounds) {
  return {
    x: group.left + group.width / 2 - (card.left + card.width / 2),
    y: Math.min(90, card.height * 0.2) - card.height / 2,
  }
}

export function pointerPosition(clientX: number, clientY: number, bounds: Bounds) {
  const clamp = (value: number) => Math.max(-1, Math.min(1, value))
  return {
    x: bounds.width > 0 ? clamp((clientX - bounds.left) / bounds.width * 2 - 1) : 0,
    y: bounds.height > 0 ? clamp((clientY - bounds.top) / bounds.height * 2 - 1) : 0,
  }
}
