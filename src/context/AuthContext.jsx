import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAccessToken, isAuthenticated as checkAuth, startLogin, startRegister, logout as authLogout } from '../lib/auth';
import { getMe } from '../lib/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (!token || !checkAuth()) {
        setAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await getMe();
      setUser(response.data);
      setAuthenticated(true);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(() => {
    startLogin();
  }, []);

  const register = useCallback(() => {
    startRegister();
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthenticated(false);
    authLogout();
  }, []);

  const value = {
    user,
    loading,
    authenticated,
    login,
    register,
    logout,
    refetchUser: fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
