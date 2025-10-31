import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { TopNavigation } from '../components/TopNavigation'

export function ShellLayout() {
  return (
    <div className="min-h-screen bg-slate-50/70 pb-12 dark:bg-slate-950">
      <div className="flex">
        <Sidebar />
        <div className="flex min-h-screen w-full flex-col">
          <TopNavigation />
          <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-6 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
