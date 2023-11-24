// Import necessary dependencies from the React library to create a context,
// manage state using a reducer, and handle side effects with useEffect.
import React, { createContext, useReducer, useEffect } from 'react';

// Import axios to handle server requests
import axios from '../axiosConfig';

// Import props validation
import PropTypes from 'prop-types';

/**
 * @typedef {Object} User
 * @property {string} userId - User ID.
 * @property {string} username - User's username.
 * @property {string} email - User's email address.
 * @property {string} [token] - Access token.
 */

/**
 * @typedef {Object} AuthState
 * @property {User} user - User information.
 * @property {string} accessToken - Access token.
 * @property {string} refreshToken - Refresh token.
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {AuthState} state - Current authentication state.
 * @property {Function} dispatch - Function to dispatch actions to modify the state.
 * @property {Function} updateTokens - Function to update access and refresh tokens 
 * in the context.
 * @property {Function} refreshToken - Function to refresh tokens from the server.
 */

/**
 * Context for managing authentication state.
 * @type {React.Context<AuthContextValue>}
 */
export const AuthContext = createContext();

/**
 * Reducer function to handle authentication state changes.
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
      return { user: null, accessToken: null, refreshToken: null };
    case 'REFRESH_TOKENS':
      return { ...state, accessToken: action.payload.accessToken, refreshToken: action.payload.refreshToken };
    default:
      return state;
  }
};

/**
 * Provider component to manage authentication state.
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
    refreshToken: null,
  });

  /**
   * Check if a user is stored in local storage on component mount.
   */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);

  // TODO: Delete this when authentication is finished
  /**
   * Log updated tokens whenever they change.
   */
  useEffect(() => {
    console.log('Updated Tokens:', state.accessToken, state.refreshToken);
  }, [state.accessToken, state.refreshToken]);

  /**
   * Function to update tokens in the context.
   * @param {string} accessToken - New access token.
   * @param {string} refreshToken - New refresh token.
   */
  const updateTokens = (accessToken, refreshToken) => {
    dispatch({ type: 'REFRESH_TOKENS', payload: { accessToken, refreshToken } });
  };

  /**
   * Function to refresh tokens from the server.
   * @returns {Promise<User|null>} User information or null on error.
   */
  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/users/refreshTokens', {
        refreshToken: state.refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken, user } = response.data;

      dispatch({ type: 'REFRESH_TOKENS', payload: { accessToken, refreshToken: newRefreshToken } });
      dispatch({ type: 'LOGIN', payload: user });
      return user;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  };

  return <AuthContext.Provider value={{ ...state, dispatch, updateTokens, refreshToken }}>{children}</AuthContext.Provider>;
};

//PropTypes for the AuthContextProvider
AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
