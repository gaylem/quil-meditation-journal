// Import AuthContext and useContext
import { AuthContext } from '../context/AuthContext.jsx';
import { useContext } from 'react';

/**
 * A custom React hook for accessing the authentication context.
 * @returns {Object} The authentication context object.
 * @property {Object} user - The user object from the authentication context.
 * @property {string} accessToken - The access token from the authentication context.
 * @property {Function} dispatch - The dispatch function from the authentication context.
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
