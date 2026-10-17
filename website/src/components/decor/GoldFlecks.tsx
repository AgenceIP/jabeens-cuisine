/** Gold flecks from the dine-in menu (light theme only). Position and size come from the caller. */
export default function GoldFlecks({ className = '' }: { className?: string }) {
  return (
    <img
      src="/assets/decor/gold.webp"
      alt=""
      aria-hidden="true"
      width={600}
      height={472}
      loading="lazy"
      decoding="async"
      className={`light-only pointer-events-none select-none absolute h-auto ${className}`}
    />
  )
}
