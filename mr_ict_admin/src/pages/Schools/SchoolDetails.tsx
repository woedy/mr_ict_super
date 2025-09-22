import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  TrendingUp,
  Eye,
  Edit3,
  Settings,
  ChevronRight,
  Star,
  Clock,
  Wifi,
  Zap,
  Monitor
} from 'lucide-react';

export default function SchoolDetails() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const schoolData = {
    name: "Achimota Senior High School",
    type: "Senior High School",
    region: "Greater Accra Region",
    district: "Accra Metropolitan",
    address: "Forest Road, Achimota, Accra",
    phone: "+233 30 240 7890",
    email: "info@achimotashs.edu.gh",
    established: "1927",
    motto: "Ut Omnes Unum Sint",
    totalStudents: 3247,
    totalTeachers: 156,
    activePrograms: 12,
    completionRate: 94.2,
    logo: "🏫"
  };

  const stats = [
    { label: "Total Students", value: "3,247", icon: Users, color: "bg-blue-500", trend: "+12%" },
    { label: "Active Programs", value: "12", icon: BookOpen, color: "bg-green-500", trend: "+3 new" },
    { label: "Completion Rate", value: "94.2%", icon: Award, color: "bg-purple-500", trend: "+2.1%" },
    { label: "Teachers", value: "156", icon: Users, color: "bg-orange-500", trend: "+8 new" }
  ];

  const recentActivity = [
    { action: "New coding program launched", time: "2 hours ago", type: "program" },
    { action: "25 students completed Python basics", time: "5 hours ago", type: "completion" },
    { action: "Teacher training session scheduled", time: "1 day ago", type: "training" },
    { action: "Infrastructure upgrade completed", time: "2 days ago", type: "upgrade" }
  ];

  const facilities = [
    { name: "Computer Labs", count: 4, status: "Excellent", icon: Monitor },
    { name: "Internet Connectivity", speed: "100 Mbps", status: "Active", icon: Wifi },
    { name: "Power Supply", type: "Grid + Solar", status: "Stable", icon: Zap },
    { name: "Coding Workstations", count: 120, status: "Operational", icon: Settings }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className=" border-b border-graydark shadow-sm mb-3">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{schoolData.logo}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{schoolData.name}</h1>
                <p className="text-gray-600">{schoolData.type} • {schoolData.region}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 size={16} />
                <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto ">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-boxdark rounded-xl shadow-sm  p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium mt-1">{stat.trend}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* School Information Card */}
            <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">School Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium text-gray-900">{schoolData.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{schoolData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{schoolData.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Established</p>
                        <p className="font-medium text-gray-900">{schoolData.established}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">School Motto</p>
                        <p className="font-medium text-gray-900">{schoolData.motto}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Performance Rating</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {[1,2,3,4,5].map(star => (
                              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900">Excellent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities & Infrastructure */}
            <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm  overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">ICT Infrastructure</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facilities.map((facility, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <facility.icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">{facility.name}</p>
                          <p className="text-sm text-gray-600">
                            {facility.count && `${facility.count} units`}
                            {facility.speed && facility.speed}
                            {facility.type && facility.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          facility.status === 'Excellent' || facility.status === 'Active' || facility.status === 'Stable' || facility.status === 'Operational'
                            ? 'bg-green-500' 
                            : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700">{facility.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: "View All Students", icon: Users, color: "text-blue-600" },
                  { label: "Manage Programs", icon: BookOpen, color: "text-green-600" },
                  { label: "Generate Reports", icon: TrendingUp, color: "text-purple-600" },
                  { label: "School Settings", icon: Settings, color: "text-gray-600" }
                ].map((action, index) => (
                  <button key={index} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                      <span className="font-medium text-gray-900">{action.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'program' ? 'bg-blue-500' :
                      activity.type === 'completion' ? 'bg-green-500' :
                      activity.type === 'training' ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Monthly Highlights</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">New Enrollments</span>
                  <span className="font-bold">147</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Programs Completed</span>
                  <span className="font-bold">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Certification Rate</span>
                  <span className="font-bold">96.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}