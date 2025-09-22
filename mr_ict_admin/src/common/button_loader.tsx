const ButtonLoader = () => {
    return (
                 <div className="flex items-center space-x-3">
                                  <svg
                                    className="animate-spin w-6 h-6 text-indigo-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <circle
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      className="text-gray-200"
                                    />
                                    <path
                                      d="M4 12a8 8 0 018-8"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span className="text-indigo-500">Loading...</span>
                                </div>
    );
  };
  
  export default ButtonLoader;
  