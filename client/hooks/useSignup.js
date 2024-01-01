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

      // Check if the signup was successful (status code 200)
      if (response.status !== 200) {
        // Update loading state to false
        setIsLoading(false);
        // Set error message based on server response
        setError(json.error);
      }

      // If signup is successful
      if (response.status === 200) {
        // Save the user information to local storage
        Cookies.set('user', JSON.stringify(response.data), {
          expires: 28 / (24 * 60), // Expires in 28 minutes
          secure: true, // Secure attribute (requires HTTPS)
          sameSite: 'Strict', // SameSite attribute set to 'Strict'
        });

        // Update the auth context with the user information
        dispatch({ type: 'LOGIN', payload: response.data });

        // Update loading state to false
        setIsLoading(false);
      }
    } catch (error) {
      // If an error occurs during signup
      setIsLoading(false);
      // Set a generic error message
      setError('An error occurred during the signup process.');
      // Log the detailed error for debugging
      console.error('Signup error:', error);
    }
  };

  // Return an object containing the signup function, loading state, and error state
  return { signup, isLoading, error };
};
