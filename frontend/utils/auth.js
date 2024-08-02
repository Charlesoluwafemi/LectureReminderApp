// utils/auth.js

import Cookies from 'js-cookie';

export const isAuthenticated = () => {
  const token = Cookies.get('token'); // Get token from cookies
  return !!token; // Returns true if token is present, false otherwise
};

export const logout = () => {
  Cookies.remove('token'); // Remove token from cookies upon logout
};
