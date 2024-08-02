// components/Navbar.js

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on the client side
    const isAuthenticated = () => {
      // Example: Check if token exists in localStorage
      return !!localStorage.getItem('token');
    };

    setIsLoggedIn(isAuthenticated()); // Update isLoggedIn state

    // Listen to storage events to update login status
    const handleStorageChange = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Clear authentication token from localStorage
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Update isLoggedIn state
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" passHref>
            <div className="flex items-center cursor-pointer">
              <span className="text-white text-xl font-bold">Lecture Notify</span>
            </div>
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
        <div className={`${isOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row md:items-center mt-4 md:mt-0`}>
          {/* Always show Home link */}
          <Link href="/" passHref>
            <div className="block mt-4 md:inline-block md:mt-0 text-gray-300 hover:text-white mr-4 cursor-pointer">
              Home
            </div>
          </Link>

          {/* Conditional rendering based on isLoggedIn state */}
          {isLoggedIn && (
            <>
              <Link href="/dashboard" passHref>
                <div className="block mt-4 md:inline-block md:mt-0 text-gray-300 hover:text-white mr-4 cursor-pointer">
                  Dashboard
                </div>
              </Link>
              <Link href="/admin/upload-students" passHref>
                <div className="block mt-4 md:inline-block md:mt-0 text-gray-300 hover:text-white mr-4 cursor-pointer">
                  Upload Students
                </div>
              </Link>
              <Link href="/lecture-schedule" passHref>
                <div className="block mt-4 md:inline-block md:mt-0 text-gray-300 hover:text-white mr-4 cursor-pointer">
                  Lecture Schedule
                </div>
              </Link>
              <Link href="/add-lecture" passHref>
                <div className="block mt-4 md:inline-block md:mt-0 text-gray-300 hover:text-white mr-4 cursor-pointer">
                  Add Lecture
                </div>
              </Link>
              <Link href="/notification" passHref>
                <div className="block mt-4 md:inline-block md:mt-0 text-gray-300 hover:text-white mr-4 cursor-pointer">
                  Notifications
                </div>
              </Link>
              <Link href="/user-management" passHref>
                <div className="block mt-4 md:inline-block md:mt-0 text-gray-300 hover:text-white cursor-pointer">
                  User Management
                </div>
              </Link>
              <div
                onClick={handleLogout}
                className="block mt-4 md:inline-block md:mt-0 text-gray-300 hover:text-white cursor-pointer"
              >
                Logout
              </div>
            </>
          )}
          {!isLoggedIn && (
            <Link href="/login" passHref>
              <div className="block mt-4 md:inline-block md:mt-0 text-gray-300 hover:text-white mr-4 cursor-pointer">
                Login
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

















