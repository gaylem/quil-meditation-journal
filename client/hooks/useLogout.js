import { useAuthContext } from './useAuthContext';
import { useEntriesContext } from './useEntriesContext';

/**
 * Custom hook for handling user logout functionality.
 *
 * @returns {Object} An object containing the logout function.
 * @property {Function} logout - Function to perform user logout.
 */
export const useLogout = () => {
  // Get the dispatch functions from the authentication and entries contexts
  const { dispatch, user } = useAuthContext();
  const { dispatch: dispatchEntries } = useEntriesContext();

  /**
   * Function to perform user logout.
   *
   * @param {string} refreshToken - User's refresh token for server-side logout.
   */

  const logout = async (userId) => {
    try {
      // Send a request to the server to logout and invalidate the refresh token
      const response = await fetch(`/api/users/logout/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user}),
      });

      // Check if the server responds with a successful logout status (204)
      if (response.status === 204) {
        // Remove user data from local storage
        localStorage.removeItem('user');

        // Dispatch logout action to both authentication and entries contexts
        dispatch({ type: 'LOGOUT' });
        dispatchEntries({ type: 'SET_ENTRIES', payload: null });
      } else {
        // Log an error if logout fails
        console.error('Logout failed');
      }
    } catch (error) {
      // Log an error if an exception occurs during the logout process
      console.error('Logout error:', error);
    }
  };

  // Return an object with the logout function
  return { logout };
};
