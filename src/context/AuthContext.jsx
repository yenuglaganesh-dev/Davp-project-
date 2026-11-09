import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = 'davp_auth_session_token_v2';

// Master Institutional Administrator (Permanent Fallback for Vercel & Offline Deployment)
const FALLBACK_ADMIN = {
  id: 'usr_admin_01',
  email: 'admin@library.edu',
  username: 'admin',
  name: 'Dr. Ganesh Yenugula',
  role: 'admin',
  department: 'Department of Data Analytics & Visual Computing (DAVP)',
  title: 'Institutional Administrator & Head of Library Systems',
  activeCheckouts: 3,
  permissions: [
    'admin:access_profile',
    'admin:manage_catalog',
    'admin:add_book',
    'admin:edit_book',
    'admin:delete_book',
    'admin:import_dataset',
    'admin:export_analytics',
    'admin:inventory_control',
    'admin:student_management',
    'admin:export_student_logins'
  ]
};

const INITIAL_DEMO_STUDENTS = [
  {
    id: 'usr_student_01',
    studentId: 'STU-2026-001',
    email: 'student@library.edu',
    username: 'student',
    name: 'Aarav Patel',
    role: 'student',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science',
    yearOfStudy: '3rd Year',
    createdAt: '2026-11-01T10:00:00.000Z'
  },
  {
    id: 'usr_student_1793816771731',
    studentId: 'STU-2026-088',
    email: 'vikram.sharma@library.edu',
    username: 'vikram.sharma',
    name: 'Vikram Sharma',
    role: 'student',
    department: 'Data Science & Artificial Intelligence',
    course: 'B.Tech Data Science',
    yearOfStudy: '2nd Year',
    createdAt: '2026-11-04T18:26:11.731Z'
  }
];

const INITIAL_DEMO_LOGINS = [
  {
    loginId: 'LOG-1793816800001',
    studentId: 'STU-2026-001',
    name: 'Aarav Patel',
    email: 'student@library.edu',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science',
    yearOfStudy: '3rd Year',
    loginTime: new Date(Date.now() - 3600000 * 4).toISOString(),
    logoutTime: null,
    status: 'ACTIVE_SESSION',
    ipAddress: '192.168.1.104',
    browser: 'Chrome / Desktop'
  },
  {
    loginId: 'LOG-1793816800002',
    studentId: 'STU-2026-088',
    name: 'Vikram Sharma',
    email: 'vikram.sharma@library.edu',
    department: 'Data Science & Artificial Intelligence',
    course: 'B.Tech Data Science',
    yearOfStudy: '2nd Year',
    loginTime: new Date(Date.now() - 3600000 * 18).toISOString(),
    logoutTime: new Date(Date.now() - 3600000 * 16).toISOString(),
    status: 'COMPLETED',
    ipAddress: '192.168.1.112',
    browser: 'Firefox / Linux'
  }
];

const getLocalStudents = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem('davp_registered_students_v2');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }
  } catch (e) {}
  return INITIAL_DEMO_STUDENTS;
};

const saveLocalStudent = (student) => {
  try {
    const students = getLocalStudents();
    students.unshift(student);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('davp_registered_students_v2', JSON.stringify(students));
    }
  } catch (e) {}
};

const getLocalLogins = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem('davp_student_logins_history_v2');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }
  } catch (e) {}
  return INITIAL_DEMO_LOGINS;
};

const recordLocalStudentLogin = (student) => {
  try {
    const logins = getLocalLogins();
    const newRecord = {
      loginId: 'LOG-' + Date.now(),
      studentId: student.studentId || 'STU-GEN',
      name: student.name,
      email: student.email,
      department: student.department || 'Computer Science & Engineering',
      course: student.course || 'B.Tech Computer Science',
      yearOfStudy: student.yearOfStudy || '1st Year',
      loginTime: new Date().toISOString(),
      logoutTime: null,
      status: 'ACTIVE_SESSION',
      ipAddress: 'Client (Web)',
      browser: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 45) : 'Browser'
    };
    logins.unshift(newRecord);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('davp_student_logins_history_v2', JSON.stringify(logins));
    }
  } catch (e) {}
};

// Safe wrapper for sessionStorage with memory fallback to prevent SecurityError in private/incognito or restricted iframe environments
const authMemoryStore = new Map();

const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const val = window.sessionStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {
      // Storage access blocked or restricted
    }
    return authMemoryStore.get(key) || null;
  },
  setItem: (key, val) => {
    authMemoryStore.set(key, val);
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, val);
      }
    } catch (e) {
      // Storage access blocked or quota exceeded
    }
  },
  removeItem: (key) => {
    authMemoryStore.delete(key);
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch (e) {
      // Storage access blocked
    }
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return safeStorage.getItem(TOKEN_STORAGE_KEY) || null;
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDeniedState, setAccessDeniedState] = useState({
    isOpen: false,
    title: '',
    message: '',
    attemptedAction: ''
  });

  // Verify session token against backend API with client fallback for Vercel
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

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setUser(data.user);
        setLoading(false);
        return;
      }
    } catch (err) {
      // Backend auth verification offline or static Vercel
    }

    // Client-side fallback for Vercel deployment:
    if (sessionToken.includes('admin')) {
      setUser(FALLBACK_ADMIN);
    } else if (sessionToken.includes('student')) {
      const students = getLocalStudents();
      setUser(students[0] || null);
    } else {
      safeStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    verifySession(token);
  }, [token, verifySession]);

  // Login handler with fallback for Vercel
  const login = async (emailOrUsername, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password })
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        safeStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user, loginId: data.loginId };
      }
    } catch (err) {
      // Backend offline or running on static Vercel
    }

    // Client-side fallback for Vercel deployment
    const trimmed = (emailOrUsername || '').trim().toLowerCase();
    if ((trimmed === 'admin@library.edu' || trimmed === 'admin') && password === 'admin123') {
      const adminToken = 'davp_session_admin_' + Date.now();
      safeStorage.setItem(TOKEN_STORAGE_KEY, adminToken);
      setToken(adminToken);
      setUser(FALLBACK_ADMIN);
      return { success: true, user: FALLBACK_ADMIN, loginId: 'LOG-' + Date.now() };
    }

    const students = getLocalStudents();
    const matched = students.find(s => 
      s.email?.toLowerCase() === trimmed || 
      s.username?.toLowerCase() === trimmed || 
      s.studentId?.toLowerCase() === trimmed
    );
    if (matched) {
      const studentToken = 'davp_session_student_' + Date.now();
      safeStorage.setItem(TOKEN_STORAGE_KEY, studentToken);
      setToken(studentToken);
      setUser(matched);
      recordLocalStudentLogin(matched);
      return { success: true, user: matched, loginId: 'LOG-' + Date.now() };
    }

    return { success: false, error: 'Invalid credentials. For Administrator, use admin@library.edu / admin123' };
  };

  // Student Registration handler with fallback for Vercel
  const register = async (studentData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        return { success: true, message: data.message, student: data.student };
      }
    } catch (err) {
      // Backend offline or static Vercel
    }

    // Client-side registration fallback for Vercel
    const newStudent = {
      id: 'usr_student_' + Date.now(),
      studentId: (studentData.studentId || '').trim().toUpperCase(),
      email: (studentData.email || '').trim(),
      username: (studentData.username || studentData.email.split('@')[0] || '').trim(),
      name: (studentData.name || '').trim(),
      role: 'student',
      department: studentData.department || 'Computer Science & Engineering',
      course: studentData.course || 'B.Tech Computer Science',
      yearOfStudy: studentData.yearOfStudy || '1st Year',
      createdAt: new Date().toISOString()
    };
    saveLocalStudent(newStudent);
    return { success: true, message: 'Student registered successfully in library registry!', student: newStudent };
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
    safeStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  // Fetch Institutional Profile from backend (Admin Only) with Vercel fallback
  const fetchAdminProfile = async () => {
    if (!token) {
      triggerAccessDenied('Institutional User Profile', 'Authentication is required to view institutional profile data.');
      throw new Error('Authentication required');
    }

    try {
      const res = await fetch('/api/admin/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        return data.profile;
      }
    } catch (err) {
      // Backend offline or static Vercel
    }

    // Vercel deployment fallback
    return FALLBACK_ADMIN;
  };

  // Fetch Registered Students (Admin Only) with Vercel fallback
  const fetchStudents = async () => {
    if (!token) {
      triggerAccessDenied('Student Management', 'Authentication is required to access student records.');
      throw new Error('Authentication required');
    }

    try {
      const res = await fetch('/api/admin/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      // Backend offline or static Vercel
    }

    // Vercel fallback:
    const students = getLocalStudents();
    return { students, count: students.length };
  };

  // Fetch Student Login History from Excel (Admin Only) with Vercel fallback
  const fetchStudentLogins = async () => {
    if (!token) {
      triggerAccessDenied('Student Login History', 'Authentication is required to access student login logs.');
      throw new Error('Authentication required');
    }

    try {
      const res = await fetch('/api/admin/student-logins', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      // Backend offline or static Vercel
    }

    // Vercel fallback:
    const records = getLocalLogins();
    return { 
      records, 
      totalLogins: records.length, 
      activeStudentSessions: records.filter(r => !r.logoutTime).length 
    };
  };

  // Download Student Login Records Excel File (Admin Only) with Vercel fallback
  const downloadStudentLoginsExcel = async () => {
    if (!token) {
      triggerAccessDenied('Download Student Login Records (Excel)', 'Authentication is required.');
      return;
    }

    try {
      const res = await fetch('/api/admin/student-logins/export-excel', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && (contentType.includes('spreadsheet') || contentType.includes('octet-stream'))) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DAVP_Student_Login_Records.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return;
      }
    } catch (err) {
      // Fallback to client-side CSV download
    }

    await downloadStudentLoginsCsv();
  };

  // Download Student Login Records CSV (Admin Only) with Vercel fallback
  const downloadStudentLoginsCsv = async () => {
    if (!token) {
      triggerAccessDenied('Download Student Login Records (CSV)', 'Authentication is required.');
      return;
    }

    try {
      const res = await fetch('/api/admin/student-logins/export-csv', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('text/csv')) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DAVP_Student_Login_Records.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return;
      }
    } catch (err) {}

    // Client-side fallback: generate CSV directly in browser
    try {
      const records = getLocalLogins();
      const headers = ['Record ID', 'Student ID', 'Full Name', 'Email', 'Department', 'Course', 'Year', 'Login Timestamp', 'Logout Timestamp', 'Status', 'IP Address', 'Browser'];
      const rows = records.map(r => [
        `"${r.loginId || ''}"`,
        `"${r.studentId || ''}"`,
        `"${r.name || ''}"`,
        `"${r.email || ''}"`,
        `"${r.department || ''}"`,
        `"${r.course || ''}"`,
        `"${r.yearOfStudy || ''}"`,
        `"${r.loginTime || ''}"`,
        `"${r.logoutTime || ''}"`,
        `"${r.status || 'ACTIVE'}"`,
        `"${r.ipAddress || ''}"`,
        `"${r.browser || ''}"`
      ]);
      const csvString = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DAVP_Student_Login_Records.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error('Error downloading CSV file:', e);
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
