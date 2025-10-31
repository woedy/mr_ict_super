import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-400 hover:text-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
    >
      {theme === 'dark' ? (
        <>
          <SunIcon className="h-4 w-4" />
          <span>Light</span>
        </>
      ) : (
        <>
          <MoonIcon className="h-4 w-4" />
          <span>Dark</span>
        </>
      )}
    </button>
  )
}
