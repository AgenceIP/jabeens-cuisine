import './Marquee.css'

const dishes = [
  'Biryani', 'Butter Chicken', 'Dal Makhani', 'Seekh Kebab',
  'Achaari Paneer', 'Malai Kofta', 'Rogan Josh', 'Tandoori Prawns',
  'Phirni Brûlée', 'Naan au Truffe', 'Karahi Bœuf', 'Chicken Tikka',
]

export default function Marquee() {
  const content = dishes.map((dish, i) => (
    <span key={i} className="marquee-item">
      <span className="marquee-text">{dish}</span>
      <span className="marquee-dot">·</span>
    </span>
  ))

  return (
    <div
      className="marquee-wrapper"
      style={{
        background: 'transparent',
        borderTop: '1px solid #1E1E1E',
        borderBottom: '1px solid #1E1E1E',
        padding: '20px 0',
        overflow: 'hidden',
      }}
    >
      <div className="marquee-track">
        <div className="marquee-list" aria-hidden="true">{content}</div>
        <div className="marquee-list" aria-hidden="true">{content}</div>
      </div>
    </div>
  )
}
