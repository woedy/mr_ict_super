import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeftIcon, PlusIcon, TrashIcon, PhotoIcon, PencilIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { courses, type Module, type Lesson } from '../data/mockData'

type CourseFormData = {
  title: string
  subtitle: string
  description: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  track: 'Web' | 'Data' | 'Design'
  status: 'draft' | 'published' | 'archived'
  xp: number
  hours: number
  instructors: string[]
  tags: string[]
  thumbnail: string
  modules: Module[]
}

export function CourseEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id
  const existingCourse = isEditMode ? courses.find((c) => c.id === id) : null

  const [formData, setFormData] = useState<CourseFormData>({
    title: existingCourse?.title || '',
    subtitle: existingCourse?.subtitle || '',
    description: existingCourse?.description || '',
    level: existingCourse?.level || 'Beginner',
    track: existingCourse?.track || 'Web',
    status: existingCourse?.status || 'draft',
    xp: existingCourse?.xp || 0,
    hours: existingCourse?.hours || 0,
    instructors: existingCourse?.instructors || [],
    tags: existingCourse?.tags || [],
    thumbnail: existingCourse?.thumbnail || '',
    modules: existingCourse?.modules || [],
  })

  const [newInstructor, setNewInstructor] = useState('')
  const [newTag, setNewTag] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Saving course:', formData)
    navigate('/courses')
  }

  const addInstructor = () => {
    if (newInstructor.trim()) {
      setFormData({ ...formData, instructors: [...formData.instructors, newInstructor.trim()] })
      setNewInstructor('')
    }
  }

  const addTag = () => {
    if (newTag.trim()) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag('')
    }
  }

  const addModule = () => {
    const newModule: Module = {
      id: `m${Date.now()}`,
      title: 'New Module',
      description: 'Module description',
      order: formData.modules.length + 1,
      lessons: [],
    }
    setFormData({ ...formData, modules: [...formData.modules, newModule] })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/courses" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{isEditMode ? 'Edit Course' : 'Create New Course'}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{isEditMode ? 'Update course information' : 'Set up a new course'}</p>
        </div>
        <button type="button" onClick={() => navigate('/courses')} className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Cancel</button>
        <button type="submit" className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">{isEditMode ? 'Save Changes' : 'Create Course'}</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Basic Information</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Course Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="e.g., Creative Web Foundations" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Subtitle *</label>
                <input type="text" required value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Description *</label>
                <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Level *</label>
                  <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value as any })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Track *</label>
                  <select value={formData.track} onChange={(e) => setFormData({ ...formData, track: e.target.value as any })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                    <option value="Web">Web Development</option>
                    <option value="Data">Data Science</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Duration (hours) *</label>
                  <input type="number" required min="0" value={formData.hours} onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">XP Reward *</label>
                  <input type="number" required min="0" value={formData.xp} onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Instructors & Tags</h2>
            <div className="mt-6 space-y-4">
              <div className="flex gap-2">
                <input type="text" value={newInstructor} onChange={(e) => setNewInstructor(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInstructor())} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Instructor name" />
                <button type="button" onClick={addInstructor} className="rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.instructors.map((instructor, index) => (
                  <span key={index} className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    {instructor}
                    <button type="button" onClick={() => setFormData({ ...formData, instructors: formData.instructors.filter((_, i) => i !== index) })} className="text-primary-600">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Course Content</h2>
              <button type="button" onClick={addModule} className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
                <PlusIcon className="h-4 w-4" />
                Add Module
              </button>
            </div>
            <div className="mt-6">
              {formData.modules.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-600 dark:bg-slate-700/50">
                  <p className="text-sm text-slate-600 dark:text-slate-400">No modules yet. Click "Add Module" to get started.</p>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">{formData.modules.length} modules added</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</h3>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  )
}
