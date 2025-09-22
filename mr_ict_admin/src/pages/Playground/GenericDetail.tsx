import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Share2, 
  Star, 
  Clock, 
  Users, 
  Play,
  Download,
  Bookmark,
  CheckCircle,
  Eye,
  Heart,
  MoreVertical,
  Calendar,
  Tag,
  Award,
  Zap
} from 'lucide-react';

export default function GenericDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Example data - you can easily swap this out for any content type
  const detailData = {
    type: 'course', // course, lesson, tutorial, project, etc.
    title: 'Python Fundamentals for Beginners',
    subtitle: 'Master the basics of Python programming with hands-on projects',
    image: '🐍',
    status: 'Active',
    difficulty: 'Beginner',
    duration: '6 weeks',
    enrolled: 1247,
    rating: 4.8,
    totalRatings: 324,
    instructor: 'Dr. Kwame Asante',
    lastUpdated: '2 days ago',
    tags: ['Python', 'Programming', 'Beginner', 'Web Development'],
    description: 'Learn Python programming from scratch with this comprehensive course designed for absolute beginners. You\'ll build real projects and gain practical skills that you can use immediately.',
    highlights: [
      'Interactive coding exercises',
      'Real-world projects',
      'Certificate upon completion',
      'Lifetime access to materials'
    ]
  };

  const stats = [
    { label: 'Students', value: '1,247', icon: Users, color: 'text-blue-600' },
    { label: 'Rating', value: '4.8/5', icon: Star, color: 'text-yellow-600' },
    { label: 'Duration', value: '6 weeks', icon: Clock, color: 'text-green-600' },
    { label: 'Level', value: 'Beginner', icon: Award, color: 'text-purple-600' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'content', label: 'Content' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'resources', label: 'Resources' }
  ];

  const contentItems = [
    { title: 'Introduction to Python', type: 'video', duration: '12 min', completed: true },
    { title: 'Variables and Data Types', type: 'video', duration: '18 min', completed: true },
    { title: 'Control Structures', type: 'video', duration: '25 min', completed: false },
    { title: 'Functions and Modules', type: 'video', duration: '22 min', completed: false },
    { title: 'Practice Exercise #1', type: 'assignment', duration: '45 min', completed: false }
  ];

  const reviews = [
    { name: 'Ama Serwaa', rating: 5, comment: 'Excellent course! Very clear explanations.', time: '3 days ago' },
    { name: 'Kofi Mensah', rating: 4, comment: 'Good content, would recommend to beginners.', time: '1 week ago' },
    { name: 'Akosua Osei', rating: 5, comment: 'Perfect for starting my coding journey!', time: '2 weeks ago' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{detailData.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h3>
              <ul className="space-y-2">
                {detailData.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'content':
        return (
          <div className="space-y-4">
            {contentItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${item.completed ? 'bg-green-100' : 'bg-blue-100'}`}>
                    {item.type === 'video' ? (
                      <Play className={`w-4 h-4 ${item.completed ? 'text-green-600' : 'text-blue-600'}`} />
                    ) : (
                      <Edit3 className={`w-4 h-4 ${item.completed ? 'text-green-600' : 'text-blue-600'}`} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500 capitalize">{item.type} • {item.duration}</p>
                  </div>
                </div>
                {item.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
            ))}
          </div>
        );
      case 'reviews':
        return (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.name}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 ml-11">{review.comment}</p>
              </div>
            ))}
          </div>
        );
      case 'resources':
        return (
          <div className="space-y-4">
            {[
              { name: 'Python Cheat Sheet', type: 'PDF', size: '2.3 MB' },
              { name: 'Code Examples', type: 'ZIP', size: '1.8 MB' },
              { name: 'Additional Reading', type: 'PDF', size: '850 KB' }
            ].map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{resource.name}</p>
                    <p className="text-sm text-gray-500">{resource.type} • {resource.size}</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Download
                </button>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to {detailData.type}s</span>
            </button>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg transition-colors ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'}`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-12">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                <div className="text-6xl bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
                  {detailData.image}
                </div>
                <div className="text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium capitalize">
                      {detailData.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      detailData.status === 'Active' ? 'bg-green-500 bg-opacity-20' : 'bg-yellow-500 bg-opacity-20'
                    }`}>
                      {detailData.status}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{detailData.title}</h1>
                  <p className="text-blue-100 text-lg mb-4">{detailData.subtitle}</p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {detailData.lastUpdated}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{detailData.enrolled.toLocaleString()} enrolled</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right text-white">
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold">{detailData.rating}</span>
                  <span className="text-blue-100">({detailData.totalRatings})</span>
                </div>
                <p className="text-sm text-blue-100">by {detailData.instructor}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-8 py-6 bg-gray-50 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {detailData.tags.map((tag, index) => (
            <span key={index} className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </span>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Start Learning
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Preview Content
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Completed</span>
                  <span className="font-bold">2/5 lessons</span>
                </div>
                <div className="w-full bg-green-400 bg-opacity-30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <p className="text-sm text-green-100">Keep going! You're making great progress.</p>
              </div>
            </div>

            {/* Related Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related {detailData.type}s</h3>
              <div className="space-y-3">
                {[
                  'JavaScript Basics',
                  'Web Development Intro',
                  'Data Structures'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">
                      {item.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}