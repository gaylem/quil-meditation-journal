//** USE SIGNUP HOOK */

// Import useState and useAuthContext for managing state and authentication
import { useState } from 'react';
import { useAuthContext } from './useAuthContext.js';

// Other imports
import axios from '../axiosConfig.js';
import Cookies from 'js-cookie';

/**
 * Custom hook for handling user signup functionality.
 *
 * @returns {Object} An object containing signup function and error state.
 */
export const useSignup = () => {
  // State for managing error and loading states
  const [error, setError] = useState(null);
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
    // Set loading state to true and clear any previous errors
    setIsLoading(true);
    setError(null);

    try {
      // Send a POST request to the server to register a new user
      const response = await axios.post(
        '/api/users/signup',
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      // Extract user data from the response
      const user = response.data;
      console.log('user login: ', user);

      // If signup is successful
      if (response.status === 200) {
        // Save the user information to local storage
        Cookies.set('user', JSON.stringify(user), {
          expires: 28 / (24 * 60), // Expires in 28 minutes
          secure: true, // Secure attribute (requires HTTPS)
          sameSite: 'Strict', // SameSite attribute set to 'Strict'
        });

        // Update the auth context with the user information
        dispatch({ type: 'LOGIN', payload: user });
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

  // Return an object containing the signup function and error state
  return { signup, isLoading, error };
};
