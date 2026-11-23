import { demos } from './data'
import type { CatalogImage, DemoId, Illustration } from './data'

export function ProductArt({ kind, variant = 0, image }: { kind: Illustration; variant?: number; image?: CatalogImage }) {
  if (image) {
    return <div className={`product-art product-photo art-${kind}`} aria-hidden="true"><img src={`${import.meta.env.BASE_URL}images/${image.src}`} alt="" width={image.width} height={image.height} loading="lazy" decoding="async" /></div>
  }

  if (kind === 'coffee' || kind === 'croissant' || kind === 'toast') {
    return <img className={`food-art food-${kind}`} src={`${import.meta.env.BASE_URL}images/${kind === 'coffee' ? 'coffee-cup' : kind}.webp`} alt="" loading="lazy" width="800" height="600" />
  }

  return (
    <div className={`product-art art-${kind} tone-${variant % 3}`} aria-hidden="true">
      {kind === 'phone' && <div className="phone-graphic"><div className="phone-screen"><span className="phone-island" /><span className="phone-time">09:41</span><span className="phone-orb" /><span className="phone-bottom" /></div></div>}
      {kind === 'tablet' && <div className="tablet-graphic"><div className="tablet-screen"><span className="tablet-orb" /><span className="tablet-line" /></div></div>}
      {kind === 'headphones' && <div className="headphones-graphic"><span className="headband" /><span className="earpad earpad-left" /><span className="earpad earpad-right" /></div>}
      {kind === 'buds' && <div className="buds-graphic"><span className="bud bud-left" /><span className="bud bud-right" /><span className="buds-case"><i /></span></div>}
    </div>
  )
}

export default function SitePreview({ kind, eager = false }: { kind: DemoId; eager?: boolean }) {
  const { preview } = demos.find(demo => demo.id === kind)!

  return (
    <div className={`site-preview preview-${kind}`} aria-hidden="true">
      <div className="browser-bar">
        <span className="browser-dots"><i /><i /><i /></span>
        <span className="browser-address">{kind === 'cafe' ? 'teplo' : kind === 'repair' ? 'fixpoint' : 'orbit'}.demo</span>
        <span className="browser-live">КОНЦЕПТ</span>
      </div>
      <img className="preview-screenshot" src={`${import.meta.env.BASE_URL}images/${preview.src}`} alt="" width={preview.width} height={preview.height} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'} />
    </div>
  )
}
