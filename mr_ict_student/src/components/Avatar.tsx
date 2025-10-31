import { initialLetters } from '../utils/format'

type AvatarProps = {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-16 w-16 text-xl',
}

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ring-2 ring-white shadow-sm dark:ring-slate-900 ${sizeMap[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary-500 text-white ring-2 ring-white shadow-sm dark:ring-slate-900 ${sizeMap[size]} ${className}`}
    >
      {initialLetters(name)}
    </div>
  )
}
