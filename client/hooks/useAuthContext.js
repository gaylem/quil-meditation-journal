// Import AuthContext and useContext
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

/**
 * A custom hook for accessing the authentication context.
 * @returns {Object} An object containing the authentication context with an additional userId property.
 * @property {Object} contextWithUserId - The authentication context with an added userId property.
 * @property {string} contextWithUserId.userId - The user ID.
 * @property {Object} contextWithUserId.user - The user object from the authentication context.
 * @property {string} contextWithUserId.accessToken - The access token from the authentication context.
 * @property {string} contextWithUserId.refreshToken - The refresh token from the authentication context.
 * @property {Function} contextWithUserId.dispatch - The dispatch function from the authentication context.
 * @property {Function} contextWithUserId.updateTokens - The function to update access and refresh tokens in the context.
 * @property {Function} contextWithUserId.refreshToken - The function to refresh tokens from the server.
 */
export const useAuthContext = () => {
  // Get the authentication context using the useContext hook
  const authContext = useContext(AuthContext);

  // Create an object with the authentication context and an added userId property
  const contextWithUserId = {
    ...authContext,
    userId: authContext.user ? authContext.user.id : null,
  };

  // Return the modified context object
  return contextWithUserId;
};
