import { MagnifyingGlassIcon, FunnelIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { users } from '../data/mockData'
import { useState } from 'react'

export function UsersPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredUsers = users.filter((user) => {
    const matchesFilter = filter === 'all' || user.role === filter
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage students, instructors, and administrators
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700">
          <PlusIcon className="h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
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
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Users</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{users.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Active Users</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Instructors</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{users.filter(u => u.role === 'instructor').length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">School</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">XP</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      user.role === 'instructor' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-900 dark:text-white">{user.school}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{user.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.xp.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      user.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      user.status === 'suspended' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/users/${user.id}`}
                      className="text-sm font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
