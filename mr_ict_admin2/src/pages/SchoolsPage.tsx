import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { schools } from '../data/mockData'

export function SchoolsPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredSchools = schools.filter((school) => {
    const matchesFilter = filter === 'all' || school.type === filter || school.status === filter
    const matchesSearch = school.name.toLowerCase().includes(search.toLowerCase()) || school.location.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">School Management</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage schools, track enrollments, and monitor activity across Ghana and Africa
          </p>
        </div>
        <Link
          to="/schools/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5" />
          Add School
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by school name or location..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">All Schools</option>
            <option value="JHS">JHS</option>
            <option value="SHS">SHS</option>
            <option value="University">University</option>
            <option value="Technical">Technical</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Schools</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{schools.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Active Schools</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{schools.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Students</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{schools.reduce((acc, s) => acc + s.enrolledStudents, 0).toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Instructors</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{schools.reduce((acc, s) => acc + s.activeInstructors, 0)}</p>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredSchools.map((school) => (
          <div key={school.id} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between">
              <img
                src={school.logoUrl}
                alt={school.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                school.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                school.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {school.status}
              </span>
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{school.name}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{school.location}, {school.region}</p>

            <div className="mt-4 flex items-center gap-4">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                school.type === 'JHS' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' :
                school.type === 'SHS' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                school.type === 'University' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {school.type}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700">
              <div className="flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5 text-primary-500" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Students</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{school.enrolledStudents}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Instructors</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{school.activeInstructors}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Courses Offered</span>
                <span className="font-semibold text-slate-900 dark:text-white">{school.coursesOffered}</span>
              </div>
              <div className="flex justify-between">
                <span>Total XP</span>
                <span className="font-semibold text-slate-900 dark:text-white">{school.totalXP.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Joined</span>
                <span className="font-semibold text-slate-900 dark:text-white">{new Date(school.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Principal: <span className="font-semibold text-slate-900 dark:text-white">{school.principal}</span>
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to={`/schools/${school.id}`}
                className="flex-1 rounded-full bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredSchools.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">No schools found</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
