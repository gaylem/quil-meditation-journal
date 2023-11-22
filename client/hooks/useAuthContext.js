import { AuthContext } from '../context/AuthContext';
import React, { useContext } from 'react';

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  // Add the userId to the returned object
  const contextWithUserId = {
    ...authContext,
    userId: authContext.user ? authContext.user.id : null,
  };

  return contextWithUserId;
};
