// Import AuthContext and useContext
import { AuthContext } from '../context/AuthContext.jsx';
import { useContext } from 'react';

/**
 * A custom React hook for accessing the authentication context.
 *
 * @typedef {Object} AuthContextValue
 * @property {Object} user - The user object from the authentication context. Contains username, accessToken, and userId.
 * @property {string} accessToken - The access token from the authentication context.
 * @property {Function} dispatch - The dispatch function from the authentication context.
 *
 * @returns {AuthContextValue} The authentication context object.
 * @throws {Error} Throws an error if used outside of an AuthContextProvider.
 */
export const useAuthContext = () => {
  // Get the authentication context using the useContext hook
  const authContext = useContext(AuthContext);

  // Error handling
  if (!authContext) {
    throw new Error('useEntriesContext must be used within an AuthContextProvider. Make sure your component is wrapped with the AuthContextProvider.');
  }

  // Return the auth context
  return authContext;
};
