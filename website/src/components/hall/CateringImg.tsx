import { photoSrc, PHOTO_H, PHOTO_W } from '@/data/cateringPhotos'

export default function CateringImg({ id, alt, sizes = '(min-width: 768px) 33vw, 50vw', priority = false, className = '' }: {
  id: string; alt: string; sizes?: string; priority?: boolean; className?: string
}) {
  return (
    <img
      src={photoSrc(id, 800)}
      srcSet={`${photoSrc(id, 800)} 800w, ${photoSrc(id, 1600)} 1600w`}
      sizes={sizes}
      width={PHOTO_W}
      height={PHOTO_H}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={`w-full h-auto object-cover ${className}`}
    />
  )
}
