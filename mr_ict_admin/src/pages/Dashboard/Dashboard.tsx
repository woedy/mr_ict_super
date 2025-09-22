// src/pages/AdminDashboardPage.jsx (or similar)

import React, { useEffect, useState } from 'react';
import {
  FiUsers, FiBookOpen, FiZap, FiCheckCircle, FiClock, FiPlusCircle,
  FiArrowRight, FiActivity, FiGlobe, FiMapPin, FiMail,
  FiFilter,
  FiPlayCircle,
  FiUserPlus,
  FiAward
} from 'react-icons/fi'; // Feather icons for clean design
import { baseUrl, userID, userToken } from '../../constants';


  // Dummy Data for Dashboard Widgets
  const statsss = {
    totalStudents: 1250,
    activeCourses: 8,
    totalLessons: 120,
    totalChallenges: 55,
    newStudentsToday: 15,
    coursesCompletedToday: 7,
  };

  const recentActivities = [
    { type: 'student', user: 'Akua Mansah', action: 'completed', item: 'HTML Basics Course', time: '2 mins ago' },
    { type: 'admin', user: 'You', action: 'added', item: 'New JavaScript Challenge', time: '1 hour ago' },
    { type: 'student', user: 'Kofi Boahen', action: 'started', item: 'CSS Styling Course', time: '3 hours ago' },
    { type: 'student', user: 'Ama Serwaa', action: 'finished lesson', item: 'Forms & User Input', time: 'yesterday' },
    { type: 'admin', user: 'Admin Team', action: 'updated', item: 'Python for Beginners Course', time: '2 days ago' },
  ];

  const popularCourses = [
    { id: 'course_html', title: 'Mastering HTML: Building Web Foundations', students: 850 },
    { id: 'course_js', title: 'Interactive Web: JavaScript Fundamentals', students: 620 },
    { id: 'course_python', title: 'Python for Beginners: Data & Automation', students: 480 },
  ];

  const studentDemographics = {
    totalRegions: 8, // Number of regions where students are enrolled
    topRegions: [
      { name: 'Greater Accra', students: 450 },
      { name: 'Ashanti', students: 300 },
      { name: 'Central', students: 180 },
    ],
  };




const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});





    useEffect(() => {
      console.log('####################################');
   
      const fetchData = async () => {
          setLoading(true);
          try {
              const response = await fetch( baseUrl + `api/homepage/admin-dashboard/?user_id=${userID}`,  {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${userToken}`,
                  },
                } );
              
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
  
              const data = await response.json();
              setStats(data.data.stats);
          } catch (error) {
              console.error('Error fetching data:', error);
          } finally {
              setLoading(false);
          }
      };
  
      fetchData();
  }, []);
  
  
  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
          Welcome, <span className="text-blue-600">Admin!</span>
        </h1>
        <button
          className="bg-green hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md flex items-center transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => alert('Quick Add functionality!')}
        >
          <FiPlusCircle className="mr-2 text-xl" />
          Quick Add
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6 flex items-center justify-between transition duration-300 hover:shadow-xl">
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <h2 className="text-3xl font-bold text-gray-900">{stats?.totalStudents}</h2>
          </div>
          <FiUsers className="text-5xl text-blue-500 opacity-20" />
        </div>

        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6 flex items-center justify-between transition duration-300 hover:shadow-xl">
          <div>
            <p className="text-sm text-gray-500">Active Courses</p>
            <h2 className="text-3xl font-bold text-gray-900">{stats.activeCourses}</h2>
          </div>
          <FiBookOpen className="text-5xl text-purple-500 opacity-20" />
        </div>

        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6 flex items-center justify-between transition duration-300 hover:shadow-xl">
          <div>
            <p className="text-sm text-gray-500">Total Lessons</p>
            <h2 className="text-3xl font-bold text-gray-900">{stats?.totalLessons}</h2>
          </div>
          <FiPlayCircle className="text-5xl text-green-500 opacity-20" />
        </div>

        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6 flex items-center justify-between transition duration-300 hover:shadow-xl">
          <div>
            <p className="text-sm text-gray-500">Total Challenges</p>
            <h2 className="text-3xl font-bold text-gray-900">{stats?.totalChallenges}</h2>
          </div>
          <FiZap className="text-5xl text-orange-500 opacity-20" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FiActivity className="mr-2 text-indigo-500" /> Recent Platform Activity
          </h3>
          <ul className="divide-y divide-gray-100">
            {recentActivities.map((activity, index) => (
              <li key={index} className="py-3 flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  ${activity.type === 'student' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                  {activity.type === 'student' ? <FiUsers size={18} /> : <FiGlobe size={18} />}
                </div>
                <div className="ml-4 flex-grow">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium text-blue-600">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <FiArrowRight className="text-gray-400" />
              </li>
            ))}
          </ul>
          <button className="mt-6 text-blue-600 hover:text-blue-800 font-medium flex items-center">
            View All Activity <FiArrowRight className="ml-2" />
          </button>
        </div>

        {/* Quick Insights / Today's Highlights */}
        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FiZap className="mr-2 text-orange-500" /> Today's Highlights
          </h3>
          <div className="space-y-4 flex-grow">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium flex items-center">
                <FiUsers className="mr-2" /> New Students
              </span>
              <span className="text-2xl font-bold text-blue-800">{stats.newStudentsToday}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium flex items-center">
                <FiCheckCircle className="mr-2" /> Courses Completed
              </span>
              <span className="text-2xl font-bold text-green-800">{stats.coursesCompletedToday}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-700 font-medium flex items-center">
                <FiBookOpen className="mr-2" /> Lessons Viewed
              </span>
              <span className="text-2xl font-bold text-purple-800">~{ (Math.random() * 50 + 100).toFixed(0) }</span> {/* Random for demo */}
            </div>
          </div>
          <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105">
            View Detailed Analytics
          </button>
        </div>

        {/* Popular Courses */}
        <div className="lg:col-span-1 bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FiAward className="mr-2 text-yellow-500" /> Top Performing Courses
          </h3>
          <ul className="space-y-3">
            {popularCourses.map((course, index) => (
              <li key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-700 mr-3">{index + 1}.</span>
                  <p className="text-gray-800 font-medium">{course.title}</p>
                </div>
                <span className="text-sm text-blue-600 font-semibold">{course.students.toLocaleString()} Students</span>
              </li>
            ))}
          </ul>
          <button className="mt-6 text-blue-600 hover:text-blue-800 font-medium flex items-center">
            Manage Courses <FiArrowRight className="ml-2" />
          </button>
        </div>

        {/* Student Demographics (Ghana Map / Regions) */}
        <div className="lg:col-span-2 bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FiMapPin className="mr-2 text-teal-500" /> Student Reach Across Ghana
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 p-4">
              {/* This is where a simple SVG map of Ghana could go,
                  with regions highlighted based on student density.
                  For now, a placeholder image. */}
              <img
                src="https://via.placeholder.com/300x200/F0F4F8/606F7B?text=Map+of+Ghana"
                alt="Map of Ghana with student distribution"
                className="w-full h-auto rounded-lg shadow-inner"
              />
              <p className="text-sm text-gray-600 mt-2 text-center">
                Students from {studentDemographics.totalRegions} regions
              </p>
            </div>
            <div className="w-full md:w-1/2 md:pl-6 mt-6 md:mt-0">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Top Regions by Enrollment:</h4>
              <ul className="space-y-2">
                {studentDemographics.topRegions.map(region => (
                  <li key={region.name} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-b-0">
                    <span className="text-gray-700 flex items-center"><FiMapPin className="mr-2 text-gray-400" /> {region.name}</span>
                    <span className="font-semibold text-blue-600">{region.students.toLocaleString()} Students</span>
                  </li>
                ))}
              </ul>
              <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center">
                View All Students <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions / Important Links */}
        <div className="lg:col-span-full bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FiZap className="mr-2 text-indigo-500" /> Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition duration-200">
              <FiUserPlus className="mr-2 text-blue-500" /> Add New Student
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition duration-200">
              <FiBookOpen className="mr-2 text-purple-500" /> Create New Course
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition duration-200">
              <FiPlayCircle className="mr-2 text-green-500" /> Add New Lesson
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition duration-200">
              <FiZap className="mr-2 text-orange-500" /> Add New Challenge
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition duration-200">
              <FiMail className="mr-2 text-pink-500" /> Send Notification
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition duration-200">
              <FiFilter className="mr-2 text-teal-500" /> Review Pending Schools
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;