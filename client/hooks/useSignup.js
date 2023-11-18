import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from '../axiosConfig';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (username, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/users/signup', {
        username,
        email,
        password,
      });

      const json = response.data;
      
      if (!response.status === 200) {
        setIsLoading(false);
        setError(json.error);
      }

      if (response.status === 200) {
        // Save the user to local storage
        localStorage.setItem('user', JSON.stringify(json));

        // Update the auth context
        dispatch({ type: 'LOGIN', payload: json });

        // Update loading state
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred during the signup process.');
      console.error('Signup error:', error);
    }
  };

  return { signup, isLoading, error };
};
