//** AUTH CONTEXT */

// Imports
import React, { createContext, useReducer, useEffect } from 'react';
import axios from '../axiosConfig.js';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

/**
 * @typedef {Object} User
 * @property {string} username - Username for the user.
 * @property {string} accessToken - Access token for the user.
 * @property {string} userId - Unique identifier for the user.
 */

/**
 * @typedef {Object} AuthState
 * @property {User | null} user - Current authenticated user or null if not authenticated.
 * @property {string | null} accessToken - Access token for the authenticated user or null.
 */

/**
 * Context for managing authentication state.
 * @type {React.Context<AuthContextValue>}
 */
export const AuthContext = createContext();

/**
 * @description Reducer function to handle authentication state changes.
 * @param {AuthState} state - Current authentication state.
 * @param {Object} action - Action to be performed.
 * @param {string} action.type - Type of action.
 * @param {any} action.payload - Payload data for the action.
 * @returns {AuthState} New authentication state.
 */
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null, accessToken: null };
    case 'ACCESS_TOKEN':
      return { ...state, accessToken: action.payload };
    default:
      return state;
  }
};

/**
 * @description Provider component to manage authentication state.
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} AuthContext.Provider component.
 */
export const AuthContextProvider = ({ children }) => {
  /**
   * @type {[AuthState, Function]}
   */
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
  });

  /**
   * Effect to check for a stored user in cookies and update the context with the stored user details.
   */
  useEffect(() => {
    try {
      // Check if a user is stored in cookies
      const storedUserString = Cookies.get('user');
      console.log('storedUserString: ', storedUserString);
      console.log('storedUser: ', storedUserString);

      if (storedUserString) {
        const storedUser = JSON.parse(storedUserString);
        if (storedUser && storedUser.accessToken) {
          // If the user is found, update the context with stored user details
          dispatch({ type: 'LOGIN', payload: storedUser });
          dispatch({ type: 'ACCESS_TOKEN', payload: storedUser.accessToken });
        }
      }
    } catch (error) {
      console.error('AuthContextProvider:', error);
    }
  }, [state.accessToken]);

  /**
   * Effect to update cookies when the user context changes
   */
  useEffect(() => {
    try {
      // Get the current user context
      const currentUser = state.user;
      console.log('currentUser: ', currentUser);

      if (currentUser) {
        // Update cookies with the current user context
        Cookies.set('user', JSON.stringify(currentUser), {
          expires: 28 / (24 * 60), // Expires in 28 minutes
          secure: true, // Secure attribute (requires HTTPS)
          sameSite: 'Strict', // SameSite attribute set to 'Strict'
        });
      }
    } catch (error) {
      console.error('AuthContextProvider:', error);
    }
  }, [state.user]);

  /**
   * Effect to refresh the access token at intervals and update the context with new tokens and user details.
   */
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        if (state.accessToken) {
          const response = await axios.post(
            `/api/users/token/${state.user.userId}`,
            {},
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${state.accessToken}`,
              },
            },
          );

          // Update tokens and user in the context
          dispatch(prevState => ({
            ...prevState,
            type: 'LOGIN',
            payload: response.data,
          }));

          dispatch(prevState => ({
            ...prevState,
            type: 'ACCESS_TOKEN',
            payload: response.data.accessToken,
          }));
          console.log('Token refresh successful');
        }
      } catch (error) {
        console.error('Token refresh error:', error.stack);
        // Check for the redirectToLogin flag in the response
        if (error.response?.data?.redirectToLogin) {
          console.log('Redirecting user');
          // Clear token from cookies
          Cookies.remove('user');
          // Redirect to the login page
          window.location.href = '/login';
        }
      }
    };

    // Setup interval for subsequent checks
    const intervalId = setInterval(async () => {
      await refreshAccessToken();
      console.log('AuthContext refresh access token check');
    }, 900000); // 15 minutes

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>;
};
//PropTypes for the AuthContextProvider
AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
