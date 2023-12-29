// Import useState and useAuthContext to manage state
import { useState } from 'react';
import { useAuthContext } from './useAuthContext.js';

// Other imports
import axios from '../axiosConfig.js';
import Cookies from 'js-cookie';

/**
 * Custom hook for handling user login functionality.
 *
 * @returns {Object} An object containing login function, loading state, and error state.
 * @property {Function} login - Function to perform user login.
 * @property {boolean} isLoading - Loading state indicating whether the login process is in progress.
 * @property {string|null} error - Error state containing the login error message or null if no error.
 */
export const useLogin = () => {
  // State for managing error and loading states
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  // Get the dispatch function from the authentication context
  const { dispatch } = useAuthContext();

  /**
   * Function to perform user login.
   *
   * @param {string} username - User's username.
   * @param {string} password - User's password.
   */
  const login = async (username, password) => {
    // Set loading state to true and clear any previous errors
    setIsLoading(true);
    setError(null);

    try {
      // Make a POST request to the login endpoint
      const response = await axios.post(
        '/api/users/login',
        {
          username,
          password,
        },
        {
          withCredentials: true,
        },
      );

      // Extract JSON data from the response
      const user = response.data;
      console.log('user login: ', user);

      // Process successful login
      if (response.status === 200) {
        // Update cookies with the current user context
        Cookies.set('user', JSON.stringify(user), {
          expires: 28 / (24 * 60), // Expires in 28 minutes
          secure: true, // Secure attribute (requires HTTPS)
          sameSite: 'Strict', // SameSite attribute set to 'Strict'
        });
        // Log the cookie value after setting it
        const cookieValue = Cookies.get('user');
        console.log('user cookie:', cookieValue);
        // Update the authentication context with user data
        dispatch({ type: 'LOGIN', payload: user });

        // Update loading state to indicate completion
        setIsLoading(false);
      }
    } catch (error) {
      // Set loading to false
      setIsLoading(false);
      // Check if 'response' is defined before accessing 'error.response.data.message'
      const errorMessage = error.response && error.response.data ? error.response.data.message : 'An error occurred';
      setError(errorMessage);
      console.error('Login error:', error);
    }
  };

  // Return an object with login function, loading state, and error state
  return { login, isLoading, error };
};
