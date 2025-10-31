import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline'
  icon?: ReactNode
}

export function PrimaryButton({
  children,
  className,
  variant = 'solid',
  icon,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed',
        variant === 'solid'
          ? 'bg-primary-500 text-white shadow-glow hover:bg-primary-400 dark:bg-primary-400 dark:hover:bg-primary-300'
          : 'border border-primary-500 text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:border-primary-300 dark:hover:bg-primary-500/10',
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}
