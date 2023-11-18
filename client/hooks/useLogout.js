import { useAuthContext } from './useAuthContext';
import { useEntriesContext } from './useEntriesContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: dispatchEntries } = useEntriesContext();

  const logout = async refreshToken => {
    try {
      // Send a request to the server to logout and invalidate the refresh token
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.status === 204) {
        // remove user from storage
        localStorage.removeItem('user');

        // dispatch logout action
        dispatch({ type: 'LOGOUT' });
        dispatchEntries({ type: 'SET_ENTRIES', payload: null });
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { logout };
};
