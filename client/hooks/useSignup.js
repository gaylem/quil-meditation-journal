// Import useState and useAuthContext for managing state and authentication
import { useState } from 'react';
import { useAuthContext } from './useAuthContext.js';

// Import axios to handle server requests
import axios from '../axiosConfig.js';

/**
 * Custom hook for handling user signup functionality.
 *
 * @returns {Object} An object containing signup function, loading state, and error state.
 */
export const useSignup = () => {
  // State to manage error messages during signup
  const [error, setError] = useState(null);

  // State to manage loading state during signup
  const [isLoading, setIsLoading] = useState(null);

  // Access the authentication context for updating user information
  const { dispatch } = useAuthContext();

  /**
   * Handles user signup.
   *
   * @param {string} username - The desired username for the new user.
   * @param {string} email - The email address for the new user.
   * @param {string} password - The password for the new user.
   */
  const signup = async (username, email, password) => {
    // Set loading state to true during signup process
    setIsLoading(true);

    // Clear any previous error messages
    setError(null);

    try {
      // Send a POST request to the server to register a new user
      const response = await axios.post('/api/users/signup', {
        username,
        email,
        password,
      });

      console.log(response);
      // Parse the response data
      const json = response.data;

      // Check if the signup was successful (status code 200)
      if (response.status !== 200) {
        // Update loading state to false
        setIsLoading(false);
        // Clear any previous error messages
        setError(null);

        // Update loading state to false
        setIsLoading(false);
      }
    } catch (error) {
      // If an error occurs during signup
      setIsLoading(false);
      // Set the error message received from the server
      setError(error.response.data.message);
      console.error('Signup error:', error);
    }
  };

  // Return an object containing the signup function, loading state, and error state
  return { signup, isLoading, error };
};
