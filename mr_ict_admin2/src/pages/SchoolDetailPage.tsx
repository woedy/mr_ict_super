import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeftIcon, 
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserGroupIcon,
  AcademicCapIcon,
  TrophyIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { schools, users } from '../data/mockData'

export function SchoolDetailPage() {
  const { id } = useParams()
  const school = schools.find((s) => s.id === id)

  if (!school) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">School not found</h1>
        <Link to="/schools" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
          ← Back to schools
        </Link>
      </div>
    )
  }

  // Get students from this school
  const schoolStudents = users.filter((u) => u.schoolId === school.id && u.role === 'student')
  const schoolInstructors = users.filter((u) => u.schoolId === school.id && u.role === 'instructor')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/schools"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{school.name}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">School management and overview</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/schools/${school.id}/edit`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <PencilIcon className="h-4 w-4" />
            Edit School
          </Link>
          {school.status === 'pending' && (
            <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
              <CheckCircleIcon className="h-4 w-4" />
              Approve School
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* School Info Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start gap-6">
              <img
                src={school.logoUrl}
                alt={school.name}
                className="h-24 w-24 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{school.name}</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{school.type} Institution</p>
                  </div>
                  <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                    school.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    school.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {school.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPinIcon className="h-4 w-4" />
                    {school.location}, {school.region}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <EnvelopeIcon className="h-4 w-4" />
                    {school.contactEmail}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <PhoneIcon className="h-4 w-4" />
                    {school.contactPhone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <UserGroupIcon className="h-4 w-4" />
                    Principal: {school.principal}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Location Details</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">District:</span>
                      <span className="ml-2 font-semibold text-slate-900 dark:text-white">{school.district}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Region:</span>
                      <span className="ml-2 font-semibold text-slate-900 dark:text-white">{school.region}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Students List */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enrolled Students</h3>
              <span className="text-sm text-slate-600 dark:text-slate-400">{schoolStudents.length} students</span>
            </div>
            <div className="mt-6 space-y-3">
              {schoolStudents.length > 0 ? (
                schoolStudents.map((student) => (
                  <Link
                    key={student.id}
                    to={`/users/${student.id}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{student.xp.toLocaleString()} XP</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{student.coursesEnrolled} courses</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-600 dark:bg-slate-700/50">
                  <p className="text-sm text-slate-600 dark:text-slate-400">No students enrolled yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Instructors List */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Instructors</h3>
              <span className="text-sm text-slate-600 dark:text-slate-400">{schoolInstructors.length} instructors</span>
            </div>
            <div className="mt-6 space-y-3">
              {schoolInstructors.length > 0 ? (
                schoolInstructors.map((instructor) => (
                  <Link
                    key={instructor.id}
                    to={`/users/${instructor.id}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={instructor.avatarUrl}
                        alt={instructor.name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{instructor.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{instructor.email}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-600 dark:bg-slate-700/50">
                  <p className="text-sm text-slate-600 dark:text-slate-400">No instructors assigned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <UserGroupIcon className="h-8 w-8 text-primary-500" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Enrolled Students</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{school.enrolledStudents}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <AcademicCapIcon className="h-8 w-8 text-emerald-500" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Active Instructors</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{school.activeInstructors}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <BookOpenIcon className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Courses Offered</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{school.coursesOffered}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <TrophyIcon className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Total XP</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{school.totalXP.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              <button className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                <EnvelopeIcon className="h-4 w-4" />
                Email School
              </button>
              <button className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                <UserGroupIcon className="h-4 w-4" />
                Add Students
              </button>
              <button className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                <BookOpenIcon className="h-4 w-4" />
                Assign Courses
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          {school.status !== 'inactive' && (
            <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-md dark:border-red-900 dark:bg-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">Danger Zone</h3>
              <div className="mt-4">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                  <XCircleIcon className="h-4 w-4" />
                  Deactivate School
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
