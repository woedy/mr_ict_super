import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStudentJourney } from '../context/StudentJourneyContext'

const languages = ['English', 'Twi', 'Ga', 'Ewe']
const accessibilityOptions = ['Live captions', 'Audio descriptions', 'Offline downloads', 'High contrast mode']
const availabilityOptions = ['Morning sessions', 'Afternoon study', 'Evenings & weekends']

export function OnboardingPage() {
  const { student, profileComplete, completeOnboarding } = useStudentJourney()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [language, setLanguage] = useState(student?.language ?? 'English')
  const [interests, setInterests] = useState<string[]>(student?.interests ?? [])
  const [accessNeeds, setAccessNeeds] = useState<string[]>(student?.accessibility ?? ['Live captions'])
  const [availability, setAvailability] = useState(student?.availability ?? availabilityOptions[2])
  const [learningGoals, setLearningGoals] = useState(
    student?.learningGoals ?? 'Tell technology stories that resonate with Ghanaian classrooms.',
  )
  const [preferredMode, setPreferredMode] = useState<'online' | 'offline' | 'hybrid'>(student?.preferredMode ?? 'hybrid')

  useEffect(() => {
    if (profileComplete) {
      navigate('/dashboard', { replace: true })
    }
  }, [profileComplete, navigate])

  if (!student) {
    return <Navigate to="/signin" replace />
  }

  const progress = useMemo(() => Math.round(((step + 1) / 3) * 100), [step])

  const toggleAccessNeed = (option: string) => {
    setAccessNeeds((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    )
  }

  const toggleInterest = (option: string) => {
    setInterests((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    )
  }

  const handleNext = () => {
    setStep((current) => Math.min(2, current + 1))
  }

  const handleBack = () => {
    setStep((current) => Math.max(0, current - 1))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    completeOnboarding({
      language,
      interests,
      accessibility: accessNeeds,
      availability,
      learningGoals,
      preferredMode,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500/10 via-white to-accent-400/10 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl rounded-[3rem] border border-slate-200 bg-white/90 p-1 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="rounded-[calc(theme(borderRadius.3xl)-0.25rem)] bg-white p-10 dark:bg-slate-950/95">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
            <p className="text-xs uppercase tracking-[0.35em] text-primary-500">Student onboarding</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              Hi {student.firstName}, let’s tailor your learning studio.
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              We’ll customise lesson recommendations, offline packs, and community spaces based on what you share here.
            </p>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <form className="mt-8 space-y-10" onSubmit={handleSubmit}>
            {step === 0 ? (
              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Your learning language & style</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Preferred language</label>
                    <select
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      {languages.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">How will you mostly learn?</label>
                    <div className="mt-2 grid gap-3">
                      {['online', 'offline', 'hybrid'].map((option) => (
                        <label
                          key={option}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold capitalize transition ${
                            preferredMode === option
                              ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:border-primary-400 dark:text-primary-200'
                              : 'border-slate-200 text-slate-600 hover:border-primary-400 dark:border-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{option}</span>
                          <input
                            type="radio"
                            checked={preferredMode === option}
                            onChange={() => setPreferredMode(option as typeof preferredMode)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {step === 1 ? (
              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Access needs & schedule</h2>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Accessibility support</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {accessibilityOptions.map((option) => {
                      const selected = accessNeeds.includes(option)
                      return (
                        <button
                          type="button"
                          key={option}
                          onClick={() => toggleAccessNeed(option)}
                          className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                            selected
                              ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:border-primary-400 dark:text-primary-200'
                              : 'border-slate-200 text-slate-600 hover:border-primary-400 dark:border-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">When do you prefer to learn?</label>
                  <select
                    value={availability}
                    onChange={(event) => setAvailability(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {availabilityOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Your goals & interests</h2>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">What excites you?</label>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {['Story-driven web', 'Community data', 'Inclusive design', 'Creative media'].map((option) => {
                      const selected = interests.includes(option)
                      return (
                        <button
                          type="button"
                          key={option}
                          onClick={() => toggleInterest(option)}
                          className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                            selected
                              ? 'border-accent-500 bg-accent-500/10 text-accent-600 dark:border-accent-400 dark:text-accent-200'
                              : 'border-slate-200 text-slate-600 hover:border-primary-400 dark:border-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Describe your learning goals</label>
                  <textarea
                    value={learningGoals}
                    onChange={(event) => setLearningGoals(event.target.value)}
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>
              </section>
            ) : null}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-primary-400 hover:text-primary-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                disabled={step === 0}
              >
                Back
              </button>
              {step < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
                >
                  Enter the studio
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
