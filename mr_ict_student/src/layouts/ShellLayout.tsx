import { Outlet } from 'react-router-dom'
import { LearningFooter } from '../components/LearningFooter'
import { Sidebar } from '../components/Sidebar'
import { TopNavigation } from '../components/TopNavigation'

export function ShellLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
        <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900">
          <TopNavigation />
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
            <div className="flex flex-col space-y-8">
              <Outlet />
            </div>
          </main>
          <div className="mx-auto w-full max-w-6xl px-6 pb-8">
            <LearningFooter />
          </div>
        </div>
      </div>
    </div>
  )
}
