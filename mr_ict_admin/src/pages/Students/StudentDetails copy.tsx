import { useEffect, useState } from 'react';
import LogoIcon from '../../images/logo/logo-icon.svg';

import {
  Code,
  Award,
  Calendar,
  Zap,
  Book,
  Github,
  Linkedin,
  Twitter,
  BarChart2,
  Terminal,
  Cpu,
  Star,
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useParams } from 'react-router-dom';
import { baseUrl, baseUrlMedia, userToken } from '../../constants';

const StudentProfilePage = ({ isAdmin = true }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(false);

  const { student_id } = useParams();


  
  useEffect(() => {
    console.log('####################################');
    console.log(student_id);
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch( baseUrl + `api/students/get-student-details/?student_id=${student_id}`,  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Token ${userToken}`,
                },
              } );
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setStudent(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);




  const _student = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatarUrl: LogoIcon,
    track: 'Full Stack Web Dev',
    progress: 72,
    challengesSolved: 38,
    daysActive: 64,
    languages: [
      { name: 'HTML', level: 85 },
      { name: 'CSS', level: 76 },
      { name: 'Javascript', level: 68 },
      { name: 'Python', level: 32 },
    ],
    achievements: [
      { name: '100 Days Streak', icon: <Calendar size={16} /> },
      { name: 'Top 5 in Leaderboard', icon: <Award size={16} /> },
      { name: 'Bug Bounty Badge', icon: <Zap size={16} /> },
      { name: '5 Pull Requests', icon: <Github size={16} /> },
    ],
    motivation: "Code is like humor. When you have to explain it, it's bad.",
    currentCourses: [
      { name: 'HTML', progress: 78, lastSeen: 'May 25, 2025' },
      {
        name: 'CSS',
        progress: 32,
        lastSeen: 'June 12, 2025',
      },
      {
        name: 'Javascript',
        progress: 15,
        lastSeen: 'July 3, 2025',
      },
    ],
    recentActivities: [
      {
        action: 'Completed challenge',
        name: 'React Auth Flow',
        time: '2 hours ago',
      },
      {
        action: 'Posted in forum',
        name: 'Help with React Hooks',
        time: 'Yesterday',
      },
      { action: 'Earned badge', name: 'CSS Ninja', time: '3 days ago' },
    ],
  };

  const ProgressCircle = ({ percentage, size = 'lg', label }) => {
    const strokeWidth = 8;
    const radius = size === 'sm' ? 24 : 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          className="transform -rotate-90"
          width={radius * 2 + strokeWidth}
          height={radius * 2 + strokeWidth}
        >
          <circle
            className="text-gray-200"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
          />
          <circle
            className="text-indigo-600"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
          />
        </svg>
        <span className="absolute text-center font-bold text-gray-800">
          {size === 'sm' ? (
            <span className="text-lg">{percentage}%</span>
          ) : (
            <>
              <span className="text-2xl">{percentage}%</span>
              {label && (
                <span className="block text-xs text-gray-500 mt-1">
                  {label}
                </span>
              )}
            </>
          )}
        </span>
      </div>
    );
  };

  const TabButton = ({ id, label, icon, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition ${
        active
          ? 'bg-indigo-100 text-indigo-800'
          : 'hover:bg-gray-100 text-gray-600'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  const SkillBar = ({ name, level }) => (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-sm font-medium text-gray-600">{level}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${level}%` }}
        ></div>
      </div>
    </div>
  );

  const CourseCard = ({ course }) => (
    <div className="bg-white dark:bg-boxdark p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
      <h3 className="font-medium text-gray-800">{course.name}</h3>
      <div className="mt-2 flex items-center justify-between">
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              course.progress < 30
                ? 'bg-red-500'
                : course.progress < 70
                ? 'bg-yellow'
                : 'bg-green'
            }`}
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <span className="ml-2 text-sm text-gray-600">{course.progress}%</span>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Last Seen: {course.lastSeen}
        </span>
        <button className="text-xs text-indigo-600 hover:text-indigo-800">
          Continue →
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Breadcrumb pageName="Student Details" />

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="p-6 text-center border-b">
              <div className="relative inline-block mb-4">
                <img
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                  src={`${baseUrlMedia}${student?.avatarUrl}`}
                  
                  alt="Avatar"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {student.name}
              </h2>
              <p className="text-sm text-gray-500">{student.email}</p>
              <div className="inline-block px-3 py-1 mt-2 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                {student.school}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-around text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {student.challengesSolved}
                  </div>
                  <div className="text-xs text-gray-500">Challenges</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {student.daysActive}
                  </div>
                  <div className="text-xs text-gray-500">Days Active</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                      {student?.achievements?.length ?? 0}
                   </div>
                  <div className="text-xs text-gray-500">Badges</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm p-4">
            <h3 className="font-medium text-gray-700 mb-3">Navigation</h3>
            <div className="space-y-1">
              <TabButton
                id="overview"
                label="Overview"
                icon={<BarChart2 size={18} />}
                active={activeTab === 'overview'}
              />
              <TabButton
                id="courses"
                label="My Courses"
                icon={<Book size={18} />}
                active={activeTab === 'courses'}
              />
              <TabButton
                id="skills"
                label="Skills"
                icon={<Cpu size={18} />}
                active={activeTab === 'skills'}
              />
              <TabButton
                id="achievements"
                label="Achievements"
                icon={<Award size={18} />}
                active={activeTab === 'achievements'}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-12 md:col-span-9">
          {activeTab === 'overview' && (
            <>
              {/* Progress Overview */}
              <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Learning Progress
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0">
                    <ProgressCircle
                      percentage={student.progress}
                      label="Overall  Progress"
                    />
                  </div>
                  <div className="flex-grow max-w-md mx-4">
                    <div className="text-sm text-gray-600 mb-1">
                      You're making great progress! Keep up the momentum to
                      unlock more advanced courses.
                    </div>
                    <div className="w-full bg-gray rounded-full h-2 mb-4">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="font-semibold text-gray-800">
                          Beginner
                        </div>
                        <div className="text-gray-500">Completed</div>
                      </div>
                      <div>
                        <div className="font-semibold text-indigo-600">
                          Intermediate
                        </div>
                        <div className="text-gray-500">In Progress</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-400">
                          Advanced
                        </div>
                        <div className="text-gray-500">Upcoming</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-indigo-600 flex items-center">
                      <Star
                        className="text-yellow-400 mr-1"
                        size={24}
                        fill="currentColor"
                      />{' '}
                      {student?.xp ?? 0}
                    </div>
                    <div className="text-xs">XP Points</div>
                  </div>
                </div>
              </div>

              {/* Current Courses */}
              <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Current Courses
                  </h2>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {student?.currentCourses?.map((course, i) => (
                    <CourseCard key={i} course={course} />
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Recent Activity
                  </h2>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {student?.recentActivities?.map((activity, i) => (
                    <div key={i} className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-3">
                        <Terminal size={18} />
                      </div>
                      <div className="flex-grow">
                        <div className="text-sm">
                          <span className="font-medium text-gray-800">
                            {activity.action}:
                          </span>{' '}
                          <span className="text-gray-600">{activity.name}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'skills' && (
            <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                My Skills & Languages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {student.languages.map((lang, i) => (
                    <SkillBar key={i} name={lang.name} level={lang.level} />
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-4 text-center">
                    <Code size={48} className="mx-auto mb-2 text-indigo-600" />
                    <p className="text-gray-600 text-sm max-w-xs">
                      You're strongest in JavaScript and CSS. Consider focusing
                      on improving your Python skills next.
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition">
                    Take Skills Assessment
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                My Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.achievements.map((ach, i) => (
                  <div
                    key={i}
                    className="flex items-center p-4 border border-gray-100 rounded-lg hover:border-indigo-200 transition"
                  >
                    <div className=" bg-indigo-100 text-indigo-600 rounded-lg mr-4">
                    <img
                            src={`${baseUrlMedia}${ach.image}`}
                            alt="student photo"
                            className="h-10 w-10 object-cover"
                          />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {ach.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Unlocked on May 2nd, 2025
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <h3 className="font-medium text-gray-700 mb-2">
                  Next Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                  <div className="flex items-center p-4 border border-gray-100 rounded-lg">
                    <div className="p-3 bg-gray-100 text-gray-400 rounded-lg mr-4">
                      <Zap size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">
                        10 Projects Completed
                      </div>
                      <div className="text-xs text-gray-500">
                        4/10 projects completed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 border border-gray-100 rounded-lg">
                    <div className="p-3 bg-gray-100 text-gray-400 rounded-lg mr-4">
                      <Github size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">
                        Open Source Contributor
                      </div>
                      <div className="text-xs text-gray-500">
                        Contribute to an open source project
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                My Learning Journey
              </h2>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">Current Courses</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">
                    Browse Courses
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {student.myCoures.map((course, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-boxdark p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-3 rounded-lg mr-4 text-indigo-600">
                          <Book size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {course.name}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>Last Seen: {course.lastSeen}</span>
                            <span className="mx-2">•</span>
                            <span>{course.progress}% complete</span>
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
                        Continue
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Recommended Next Steps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200 flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-lg mr-4 text-yellow-600">
                      <Terminal size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        AWS Cloud Practitioner
                      </div>
                      <div className="text-xs text-gray-500">
                        Perfect complement to your current skills
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200 flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg mr-4 text-green-600">
                      <Cpu size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        TypeScript Fundamentals
                      </div>
                      <div className="text-xs text-gray-500">
                        Strongly typed JavaScript for better code
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Motivation Quote */}
      <div className="mt-6 p-4 bg-white dark:bg-boxdark rounded-lg border border-dashed border-indigo-200 text-center">
        <div className="text-sm text-gray-600 italic">
          "{student.motivation}"
        </div>
      </div>
    </>
  );
};

export default StudentProfilePage;
