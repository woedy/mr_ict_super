export type Lesson = {
  id: string
  title: string
  duration: string
  type: 'video' | 'project' | 'quiz' | 'reflection'
  summary: string
}

export type Module = {
  id: string
  title: string
  lessons: Lesson[]
}

export type Course = {
  id: string
  title: string
  subtitle: string
  summary: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  track: 'Web' | 'Data' | 'Design'
  xp: number
  hours: number
  color: string
  heroImage: string
  tags: string[]
  spotlight: string
  modules: Module[]
  instructors: Array<{
    name: string
    avatar: string
    title: string
  }>
}

export type Assessment = {
  id: string
  title: string
  courseId: string
  type: 'Checkpoint' | 'Capstone' | 'Sprint Challenge'
  duration: string
  attemptsLeft: number
  dueDate: string
  xp: number
  focus: string
}

export type Announcement = {
  id: string
  title: string
  body: string
  date: string
  icon: string
  link?: string
}

export type CommunityThread = {
  id: string
  title: string
  author: string
  avatar: string
  courseId: string
  replies: number
  lastActivity: string
  excerpt: string
  tags: string[]
}

export type PracticeChallenge = {
  id: string
  title: string
  courseId: string
  difficulty: 'Starter' | 'Core' | 'Stretch'
  estimatedMinutes: number
  description: string
}

export type StudentProfile = {
  id: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  avatarUrl: string
  location: string
  school: string
  track: string
  xp: number
  streak: number
  badges: number
  language: string
  availability: string
  learningGoals: string
  interests: string[]
  accessibility: string[]
  preferredMode: 'online' | 'offline' | 'hybrid'
}

export const demoStudentProfile: StudentProfile = {
  id: 'student-kwame',
  fullName: 'Kwame Mensah',
  firstName: 'Kwame',
  lastName: 'Mensah',
  email: 'kwame@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  location: 'Cape Coast, Ghana',
  school: 'Wesley Grammar Senior High',
  track: 'Web',
  xp: 18250,
  streak: 12,
  badges: 8,
  language: 'English',
  availability: 'Evenings & Weekends',
  learningGoals: 'Build polished portfolio projects and prepare for NSS placements.',
  interests: ['Front-end design', 'Inclusive digital literacy', 'Afrofuturist storytelling'],
  accessibility: ['Live captions', 'Offline downloads'],
  preferredMode: 'hybrid',
}

export const courses: Course[] = [
  {
    id: 'foundations-web',
    title: 'Creative Web Foundations',
    subtitle: 'Craft colourful, accessible experiences for Ghanaian learners.',
    summary:
      'Blend HTML, CSS, and inclusive design to build experiences tuned for West African devices, data realities, and students.',
    level: 'Beginner',
    track: 'Web',
    xp: 2400,
    hours: 18,
    color: 'from-primary-400 via-accent-400 to-primary-600',
    heroImage: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
    tags: ['HTML', 'CSS', 'Inclusive Design'],
    spotlight: 'Design for low bandwidth, readability in bright classrooms, and cultural relevance.',
    modules: [
      {
        id: 'module-1',
        title: 'Setting the Stage',
        lessons: [
          {
            id: 'welcome',
            title: 'Welcome to Creative Web Foundations',
            duration: '7:40',
            type: 'video',
            summary: 'Meet your mentors and peek at showcase projects from Ghanaian ICT clubs.',
          },
          {
            id: 'devices',
            title: 'Designing for Shared Devices',
            duration: '10:12',
            type: 'video',
            summary: 'Strategies for learning labs where keyboards are shared and data is precious.',
          },
          {
            id: 'html-forms',
            title: 'Inclusive HTML Forms',
            duration: '15:06',
            type: 'project',
            summary: 'Build a community noticeboard form that supports keyboard-only navigation.',
          },
        ],
      },
      {
        id: 'module-2',
        title: 'Colour & Typography for the Tropics',
        lessons: [
          {
            id: 'colour-palettes',
            title: 'Colour Palettes Inspired by Adinkra',
            duration: '11:24',
            type: 'video',
            summary: 'Use Ghanaian symbolism to influence accessible colour systems.',
          },
          {
            id: 'responsive-grid',
            title: 'Responsive Grids for Mobile-First Schools',
            duration: '14:32',
            type: 'project',
            summary: 'Prototype a responsive homepage for a community ICT hub.',
          },
        ],
      },
    ],
    instructors: [
      {
        name: 'Esi Quansah',
        avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
        title: 'Design Mentor · Accra',
      },
      {
        name: 'Yaw Boateng',
        avatar: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=200&q=80',
        title: 'Front-end Coach · Kumasi',
      },
    ],
  },
  {
    id: 'data-storytelling',
    title: 'Data Storytelling with Ghanaian Open Data',
    subtitle: 'Turn raw statistics into narratives communities can trust.',
    summary:
      'Learn to analyse, visualise, and communicate public data sets about health, climate, and education using Python.',
    level: 'Intermediate',
    track: 'Data',
    xp: 3200,
    hours: 22,
    color: 'from-emerald-400 via-primary-500 to-emerald-600',
    heroImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Python', 'DataViz', 'Civic Tech'],
    spotlight: 'Collaborate with district assemblies to translate data into community action.',
    modules: [
      {
        id: 'module-1',
        title: 'Responsible Data Foundations',
        lessons: [
          {
            id: 'context',
            title: 'The Story Behind the Numbers',
            duration: '9:38',
            type: 'video',
            summary: 'Understand bias, cultural nuance, and storytelling ethics.',
          },
          {
            id: 'python-refresh',
            title: 'Python Refresh with GhanaPost Datasets',
            duration: '18:40',
            type: 'project',
            summary: 'Use notebooks to clean and join postal region data sets.',
          },
          {
            id: 'community-brief',
            title: 'Community Brief Sprint',
            duration: '25:10',
            type: 'reflection',
            summary: 'Present insights to a mock PTA and gather feedback.',
          },
        ],
      },
    ],
    instructors: [
      {
        name: 'Naana Kusi',
        avatar: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
        title: 'Data Journalist · Cape Coast',
      },
    ],
  },
  {
    id: 'immersive-media',
    title: 'Immersive Media Studio',
    subtitle: 'Blend video, code, and storytelling to teach ICT the Scrimba way.',
    summary:
      'Produce interactive video experiences that pair timeline-based code editing with locally resonant storytelling.',
    level: 'Advanced',
    track: 'Design',
    xp: 4100,
    hours: 26,
    color: 'from-purple-500 via-accent-400 to-rose-500',
    heroImage: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Motion Design', 'Video Production', 'Web Components'],
    spotlight: 'Prototype collaborative lessons for ICT clubs and community hubs.',
    modules: [
      {
        id: 'module-1',
        title: 'Interactive Lesson Architecture',
        lessons: [
          {
            id: 'story-structure',
            title: 'Story Structure for Interactive Lessons',
            duration: '12:12',
            type: 'video',
            summary: 'Craft arcs that keep students coding along with the narrative.',
          },
          {
            id: 'timeline-tools',
            title: 'Timeline Editing Workflows',
            duration: '19:47',
            type: 'project',
            summary: 'Build a multi-track timeline using open-source video tooling.',
          },
          {
            id: 'accessibility-pass',
            title: 'Accessibility QA Walkthrough',
            duration: '16:05',
            type: 'quiz',
            summary: 'Evaluate keyboard shortcuts and caption timing for your prototype.',
          },
        ],
      },
    ],
    instructors: [
      {
        name: 'Abena Owusu',
        avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80',
        title: 'Interactive Producer · Tamale',
      },
    ],
  },
]

export const enrollments = [
  {
    courseId: 'foundations-web',
    progress: 42,
    lastLessonId: 'html-forms',
  },
  {
    courseId: 'data-storytelling',
    progress: 18,
    lastLessonId: 'python-refresh',
  },
]

export const assessments: Assessment[] = [
  {
    id: 'checkpoint-web-1',
    title: 'Web Foundations Sprint Checkpoint',
    courseId: 'foundations-web',
    type: 'Checkpoint',
    duration: '35 min',
    attemptsLeft: 2,
    dueDate: 'Due Sunday · 6:00 PM',
    xp: 350,
    focus: 'Semantic HTML, forms, and inclusive navigation patterns.',
  },
  {
    id: 'capstone-data',
    title: 'Data Storytelling Capstone Brief',
    courseId: 'data-storytelling',
    type: 'Capstone',
    duration: '90 min',
    attemptsLeft: 1,
    dueDate: 'Opens Nov 12',
    xp: 900,
    focus: 'Craft a community-ready briefing with charts and narration.',
  },
]

export const announcements: Announcement[] = [
  {
    id: 'announce-1',
    title: 'Campus Innovation Fair Submissions',
    body: 'Submit your interactive demo by 15 Nov to qualify for the Accra finals showcase.',
    date: '2h ago',
    icon: '🎤',
    link: '#',
  },
  {
    id: 'announce-2',
    title: 'New Offline Packs Available',
    body: 'Download updated lesson bundles for community labs with limited connectivity.',
    date: '1 day ago',
    icon: '📦',
  },
]

export const communityThreads: CommunityThread[] = [
  {
    id: 'thread-1',
    title: 'How are you organising peer review in your ICT club?',
    author: 'Afi Baidoo',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80',
    courseId: 'foundations-web',
    replies: 14,
    lastActivity: '25 mins ago',
    excerpt: 'We started a Friday-night design review circle at the Cape Coast hub — sharing templates here!',
    tags: ['Clubs', 'Teaching Tips'],
  },
  {
    id: 'thread-2',
    title: 'Visualising BECE results for community forums',
    author: 'Kwesi Aning',
    avatar: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80',
    courseId: 'data-storytelling',
    replies: 9,
    lastActivity: '1 hr ago',
    excerpt: 'Looking for inspiration to communicate data to non-technical parents. Here is my draft dashboard.',
    tags: ['DataViz', 'Community'],
  },
]

export const practiceChallenges: PracticeChallenge[] = [
  {
    id: 'challenge-grid',
    title: 'Design a School Landing Page Grid',
    courseId: 'foundations-web',
    difficulty: 'Core',
    estimatedMinutes: 40,
    description: 'Use CSS grid and Ghanaian inspired palettes to highlight school achievements.',
  },
  {
    id: 'challenge-dataviz',
    title: 'Chart Rural Connectivity Progress',
    courseId: 'data-storytelling',
    difficulty: 'Stretch',
    estimatedMinutes: 55,
    description: 'Build a multi-series chart that works offline and exports to PNG for PTA meetings.',
  },
]

export const dailyFocus = {
  date: 'Friday, 31 October',
  win: 'Shipped the Adinkra-inspired dashboard layout in the Web Foundations studio. ✨',
  intention: 'Complete the accessibility QA for your community noticeboard project.',
  encouragement: 'Remember, every inclusive detail keeps more Ghanaian learners engaged.',
}

export const upcomingSessions = [
  {
    id: 'session-1',
    title: 'Live Studio: Storyboarding with Low-bandwidth in Mind',
    mentor: 'Hosted by Abena',
    schedule: 'Today · 5:30 PM GMT',
  },
  {
    id: 'session-2',
    title: 'Study Circle: Python Visualisations with Flourish',
    mentor: 'Led by Naana',
    schedule: 'Sat · 10:00 AM GMT',
  },
]

export const journeyTimeline = [
  {
    id: 'moment-1',
    label: 'Signed up',
    description: 'Joined Mr ICT Student to explore interactive video coding for Ghanaian classrooms.',
    timestamp: '4 weeks ago',
  },
  {
    id: 'moment-2',
    label: 'Earned Inclusive Web Badge',
    description: 'Completed the accessible noticeboard project and peer review.',
    timestamp: '12 days ago',
  },
  {
    id: 'moment-3',
    label: 'First Community Workshop',
    description: 'Facilitated a Saturday ICT club session using the offline sandbox.',
    timestamp: '5 days ago',
  },
]
