import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye,
  Star,
  Users,
  Calendar,
  Clock,
  Tag,
  ChevronDown,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  X,
  CheckCircle,
  AlertCircle,
  Pause
} from 'lucide-react';

export default function GenericItemList() {
  // Configuration - easily customizable for different item types
  const config = {
    itemType: 'courses', // courses, lessons, students, projects, etc.
    title: 'Courses',
    searchPlaceholder: 'Search courses...',
    addButtonText: 'Add New Course'
  };

  // Sample data - replace with your actual data
  const [items] = useState([
    {
      id: 1,
      title: 'Python Fundamentals',
      subtitle: 'Learn Python programming from scratch',
      image: '🐍',
      status: 'active',
      category: 'Programming',
      level: 'Beginner',
      students: 1247,
      rating: 4.8,
      duration: '6 weeks',
      lastUpdated: '2 days ago',
      instructor: 'Dr. Kwame Asante',
      tags: ['Python', 'Beginner', 'Programming']
    },
    {
      id: 2,
      title: 'JavaScript Essentials',
      subtitle: 'Master JavaScript for web development',
      image: '📜',
      status: 'active',
      category: 'Web Development',
      level: 'Intermediate',
      students: 892,
      rating: 4.6,
      duration: '8 weeks',
      lastUpdated: '1 week ago',
      instructor: 'Ama Serwaa',
      tags: ['JavaScript', 'Web', 'Frontend']
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      subtitle: 'Essential computer science concepts',
      image: '🔧',
      status: 'draft',
      category: 'Computer Science',
      level: 'Advanced',
      students: 567,
      rating: 4.9,
      duration: '12 weeks',
      lastUpdated: '3 days ago',
      instructor: 'Kofi Mensah',
      tags: ['Algorithms', 'Data Structures', 'Advanced']
    },
    {
      id: 4,
      title: 'Web Design Basics',
      subtitle: 'Create beautiful and functional websites',
      image: '🎨',
      status: 'paused',
      category: 'Design',
      level: 'Beginner',
      students: 324,
      rating: 4.4,
      duration: '4 weeks',
      lastUpdated: '5 days ago',
      instructor: 'Akosua Osei',
      tags: ['Design', 'CSS', 'HTML']
    },
    {
      id: 5,
      title: 'Mobile App Development',
      subtitle: 'Build apps for Android and iOS',
      image: '📱',
      status: 'active',
      category: 'Mobile Development',
      level: 'Intermediate',
      students: 678,
      rating: 4.7,
      duration: '10 weeks',
      lastUpdated: '1 day ago',
      instructor: 'Yaw Boateng',
      tags: ['Mobile', 'React Native', 'Apps']
    },
    {
      id: 6,
      title: 'Database Management',
      subtitle: 'Learn SQL and database design',
      image: '🗄️',
      status: 'active',
      category: 'Backend',
      level: 'Intermediate',
      students: 445,
      rating: 4.5,
      duration: '7 weeks',
      lastUpdated: '4 days ago',
      instructor: 'Efua Asante',
      tags: ['SQL', 'Database', 'Backend']
    }
  ]);

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    status: '',
    category: '',
    level: ''
  });
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  // Filter options - easily customizable
  const filterOptions = {
    status: ['active', 'draft', 'paused'],
    category: ['Programming', 'Web Development', 'Computer Science', 'Design', 'Mobile Development', 'Backend'],
    level: ['Beginner', 'Intermediate', 'Advanced']
  };

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'students', label: 'Students' },
    { value: 'rating', label: 'Rating' },
    { value: 'lastUpdated', label: 'Last Updated' }
  ];

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = !selectedFilters.status || item.status === selectedFilters.status;
      const matchesCategory = !selectedFilters.category || item.category === selectedFilters.category;
      const matchesLevel = !selectedFilters.level || item.level === selectedFilters.level;

      return matchesSearch && matchesStatus && matchesCategory && matchesLevel;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [items, searchTerm, selectedFilters, sortBy, sortOrder]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'draft': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilter = (filterType) => {
    setSelectedFilters(prev => ({ ...prev, [filterType]: '' }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({ status: '', category: '', level: '' });
    setSearchTerm('');
  };

  const activeFiltersCount = Object.values(selectedFilters).filter(Boolean).length + (searchTerm ? 1 : 0);

  const ItemCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{item.image}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                {getStatusIcon(item.status)}
              </div>
              <p className="text-sm text-gray-600">{item.subtitle}</p>
            </div>
          </div>
          <div className="relative">
            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)} capitalize`}>
            {item.status}
          </span>
          <span className="text-xs text-gray-500">{item.level}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-1 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{item.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{item.rating}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{item.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">by {item.instructor}</p>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ItemRow = ({ item }) => (
    <div className="bg-white border border-gray-100 hover:bg-gray-50 transition-colors group">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="text-2xl">{item.image}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
              {getStatusIcon(item.status)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)} capitalize`}>
                {item.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">{item.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{item.students.toLocaleString()}</span> students
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{item.rating}</span>
          </div>
          <div className="text-sm text-gray-600">{item.level}</div>
          <div className="text-sm text-gray-500">{item.instructor}</div>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
              <p className="text-gray-600 mt-1">{filteredItems.length} {config.itemType} found</p>
            </div>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-5 h-5" />
              <span>{config.addButtonText}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={config.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <React.Fragment key={option.value}>
                  <option value={`${option.value}-asc`}>{option.label} (A-Z)</option>
                  <option value={`${option.value}-desc`}>{option.label} (Z-A)</option>
                </React.Fragment>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {Object.entries(filterOptions).map(([filterKey, options]) => (
                  <div key={filterKey}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {filterKey}
                    </label>
                    <select
                      value={selectedFilters[filterKey]}
                      onChange={(e) => setSelectedFilters(prev => ({ ...prev, [filterKey]: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All {filterKey}</option>
                      {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchTerm && (
                    <span className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      <span>Search: "{searchTerm}"</span>
                      <button onClick={() => setSearchTerm('')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {Object.entries(selectedFilters).map(([key, value]) => value && (
                    <span key={key} className="flex items-center space-x-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                      <span>{key}: {value}</span>
                      <button onClick={() => clearFilter(key)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={clearAllFilters}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {config.itemType} found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button 
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-2'
          }>
            {filteredItems.map(item => 
              viewMode === 'grid' 
                ? <ItemCard key={item.id} item={item} />
                : <ItemRow key={item.id} item={item} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}