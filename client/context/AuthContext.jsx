// AuthContext.jsx
import React, { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    case 'REFRESH_TOKENS':
      return { ...state, accessToken: action.payload.accessToken, refreshToken: action.payload.refreshToken };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);

  const updateTokens = (accessToken, refreshToken) => {
    // Update your stored tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/refreshTokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh tokens');
      }

      const { accessToken, refreshToken: newRefreshToken } = await response.json();

      // Update tokens in the context
      dispatch({ type: 'REFRESH_TOKENS', payload: { accessToken, refreshToken: newRefreshToken } });

      return accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Handle the error (e.g., redirect to login page)
    }
  };

  return <AuthContext.Provider value={{ ...state, dispatch, updateTokens, refreshToken }}>{children}</AuthContext.Provider>;
};
