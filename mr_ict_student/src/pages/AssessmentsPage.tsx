import { AssessmentCard } from '../components/AssessmentCard'
import { assessments } from '../data/mockData'

export function AssessmentsPage() {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Assessments</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Sprint checkpoints, capstone briefs, and reflective prompts help you track progress and earn XP.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {assessments.map((assessment) => (
          <AssessmentCard key={assessment.id} assessment={assessment} />
        ))}
      </section>
    </div>
  )
}
