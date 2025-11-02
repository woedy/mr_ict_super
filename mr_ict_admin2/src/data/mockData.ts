export type School = {
  id: string
  name: string
  type: 'JHS' | 'SHS' | 'University' | 'Technical'
  location: string
  region: string
  district: string
  status: 'active' | 'inactive' | 'pending'
  enrolledStudents: number
  activeInstructors: number
  coursesOffered: number
  totalXP: number
  joinedDate: string
  contactEmail: string
  contactPhone: string
  principal: string
  logoUrl: string
}

export type User = {
  id: string
  name: string
  email: string
  role: 'student' | 'admin' | 'instructor'
  school: string
  schoolId: string
  location: string
  joinedDate: string
  xp: number
  coursesEnrolled: number
  status: 'active' | 'inactive' | 'suspended'
  avatarUrl: string
}

export type Lesson = {
  id: string
  title: string
  duration: string
  type: 'video' | 'project' | 'quiz' | 'reading'
  status: 'draft' | 'published'
  views: number
  avgRating: number
}

export type Module = {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  order: number
}

export type Course = {
  id: string
  title: string
  subtitle: string
  description: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  track: 'Web' | 'Data' | 'Design'
  status: 'draft' | 'published' | 'archived'
  enrollments: number
  completionRate: number
  xp: number
  hours: number
  createdBy: string
  createdDate: string
  lastUpdated: string
  modules: Module[]
  instructors: string[]
  tags: string[]
  thumbnail: string
}

export type Challenge = {
  id: string
  title: string
  courseId: string
  difficulty: 'Starter' | 'Core' | 'Stretch'
  submissions: number
  avgScore: number
  status: 'active' | 'inactive'
}

export type CommunityPost = {
  id: string
  title: string
  author: string
  courseId: string
  replies: number
  views: number
  lastActivity: string
  status: 'active' | 'flagged' | 'archived'
  tags: string[]
}

export type Recording = {
  id: string
  title: string
  courseId: string
  duration: string
  status: 'recording' | 'processing' | 'published'
  createdDate: string
}

export const schools: School[] = [
  {
    id: 's1',
    name: 'Wesley Grammar SHS',
    type: 'SHS',
    location: 'Cape Coast',
    region: 'Central Region',
    district: 'Cape Coast Metropolitan',
    status: 'active',
    enrolledStudents: 245,
    activeInstructors: 12,
    coursesOffered: 8,
    totalXP: 1245600,
    joinedDate: '2024-06-15',
    contactEmail: 'info@wesleygrammar.edu.gh',
    contactPhone: '+233 24 123 4567',
    principal: 'Dr. Kwabena Mensah',
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 's2',
    name: 'Achimota School',
    type: 'SHS',
    location: 'Accra',
    region: 'Greater Accra Region',
    district: 'Accra Metropolitan',
    status: 'active',
    enrolledStudents: 520,
    activeInstructors: 28,
    coursesOffered: 12,
    totalXP: 2856400,
    joinedDate: '2024-05-10',
    contactEmail: 'admin@achimota.edu.gh',
    contactPhone: '+233 30 240 1234',
    principal: 'Mrs. Abena Osei',
    logoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 's3',
    name: 'Kumasi Technical Institute',
    type: 'Technical',
    location: 'Kumasi',
    region: 'Ashanti Region',
    district: 'Kumasi Metropolitan',
    status: 'active',
    enrolledStudents: 380,
    activeInstructors: 18,
    coursesOffered: 10,
    totalXP: 1678900,
    joinedDate: '2024-07-20',
    contactEmail: 'info@kti.edu.gh',
    contactPhone: '+233 32 202 5678',
    principal: 'Mr. Yaw Boateng',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 's4',
    name: 'Tamale JHS',
    type: 'JHS',
    location: 'Tamale',
    region: 'Northern Region',
    district: 'Tamale Metropolitan',
    status: 'active',
    enrolledStudents: 180,
    activeInstructors: 8,
    coursesOffered: 5,
    totalXP: 456200,
    joinedDate: '2024-08-05',
    contactEmail: 'contact@tamalejhs.edu.gh',
    contactPhone: '+233 37 202 3456',
    principal: 'Mr. Abdul Rahman',
    logoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 's5',
    name: 'University of Ghana',
    type: 'University',
    location: 'Legon',
    region: 'Greater Accra Region',
    district: 'Accra Metropolitan',
    status: 'active',
    enrolledStudents: 1250,
    activeInstructors: 45,
    coursesOffered: 18,
    totalXP: 5678900,
    joinedDate: '2024-04-01',
    contactEmail: 'ict@ug.edu.gh',
    contactPhone: '+233 30 250 1234',
    principal: 'Prof. Nana Ama Browne',
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 's6',
    name: 'St. Augustine College',
    type: 'SHS',
    location: 'Cape Coast',
    region: 'Central Region',
    district: 'Cape Coast Metropolitan',
    status: 'pending',
    enrolledStudents: 0,
    activeInstructors: 0,
    coursesOffered: 0,
    totalXP: 0,
    joinedDate: '2024-10-28',
    contactEmail: 'info@staugustine.edu.gh',
    contactPhone: '+233 24 567 8901',
    principal: 'Rev. Fr. Emmanuel Kojo',
    logoUrl: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=200&q=80',
  },
]

export const users: User[] = [
  {
    id: 'u1',
    name: 'Kwame Mensah',
    email: 'kwame@example.com',
    role: 'student',
    school: 'Wesley Grammar SHS',
    schoolId: 's1',
    location: 'Cape Coast, Ghana',
    joinedDate: '2024-09-15',
    xp: 18250,
    coursesEnrolled: 3,
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u2',
    name: 'Ama Osei',
    email: 'ama@example.com',
    role: 'student',
    school: 'Achimota School',
    schoolId: 's2',
    location: 'Accra, Ghana',
    joinedDate: '2024-10-01',
    xp: 12400,
    coursesEnrolled: 2,
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u3',
    name: 'Kofi Asante',
    email: 'kofi@example.com',
    role: 'instructor',
    school: 'Mr ICT Platform',
    schoolId: 's3',
    location: 'Kumasi, Ghana',
    joinedDate: '2024-08-10',
    xp: 45600,
    coursesEnrolled: 8,
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=200&q=80',
  },
]

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Creative Web Foundations',
    subtitle: 'Craft colourful, accessible experiences for learners across Ghana and Africa.',
    description: 'Blend HTML, CSS, and inclusive design to build experiences tuned for West African devices, data realities, and students. Learn responsive design, accessibility, and cultural relevance in web development.',
    level: 'Beginner',
    track: 'Web',
    status: 'published',
    enrollments: 1245,
    completionRate: 68,
    xp: 2400,
    hours: 18,
    createdBy: 'Kofi Asante',
    createdDate: '2024-07-15',
    lastUpdated: '2024-10-28',
    instructors: ['Kofi Asante', 'Yaw Boateng'],
    tags: ['HTML', 'CSS', 'Responsive Design', 'Accessibility'],
    thumbnail: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
    modules: [
      {
        id: 'm1',
        title: 'Setting the Stage',
        description: 'Introduction to web development and the Mr ICT platform',
        order: 1,
        lessons: [
          { id: 'l1', title: 'Welcome to Creative Web Foundations', duration: '7:40', type: 'video', status: 'published', views: 1245, avgRating: 4.8 },
          { id: 'l2', title: 'Your First HTML Page', duration: '12:15', type: 'video', status: 'published', views: 1180, avgRating: 4.7 },
          { id: 'l3', title: 'Practice: Build Your Profile Page', duration: '30:00', type: 'project', status: 'published', views: 980, avgRating: 4.6 },
        ],
      },
      {
        id: 'm2',
        title: 'Styling with CSS',
        description: 'Learn to style web pages with modern CSS techniques',
        order: 2,
        lessons: [
          { id: 'l4', title: 'CSS Fundamentals', duration: '15:20', type: 'video', status: 'published', views: 920, avgRating: 4.7 },
          { id: 'l5', title: 'Colour Palettes Inspired by Adinkra', duration: '11:24', type: 'video', status: 'published', views: 850, avgRating: 4.9 },
          { id: 'l6', title: 'Responsive Grid Layouts', duration: '18:30', type: 'video', status: 'published', views: 780, avgRating: 4.5 },
        ],
      },
      {
        id: 'm3',
        title: 'Final Project',
        description: 'Build a complete website for a local organization',
        order: 3,
        lessons: [
          { id: 'l7', title: 'Project Brief', duration: '8:00', type: 'reading', status: 'published', views: 650, avgRating: 4.4 },
          { id: 'l8', title: 'Build Your Community Website', duration: '120:00', type: 'project', status: 'published', views: 520, avgRating: 4.8 },
          { id: 'l9', title: 'Final Assessment', duration: '45:00', type: 'quiz', status: 'published', views: 480, avgRating: 4.3 },
        ],
      },
    ],
  },
  {
    id: 'c2',
    title: 'Data Storytelling with African Open Data',
    subtitle: 'Turn raw statistics into narratives communities can trust.',
    description: 'Learn to analyse, visualise, and communicate public data sets about health, climate, and education using Python. Master data cleaning, visualization, and storytelling techniques.',
    level: 'Intermediate',
    track: 'Data',
    status: 'published',
    enrollments: 856,
    completionRate: 54,
    xp: 3200,
    hours: 22,
    createdBy: 'Naana Kusi',
    createdDate: '2024-08-20',
    lastUpdated: '2024-10-30',
    instructors: ['Naana Kusi'],
    tags: ['Python', 'Data Analysis', 'Visualization', 'Pandas'],
    thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    modules: [
      {
        id: 'm4',
        title: 'Data Fundamentals',
        description: 'Understanding data types, sources, and ethics',
        order: 1,
        lessons: [
          { id: 'l10', title: 'The Story Behind the Numbers', duration: '9:38', type: 'video', status: 'published', views: 856, avgRating: 4.6 },
          { id: 'l11', title: 'Python Refresh with African Postal Datasets', duration: '18:40', type: 'project', status: 'published', views: 720, avgRating: 4.5 },
        ],
      },
      {
        id: 'm5',
        title: 'Data Visualization',
        description: 'Create compelling charts and graphs',
        order: 2,
        lessons: [
          { id: 'l12', title: 'Introduction to Matplotlib', duration: '14:20', type: 'video', status: 'published', views: 650, avgRating: 4.4 },
          { id: 'l13', title: 'Interactive Dashboards', duration: '22:15', type: 'video', status: 'published', views: 580, avgRating: 4.7 },
        ],
      },
    ],
  },
  {
    id: 'c3',
    title: 'Immersive Media Studio',
    subtitle: 'Blend video, code, and storytelling to teach ICT through interactive experiences.',
    description: 'Produce interactive video experiences that pair timeline-based code editing with locally resonant storytelling. Learn video production, motion design, and interactive web components.',
    level: 'Advanced',
    track: 'Design',
    status: 'draft',
    enrollments: 0,
    completionRate: 0,
    xp: 4100,
    hours: 26,
    createdBy: 'Abena Owusu',
    createdDate: '2024-10-15',
    lastUpdated: '2024-10-31',
    instructors: ['Abena Owusu', 'Kwame Mensah'],
    tags: ['Video Production', 'Motion Design', 'Web Components', 'Storytelling'],
    thumbnail: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&q=80',
    modules: [
      {
        id: 'm6',
        title: 'Video Production Basics',
        description: 'Learn the fundamentals of video recording and editing',
        order: 1,
        lessons: [
          { id: 'l14', title: 'Camera Setup and Lighting', duration: '16:00', type: 'video', status: 'draft', views: 0, avgRating: 0 },
          { id: 'l15', title: 'Audio Recording Best Practices', duration: '12:30', type: 'video', status: 'draft', views: 0, avgRating: 0 },
        ],
      },
    ],
  },
]

export const challenges: Challenge[] = [
  {
    id: 'ch1',
    title: 'Design a School Landing Page Grid',
    courseId: 'c1',
    difficulty: 'Core',
    submissions: 342,
    avgScore: 78,
    status: 'active',
  },
  {
    id: 'ch2',
    title: 'Chart Rural Connectivity Progress',
    courseId: 'c2',
    difficulty: 'Stretch',
    submissions: 156,
    avgScore: 65,
    status: 'active',
  },
]

export const communityPosts: CommunityPost[] = [
  {
    id: 'p1',
    title: 'How do you handle offline-first design in rural areas?',
    author: 'Kwame Mensah',
    courseId: 'c1',
    replies: 12,
    views: 245,
    lastActivity: '2 hours ago',
    status: 'active',
    tags: ['offline', 'design', 'accessibility'],
  },
  {
    id: 'p2',
    title: 'Best practices for data visualization with limited bandwidth',
    author: 'Ama Osei',
    courseId: 'c2',
    replies: 8,
    views: 189,
    lastActivity: '5 hours ago',
    status: 'active',
    tags: ['data', 'visualization', 'performance'],
  },
]

export const recordings: Recording[] = [
  {
    id: 'r1',
    title: 'Welcome to Creative Web Foundations',
    courseId: 'c1',
    duration: '7:40',
    status: 'published',
    createdDate: '2024-10-20',
  },
  {
    id: 'r2',
    title: 'Python Refresh with African Postal Datasets',
    courseId: 'c2',
    duration: '18:40',
    status: 'processing',
    createdDate: '2024-10-30',
  },
]

export const platformStats = {
  totalUsers: 3542,
  activeUsers: 2876,
  totalCourses: 12,
  publishedCourses: 9,
  totalEnrollments: 8934,
  avgCompletionRate: 62,
  totalChallenges: 45,
  totalPosts: 1234,
}
