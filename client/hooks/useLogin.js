// Import useState and useAuthContext to manage state
import { useState } from 'react';
import { useAuthContext } from './useAuthContext.js';

// Import axios to handle server requests
import axios from '../axiosConfig.js';

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
      const response = await axios.post('/api/users/login', {
        username,
        password,
      });

      // Extract JSON data from the response
      const user = response.data;

      // Process successful login
      if (response.status === 200) {
        // Save the user data to local storage
        localStorage.setItem('user', JSON.stringify(user));

        // Update the authentication context with user data
        dispatch({ type: 'LOGIN', payload: user });

        // Update loading state to indicate completion
        setIsLoading(false);
      }
    } catch (error) {
      // Handle login error, set loading to false, and log the error
      setIsLoading(false);
      setError(error.response.data.message);
      console.log('error.response.data.message: ', error.response.data.message);
      console.error('Login error:', error);
    }
  };

  // Return an object with login function, loading state, and error state
  return { login, isLoading, error };
};
