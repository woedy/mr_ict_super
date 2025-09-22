import { useState } from 'react';
import { baseUrl } from '../../constants';
import { Link, useNavigate } from 'react-router-dom';

const AddSchoolModal = ({ isOpen, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [inputErrors, setInputErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setInputErrors({});
    setServerError('');

    let formValid = true;
    const errors = {};

    if (firstName === '') {
      formValid = false;
      errors.firstName = 'First name required.';
    }

    if (lastName === '') {
      formValid = false;
      errors.lastName = 'Last name required.';
    }

    if (bio === '') {
      formValid = false;
      errors.bio = 'Bio required.';
    }

    if (!formValid) {
      setInputErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('bio', bio);

    const url = baseUrl + 'api/accounts/admin/add-user/';

    try {
      setLoading(true);
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add user');
      }

      console.log('Item Added successfully');
      navigate('/all-users');
    } catch (error) {
      console.error('Error adding user:', error.message);
      setServerError(
        error.message || 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-end z-999 bg-black bg-opacity-50">
        <div className="bg-white dark:bg-boxdark rounded-lg p-6 shadow-lg max-w-3xl w-full h-full flex justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-3xl">
            {/* First Name */}
            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                className={`w-full rounded border ${
                  inputErrors.firstName ? 'border-red-500' : 'border-stroke'
                } bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                id="firstName"
                name="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Sandra"
              />
              {inputErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {inputErrors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className={`w-full rounded border ${
                  inputErrors.lastName ? 'border-red-500' : 'border-stroke'
                } bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Mensah"
              />
              {inputErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {inputErrors.lastName}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="bio"
              >
                Bio
              </label>
              <textarea
                className={`w-full rounded border ${
                  inputErrors.bio ? 'border-red-500' : 'border-stroke'
                } bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                id="bio"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={6}
                placeholder="Write your bio here"
              ></textarea>
              {inputErrors.bio && (
                <p className="text-red-500 text-sm mt-1">{inputErrors.bio}</p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-600 rounded-lg flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M5.303 5.303a9 9 0 1112.394 12.394 9 9 0 01-12.394-12.394z"
                  />
                </svg>
                <p className="text-sm">{serverError}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4.5">
              <button
                type="button"
                onClick={onClose}
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                Cancel
              </button>

              {loading ? (
                <div
                  role="status"
                  className="flex flex-col items-center justify-center h-full space-y-4"
                >
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="text-green">Loading...</span>
                </div>
              ) : (
                <button
                  className="flex justify-center rounded bg-primary dark:bg-green py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                  type="submit"
                >
                  Save & Continue
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddSchoolModal;
