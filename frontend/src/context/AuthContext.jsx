import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { getFirebaseAuth } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

async function refreshAndStoreIdToken(firebaseUser) {
  if (!firebaseUser) return null;

  const token = await firebaseUser.getIdToken(true);
  localStorage.setItem('token', token);
  return token;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getFirebaseAuth();

  const verifyToken = useCallback(async () => {
    try {
      const response = await api.get('/auth/verify-token');
      const verifiedUser = response.data?.data?.user;
      if (verifiedUser) {
        setUser(verifiedUser);
        localStorage.setItem('user', JSON.stringify(verifiedUser));
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [verifyToken]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        await refreshAndStoreIdToken(firebaseUser);
        await verifyToken();
      } catch (error) {
        console.warn('Failed to sync Firebase session', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, verifyToken]);

  const login = async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await refreshAndStoreIdToken(credential.user);
      const response = await api.post('/auth/login', { email });
      const loggedInUser = response.data?.data?.user;

      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
      }

      return { success: true, user: loggedInUser };
    } catch (error) {
      await firebaseSignOut(auth).catch(() => {});
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          'Login failed'
      };
    }
  };

  const register = async (email, password, username) => {
    let credential = null;

    try {
      credential = await createUserWithEmailAndPassword(auth, email, password);
      if (username) {
        await updateProfile(credential.user, { displayName: username }).catch(() => {});
      }

      await refreshAndStoreIdToken(credential.user);
      const response = await api.post('/auth/register', { email, username });
      const newUser = response.data?.data?.user;

      if (newUser) {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      }

      return { success: true };
    } catch (error) {
      if (credential?.user) {
        await credential.user.delete().catch(() => {});
        await firebaseSignOut(auth).catch(() => {});
      }

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

