import { useCountUp } from '@/hooks/useCountUp'
import { useT } from '@/contexts/LanguageContext'

interface StatProps {
  target: number
  suffix: string
  label: string
  decimals?: number
}

function StatItem({ target, suffix, label, decimals = 0 }: StatProps) {
  const { value, ref } = useCountUp(target, decimals, 2)

  return (
    <div className="flex flex-col items-center text-center px-6">
      <div className="flex items-baseline gap-1">
        <span
          ref={ref as React.RefObject<HTMLSpanElement>}
          className="text-display text-gold"
          style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1 }}
        >
          {decimals > 0 ? value.toFixed(decimals) : value}
        </span>
        <span className="text-display text-gold" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          {suffix}
        </span>
      </div>
      <p className="text-label text-text-muted mt-3">{label}</p>
    </div>
  )
}

export default function StatsBar() {
  const t = useT()

  return (
    <section style={{ background: '#0B0E25', borderTop: '1px solid #1E1E1E', borderBottom: '1px solid #1E1E1E', padding: '80px 0' }}>
      <div className="max-w-site mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6">
          <StatItem target={4.7} suffix="★" label={t.stats.google} decimals={1} />
          <StatItem target={500} suffix="+" label={t.stats.reviews} />
          <StatItem target={100} suffix="%" label={t.stats.halal} />
          <StatItem target={5} suffix="+" label={t.stats.experience} />
        </div>
      </div>
    </section>
  )
}
