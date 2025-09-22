// src/pages/AdminSchoolsPage.jsx (or similar)

import React, { useCallback, useEffect, useState } from 'react';
import {
  FiSearch,
  FiFilter,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiMapPin,
  FiGlobe,
  FiMail,
  FiPhone,
} from 'react-icons/fi'; // Feather icons for a clean look
import { baseUrl, baseUrlMedia, userToken } from '../../constants';
import Pagination from '../../components/Pagination';
import ArchiveConfirmationModal from '../../components/ArchiveConfirmationModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import Alert2 from '../UiElements/Alert2';
import { Link, useNavigate } from 'react-router-dom';
import AddSchool from './AddSchool';
import AddSchoolModal from './AddSchoolModal';

const schoolsDataww = [
  {
    id: 'sch001',
    name: 'Accra Academy Senior High School',
    region: 'Greater Accra',
    district: 'Accra Metro',
    contactPerson: 'Mrs. Adwoa Mensah',
    email: 'accra.academy@example.com',
    phone: '+233 24 123 4567',
    registeredDate: '2023-01-15',
    status: 'Active',
    logo: 'https://via.placeholder.com/60x60/F0F0F0/000000?text=AA', // Placeholder for school logo
  },
  {
    id: 'sch002',
    name: 'Prempeh College',
    region: 'Ashanti',
    district: 'Kumasi Metro',
    contactPerson: 'Mr. Kwasi Boahen',
    email: 'prempeh.college@example.com',
    phone: '+233 20 987 6543',
    registeredDate: '2022-11-20',
    status: 'Active',
    logo: 'https://via.placeholder.com/60x60/F0F0F0/000000?text=PC',
  },
  {
    id: 'sch003',
    name: 'Achimota School',
    region: 'Greater Accra',
    district: 'Accra Metro',
    contactPerson: 'Dr. Ama Serwaa',
    email: 'achimota.school@example.com',
    phone: '+233 55 111 2233',
    registeredDate: '2023-03-10',
    status: 'Pending',
    logo: 'https://via.placeholder.com/60x60/F0F0F0/000000?text=AS',
  },
  {
    id: 'sch004',
    name: 'Mfantsipim School',
    region: 'Central',
    district: 'Cape Coast Metro',
    contactPerson: 'Mr. Kofi Owusu',
    email: 'mfantsipim.school@example.com',
    phone: '+233 24 456 7890',
    registeredDate: '2023-02-01',
    status: 'Active',
    logo: 'https://via.placeholder.com/60x60/F0F0F0/000000?text=MS',
  },
  {
    id: 'sch005',
    name: "Wesley Girls' High School",
    region: 'Central',
    district: 'Cape Coast Metro',
    contactPerson: 'Ms. Gladys Nkrumah',
    email: 'wesleygirls@example.com',
    phone: '+233 20 222 3344',
    registeredDate: '2023-04-05',
    status: 'Active',
    logo: 'https://via.placeholder.com/60x60/F0F0F0/000000?text=WG',
  },
];

const regions = [
  'Greater Accra',
  'Ashanti',
  'Central',
  'Northern',
  'Volta',
  'Western',
  'Eastern',
  'Upper East',
  'Upper West',
  'Brong Ahafo',
];
const statuses = ['Active', 'Pending', 'Inactive'];

const ListAllSchools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [schoolsData, setSchoolsData] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // Default to 1 to avoid issues
  const [loading, setLoading] = useState(false);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToArchive, setItemToArchive] = useState(null);

  // State for delete confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


   const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}api/schools/get-all-schools/?search=${encodeURIComponent(
          search,
        )}&page=${page}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${userToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSchoolsData(data.data.schools);
      setTotalPages(data.data.pagination.total_pages);
      console.log('Total Pages:', data.data.pagination.total_pages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search, page, userToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleArchive = async (itemId) => {
    const data = { school_id: itemId };

    try {
      const response = await fetch(`${baseUrl}api/schools/archive-school/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${userToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete the item');
      }

      // Refresh the data after deletion
      await fetchData();
      //setAlert({ message: 'Item archived successfully', type: 'success' });
    } catch (error) {
      console.error('Error archiving item:', error);
      //setAlert({
      //  message: 'An error occurred while archiving the item',
      //  type: 'error',
      //});
    } finally {
      setIsArchiveModalOpen(false);
      setItemToArchive(null);
    }
  };

  const openArchiveModal = (itemId) => {
    setItemToArchive(itemId);
    setIsArchiveModalOpen(true);
  };

  const closeArchiveModal = () => {
    setIsArchiveModalOpen(false);
    setItemToArchive(null);
  };

  const closeAlert = () => {
    //setAlert({ message: '', type: '' });
  };

  const handleDelete = async (itemId) => {
    const data = { school_id: itemId };

    try {
      const response = await fetch(`${baseUrl}api/schools/delete-school/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${userToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete the item');
      }

      // Refresh the data after deletion
      await fetchData();
      //setAlert({ message: 'Item deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting item:', error);
      //setAlert({
      //  message: 'An error occurred while deleting the item',
      //  type: 'error',
      //});
    } finally {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openDeleteModal = (itemId) => {
    setItemToDelete(itemId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  const openAddItemModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddItemModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 md:mb-0">
          <span className="text-orange-500">Ghanaian Schools</span> Directory
        </h1>

        <div className="flex gap-3">
          <button
            className="bg-green hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition duration-300 ease-in-out transform hover:scale-105"
            onClick={openAddItemModal}
          >
            <FiPlusCircle className="mr-2 text-xl" />
            Add New School
          </button>

          <Link to={'/archived-schools'}>
            <button className="bg-graydark hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition duration-300 ease-in-out transform hover:scale-105">
              Archives
            </button>
          </Link>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div className="bg-white dark:bg-boxdark p-6 rounded-xl shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by school name, contact, email..."
              className="w-full pl-12 pr-4 py-3 dark:bg-boxdark border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>

          {/* Region Filter */}
          <div>
            <label htmlFor="region-filter" className="sr-only">
              Filter by Region
            </label>
            <div className="relative">
              <select
                id="region-filter"
                className="w-full pl-4 pr-10 py-3 dark:bg-boxdark border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <FiFilter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="sr-only">
              Filter by Status
            </label>
            <div className="relative">
              <select
                id="status-filter"
                className="w-full pl-4 pr-10 py-3 dark:bg-boxdark border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <FiFilter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Schools List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schoolsData.length > 0 ? (
          schoolsData.map((school) => (
            <div
              key={school.school_id}
              className="bg-white dark:bg-boxdark rounded-xl shadow-md p-6 flex flex-col transition-all duration-300 hover:shadow-lg hover:border-blue-200 border border-transparent"
              onClick={() => {
                var school_id = school.school_id;
                navigate('/school-details', { state: { school_id } });
              }}
            
            >
              <div className="flex items-start mb-4">
                <img
                  src={`${baseUrlMedia}${school.logo}`}
                  alt={`${school.name} logo`}
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-100 shadow-sm"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-snug">
                    {school.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-semibold
                    ${
                      school.active === true
                        ? 'bg-green text-green-800'
                        : school.active === false
                        ? 'bg-yellow text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    ${school.active === true ? 'active' : 'inactive'}
                  </span>
                </div>
              </div>

              <div className="text-gray-600 space-y-2 text-sm flex-grow">
                <p className="flex items-center">
                  <FiMapPin className="mr-2 text-blue-500" />
                  {school.district}, {school.region}
                </p>
                <p className="flex items-center">
                  <FiMail className="mr-2 text-purple-500" />
                  {school.contact_email}
                </p>
                <p className="flex items-center">
                  <FiPhone className="mr-2 text-teal-500" />
                  {school.phone}
                </p>
                <p className="flex items-center">
                  <FiGlobe className="mr-2 text-gray-500" />
                  Contact: {school.contact_person}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Editing ${school.name}`);
                  }}
                  title="Edit School Details"
                >
                  <FiEdit className="mr-1" /> Edit
                </button>
                <button
                  className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openArchiveModal(school.school_id);
                  }}
                  title="Archive School"
                >
                  <FiEdit className="mr-1" />
                  Arcive
                </button>
                <button
                  className="text-red-600 hover:text-red-800 transition duration-200 flex items-center text-sm"
                  onClick={(e) => {
                    e.stopPropagation();

                    openDeleteModal(school.school_id);
                  }} // Pass the ID of the item to be deleted
                >
                  <FiTrash2 className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500 text-lg">
            No schools found matching your criteria. Try adjusting your search
            or filters.
          </div>
        )}
      </div>

      {/* Optional: Pagination (if many schools) */}

      <Pagination
        pagination={{
          page_number: page,
          total_pages: totalPages,
          next: page < totalPages ? page + 1 : null,
          previous: page > 1 ? page - 1 : null,
        }}
        setPage={setPage}
      />

      <ArchiveConfirmationModal
        isOpen={isArchiveModalOpen}
        itemId={itemToArchive}
        onConfirm={handleArchive}
        onCancel={closeArchiveModal}
      />

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        itemId={itemToDelete}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />

      <AddSchoolModal isOpen={isAddModalOpen} onClose={closeAddItemModal} />

      {/* Render the alert */}
      <Alert2 message={alert.message} type={alert.type} onClose={closeAlert} />
    </div>
  );
};

export default ListAllSchools;
