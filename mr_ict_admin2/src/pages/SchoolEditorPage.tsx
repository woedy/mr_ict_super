import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { schools } from '../data/mockData'

type SchoolFormData = {
  name: string
  type: 'JHS' | 'SHS' | 'University' | 'Technical'
  location: string
  region: string
  district: string
  status: 'active' | 'inactive' | 'pending'
  contactEmail: string
  contactPhone: string
  principal: string
  logoUrl: string
}

export function SchoolEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id
  const existingSchool = isEditMode ? schools.find((s) => s.id === id) : null

  const [formData, setFormData] = useState<SchoolFormData>({
    name: existingSchool?.name || '',
    type: existingSchool?.type || 'SHS',
    location: existingSchool?.location || '',
    region: existingSchool?.region || '',
    district: existingSchool?.district || '',
    status: existingSchool?.status || 'pending',
    contactEmail: existingSchool?.contactEmail || '',
    contactPhone: existingSchool?.contactPhone || '',
    principal: existingSchool?.principal || '',
    logoUrl: existingSchool?.logoUrl || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Saving school:', formData)
    navigate('/schools')
  }

  const regions = [
    'Greater Accra Region',
    'Ashanti Region',
    'Central Region',
    'Eastern Region',
    'Northern Region',
    'Western Region',
    'Volta Region',
    'Upper East Region',
    'Upper West Region',
    'Bono Region',
    'Bono East Region',
    'Ahafo Region',
    'Western North Region',
    'Savannah Region',
    'North East Region',
    'Oti Region',
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/schools"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {isEditMode ? 'Edit School' : 'Add New School'}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {isEditMode ? 'Update school information' : 'Register a new school to the platform'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/schools')}
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            {isEditMode ? 'Save Changes' : 'Add School'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Information */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Basic Information</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  School Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="e.g., Wesley Grammar SHS"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    School Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="JHS">Junior High School (JHS)</option>
                    <option value="SHS">Senior High School (SHS)</option>
                    <option value="University">University</option>
                    <option value="Technical">Technical Institute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="pending">Pending Approval</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Logo URL
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <PhotoIcon className="h-5 w-5" />
                    Upload
                  </button>
                </div>
                {formData.logoUrl && (
                  <img
                    src={formData.logoUrl}
                    alt="Logo preview"
                    className="mt-3 h-24 w-24 rounded-xl object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Location</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  City/Town *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="e.g., Cape Coast"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Region *
                  </label>
                  <select
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="">Select region...</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    placeholder="e.g., Cape Coast Metropolitan"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact Information</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Principal/Head *
                </label>
                <input
                  type="text"
                  required
                  value={formData.principal}
                  onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="e.g., Dr. Kwabena Mensah"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    placeholder="info@school.edu.gh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    placeholder="+233 24 123 4567"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              School Type
            </h3>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Select the appropriate institution type. This helps categorize the school and determine available features.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Approval Status
            </h3>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              New schools start as "Pending" and must be approved before students can enroll.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
