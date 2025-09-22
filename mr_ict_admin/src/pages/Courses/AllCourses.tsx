// src/pages/AllCoursesPage.jsx (or similar)

import React, { useState } from 'react';
import { FiSearch, FiStar, FiClock, FiCode, FiAward, FiBookOpen } from 'react-icons/fi'; // Feather icons for a clean look

const coursesData = [
  {
    id: 'course_html',
    title: 'Mastering HTML: Building Web Foundations',
    description: 'Learn the fundamental building blocks of the web. Structure content with semantic HTML5.',
    level: 'Beginner',
    duration: '4 Weeks',
    lessons: 12,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1549692520-cb2f08a47346?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Placeholder for course image
    instructor: 'Aisha Nartey',
    tags: ['Frontend', 'Web Development', 'Markup']
  },
  {
    id: 'course_css',
    title: 'Styling the Web: Deep Dive into CSS',
    description: 'Transform plain HTML into beautiful, responsive web pages using modern CSS techniques.',
    level: 'Beginner',
    duration: '6 Weeks',
    lessons: 18,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1547658793-272e7d7a8d8e?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    instructor: 'Kwame Owusu',
    tags: ['Frontend', 'Web Design', 'Styling']
  },
  {
    id: 'course_js',
    title: 'Interactive Web: JavaScript Fundamentals',
    description: 'Bring your websites to life! Learn programming concepts and DOM manipulation with JavaScript.',
    level: 'Intermediate',
    duration: '8 Weeks',
    lessons: 25,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1550439062-cd037996c5e2?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    instructor: 'Kojo Mensah',
    tags: ['Frontend', 'Programming', 'Logic']
  },
  {
    id: 'course_react',
    title: 'Building Dynamic UIs with React',
    description: 'Develop powerful single-page applications using React.js, hooks, and component-based architecture.',
    level: 'Advanced',
    duration: '10 Weeks',
    lessons: 30,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1618391807759-4d6b3a0b5a32?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    instructor: 'Adwoa Boateng',
    tags: ['Frontend', 'Framework', 'SPA']
  },
  {
    id: 'course_python',
    title: 'Python for Beginners: Data & Automation',
    description: 'An easy-to-learn language for web development, data analysis, and scripting.',
    level: 'Beginner',
    duration: '7 Weeks',
    lessons: 20,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1507721999472-850f0edf0c8b?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    instructor: 'Yaw Acheampong',
    tags: ['Backend', 'Scripting', 'Data Science']
  },
  {
    id: 'course_git',
    title: 'Version Control with Git & GitHub',
    description: 'Master collaborative coding and project management using Git and GitHub.',
    level: 'Intermediate',
    duration: '3 Weeks',
    lessons: 9,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1629905206338-724d9834164b?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    instructor: 'Nana Ama Prempeh',
    tags: ['Tools', 'Collaboration', 'DevOps']
  }
];

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const tags = ['All', 'Frontend', 'Backend', 'Web Development', 'Web Design', 'Programming', 'Logic', 'Framework', 'SPA', 'Scripting', 'Data Science', 'Tools', 'Collaboration', 'DevOps', 'Markup', 'Styling'];

const AllCoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('rating'); // Default sort by rating

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesTag = selectedTag === 'All' || course.tags.includes(selectedTag);
    return matchesSearch && matchesLevel && matchesTag;
  }).sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating; // Descending
    }
    if (sortBy === 'duration') {
      // Simple sorting for duration (e.g., "4 Weeks" vs "6 Weeks")
      const durationA = parseInt(a.duration.split(' ')[0]);
      const durationB = parseInt(b.duration.split(' ')[0]);
      return durationA - durationB; // Ascending
    }
    if (sortBy === 'lessons') {
      return b.lessons - a.lessons; // Descending
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-10 font-sans">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4 animate-fade-in-down">
          Explore Our <span className="text-purple-600">Coding Journeys</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Dive into a diverse range of courses designed to equip you with the skills for the future of tech in Ghana and beyond.
        </p>
      </div>

      {/* Search & Filters Section */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl mb-12 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <label htmlFor="course-search" className="block text-gray-700 text-sm font-medium mb-2">Search Courses</label>
            <input
              type="text"
              id="course-search"
              placeholder="e.g., JavaScript, Web Design, Frontend..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl mt-4" />
          </div>

          {/* Level Filter */}
          <div>
            <label htmlFor="level-filter" className="block text-gray-700 text-sm font-medium mb-2">Filter by Level</label>
            <div className="relative">
              <select
                id="level-filter"
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl appearance-none focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-gray-800"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <FiCode className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
            </div>
          </div>

          {/* Tag Filter */}
          <div>
            <label htmlFor="tag-filter" className="block text-gray-700 text-sm font-medium mb-2">Filter by Category</label>
            <div className="relative">
              <select
                id="tag-filter"
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl appearance-none focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-gray-800"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <FiBookOpen className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
            </div>
          </div>

          {/* Sort By */}
          <div className="md:col-span-1">
            <label htmlFor="sort-by" className="block text-gray-700 text-sm font-medium mb-2">Sort By</label>
            <div className="relative">
              <select
                id="sort-by"
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl appearance-none focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-gray-800"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Popularity (Rating)</option>
                <option value="duration">Shortest Duration</option>
                <option value="lessons">Most Lessons</option>
              </select>
              <FiAward className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Courses List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
              onClick={() => alert(`Navigating to ${course.title} course details!`)}
            >
              <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {course.level}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <FiClock className="mr-2 text-indigo-500" />
                  <span>{course.duration}</span>
                  <span className="mx-2">|</span>
                  <FiBookOpen className="mr-2 text-teal-500" />
                  <span>{course.lessons} Lessons</span>
                </div>

                <div className="flex items-center text-yellow-500 mb-4">
                  <FiStar className="mr-1" />
                  <span className="font-semibold text-gray-800">{course.rating}</span>
                  <span className="text-gray-500 text-xs ml-1">({(Math.random() * 500 + 100).toFixed(0)} reviews)</span> {/* Random reviews for demo */}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-gray-600 text-sm">
                  <span>Instructor: <span className="font-semibold text-gray-800">{course.instructor}</span></span>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-300 ease-in-out transform hover:scale-105">
                    Start Course
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 text-xl bg-white rounded-xl shadow-md">
            <p className="mb-4">
              <FiSearch className="inline-block text-4xl mb-2" />
            </p>
            <p>No courses found matching your criteria. Try adjusting your search or filters!</p>
          </div>
        )}
      </div>

      {/* Optional: Call to Action/Footer element */}
      <div className="mt-16 text-center text-gray-600">
        <p className="text-lg">Can't find what you're looking for?</p>
        <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
          Suggest a Course Topic
        </button>
      </div>
    </div>
  );
};

export default AllCoursesPage;