import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = 'davp_auth_session_token_v2';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) || null;
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDeniedState, setAccessDeniedState] = useState({
    isOpen: false,
    title: '',
    message: '',
    attemptedAction: ''
  });

  // Verify session token against backend API
  const verifySession = useCallback(async (sessionToken) => {
    if (!sessionToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Invalid or expired token
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.warn('Backend auth verification offline/error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession(token);
  }, [token, verifySession]);

  // Login handler
  const login = async (emailOrUsername, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user, loginId: data.loginId };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Student Registration handler
  const register = async (studentData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return { success: true, message: data.message, student: data.student };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Logout handler
  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {
        // Ignore network logout error
      }
    }
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  // Fetch Institutional Profile from backend (Admin Only)
  const fetchAdminProfile = async () => {
    if (!token) {
      triggerAccessDenied('Institutional User Profile', 'Authentication is required to view institutional profile data.');
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/admin/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) {
      triggerAccessDenied(
        'Institutional User Profile', 
        data.message || 'Access Denied: Institutional User Profile is strictly restricted to authenticated Administrators.'
      );
      throw new Error(data.message || 'Access Denied');
    }

    return data.profile;
  };

  // Fetch Registered Students (Admin Only)
  const fetchStudents = async () => {
    if (!token) {
      triggerAccessDenied('Student Management', 'Authentication is required to access student records.');
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/admin/students', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) {
      triggerAccessDenied('Student Management', data.message || 'Access Denied: Restricted to Administrators.');
      throw new Error(data.message || 'Access Denied');
    }

    return data;
  };

  // Fetch Student Login History from Excel (Admin Only)
  const fetchStudentLogins = async () => {
    if (!token) {
      triggerAccessDenied('Student Login History', 'Authentication is required to access student login logs.');
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/admin/student-logins', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) {
      triggerAccessDenied('Student Login History', data.message || 'Access Denied: Restricted to Administrators.');
      throw new Error(data.message || 'Access Denied');
    }

    return data;
  };

  // Download Student Login Records Excel File (Admin Only)
  const downloadStudentLoginsExcel = async () => {
    if (!token) {
      triggerAccessDenied('Download Student Login Records (Excel)', 'Authentication is required.');
      return;
    }

    try {
      const res = await fetch('/api/admin/student-logins/export-excel', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        triggerAccessDenied('Download Student Login Records (Excel)', errorData.message || 'Access Denied');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DAVP_Student_Login_Records.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading Excel file:', err);
    }
  };

  // Download Student Login Records CSV (Admin Only)
  const downloadStudentLoginsCsv = async () => {
    if (!token) {
      triggerAccessDenied('Download Student Login Records (CSV)', 'Authentication is required.');
      return;
    }

    try {
      const res = await fetch('/api/admin/student-logins/export-csv', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        triggerAccessDenied('Download Student Login Records (CSV)', errorData.message || 'Access Denied');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DAVP_Student_Login_Records.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading CSV file:', err);
    }
  };

  // Access Denied Trigger
  const triggerAccessDenied = (actionName = 'Institutional User Profile', customMsg = '') => {
    setAccessDeniedState({
      isOpen: true,
      title: '403 Forbidden: Access Denied',
      attemptedAction: actionName,
      message: customMsg || `Access to "${actionName}" is strictly restricted to authenticated users with the 'admin' role. Your current account permissions do not grant administrative privileges.`
    });
  };

  const closeAccessDenied = () => {
    setAccessDeniedState(prev => ({ ...prev, isOpen: false }));
  };

  // Strictly two roles: Admin and Student
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';
  const isAuthenticated = Boolean(user);

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Administrator has full privileges
    return user.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isStudent,
        isAuthenticated,
        hasPermission,
        login,
        register,
        logout,
        fetchAdminProfile,
        fetchStudents,
        fetchStudentLogins,
        downloadStudentLoginsExcel,
        downloadStudentLoginsCsv,
        accessDeniedState,
        triggerAccessDenied,
        closeAccessDenied
      }}
    >
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
