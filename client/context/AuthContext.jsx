// AuthContext.jsx
import React, { createContext, useReducer, useEffect } from 'react';
import axios from '../axiosConfig';

export const AuthContext = createContext();

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

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
    refreshToken: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);

  useEffect(() => {
    console.log('Updated Tokens:', state.accessToken, state.refreshToken);
  }, [state.accessToken, state.refreshToken]);

  const updateTokens = (accessToken, refreshToken) => {
    // Update your stored tokens in the context
    dispatch({ type: 'REFRESH_TOKENS', payload: { accessToken, refreshToken } });
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/users/refreshTokens', {
        refreshToken: state.refreshToken,
      });
      console.log(response);

      const { accessToken, refreshToken: newRefreshToken, user } = response.data;

      // Update tokens and user in the context
      dispatch({ type: 'REFRESH_TOKENS', payload: { accessToken, refreshToken: newRefreshToken } });
      dispatch({ type: 'LOGIN', payload: user });
      console.log('return', user);
      return user;
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  };

  return <AuthContext.Provider value={{ ...state, dispatch, updateTokens, refreshToken }}>{children}</AuthContext.Provider>;
};
