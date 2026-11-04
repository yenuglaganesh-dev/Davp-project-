// Backend Authentication and RBAC Middleware for Vite Dev Server
// Strictly enforces 2 roles: Administrator ('admin') and Student Scholar ('student')
// Records all student logins to DAVP_Student_Login_Records.xlsx via excelService

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { 
  recordStudentLogin, 
  recordStudentLogout, 
  getAllLoginRecords, 
  getExcelFilePath, 
  generateCsvData,
  ensureExcelFileExists
} from './excelService.js';

const STUDENTS_FILE_PATH = path.resolve(process.cwd(), 'src/data/registeredStudents.json');

// Master Administrator Account (Never registerable from public web portal)
const ADMIN_ACCOUNT = {
  id: 'usr_admin_01',
  email: 'admin@library.edu',
  username: 'admin',
  passwordHash: crypto.createHash('sha256').update('admin123').digest('hex'),
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

// Helper: Read registered students
function loadRegisteredStudents() {
  try {
    if (fs.existsSync(STUDENTS_FILE_PATH)) {
      const data = fs.readFileSync(STUDENTS_FILE_PATH, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (err) {
    console.warn('[authApi] Error reading registeredStudents.json:', err);
  }
  return [];
}

// Helper: Save registered students
function saveRegisteredStudents(students) {
  try {
    fs.writeFileSync(STUDENTS_FILE_PATH, JSON.stringify(students, null, 2), 'utf8');
  } catch (err) {
    console.error('[authApi] Error saving registeredStudents.json:', err);
  }
}

// In-memory active sessions store: token -> { user, loginId, loginTime }
const SESSIONS = new Map();

// Helper: parse JSON request body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Helper: send JSON response
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// Helper: extract authenticated session from Bearer token
function getAuthenticatedSession(req) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  return SESSIONS.get(token) || null;
}

/**
 * Connect/Express middleware for Vite
 */
export function authMiddleware(req, res, next) {
  const url = req.url.split('?')[0];

  // 1. POST /api/auth/register (Student Scholar Registration ONLY)
  if (req.method === 'POST' && url === '/api/auth/register') {
    parseBody(req).then(body => {
      const {
        name,
        studentId,
        email,
        department,
        course,
        yearOfStudy,
        password,
        confirmPassword
      } = body;

      // Validation
      if (!name?.trim()) {
        return sendJson(res, 400, { error: 'Full Name is required.' });
      }
      if (!studentId?.trim()) {
        return sendJson(res, 400, { error: 'Student ID / Registration Number is required.' });
      }
      if (!email?.trim()) {
        return sendJson(res, 400, { error: 'University Email Address is required.' });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return sendJson(res, 400, { error: 'Please enter a valid university email address format.' });
      }
      if (!password || password.length < 6) {
        return sendJson(res, 400, { error: 'Password must be at least 6 characters long.' });
      }
      if (password !== confirmPassword) {
        return sendJson(res, 400, { error: 'Password and Confirm Password do not match.' });
      }

      const students = loadRegisteredStudents();
      const normEmail = email.trim().toLowerCase();
      const normStudentId = studentId.trim().toUpperCase();

      // Duplicate email check (against admin and students)
      if (normEmail === ADMIN_ACCOUNT.email.toLowerCase() || students.some(s => s.email.toLowerCase() === normEmail)) {
        return sendJson(res, 400, { error: `An account with email '${email}' already exists. Please sign in or use another email.` });
      }

      // Duplicate Student ID check
      if (students.some(s => (s.studentId || '').toUpperCase() === normStudentId)) {
        return sendJson(res, 400, { error: `Student ID '${studentId}' is already registered in the library system.` });
      }

      // Create student account (Role is strictly locked to 'student')
      const newStudent = {
        id: `usr_student_${Date.now()}`,
        studentId: normStudentId,
        email: normEmail,
        username: normEmail.split('@')[0],
        passwordHash: crypto.createHash('sha256').update(password).digest('hex'),
        name: name.trim(),
        role: 'student', // Never admin
        department: department?.trim() || 'Computer Science & Engineering',
        course: course?.trim() || 'B.Tech / M.Tech',
        yearOfStudy: yearOfStudy?.trim() || '1st Year',
        createdAt: new Date().toISOString()
      };

      students.push(newStudent);
      saveRegisteredStudents(students);

      console.log(`[authApi] Registered new student: ${newStudent.name} (${newStudent.studentId})`);

      return sendJson(res, 201, {
        success: true,
        message: 'Student account created successfully! You can now sign in with your credentials.',
        student: {
          id: newStudent.id,
          studentId: newStudent.studentId,
          name: newStudent.name,
          email: newStudent.email,
          role: 'student',
          department: newStudent.department,
          course: newStudent.course,
          yearOfStudy: newStudent.yearOfStudy
        }
      });
    });
    return;
  }

  // 2. POST /api/auth/login (Admin or Student Sign In)
  if (req.method === 'POST' && url === '/api/auth/login') {
    parseBody(req).then(async body => {
      const { emailOrUsername, password } = body;
      if (!emailOrUsername || !password) {
        return sendJson(res, 400, { error: 'Email/username and password are required.' });
      }

      const inputHash = crypto.createHash('sha256').update(password).digest('hex');
      const input = emailOrUsername.trim().toLowerCase();

      // 1. Check Administrator Account
      let matchedUser = null;
      if (
        (ADMIN_ACCOUNT.email.toLowerCase() === input || ADMIN_ACCOUNT.username.toLowerCase() === input) &&
        ADMIN_ACCOUNT.passwordHash === inputHash
      ) {
        matchedUser = ADMIN_ACCOUNT;
      }

      // 2. Check Registered Students
      if (!matchedUser) {
        const students = loadRegisteredStudents();
        const foundStudent = students.find(s => 
          (s.email.toLowerCase() === input || 
           s.username.toLowerCase() === input ||
           (s.studentId && s.studentId.toUpperCase() === input.toUpperCase())) &&
          s.passwordHash === inputHash
        );

        if (foundStudent) {
          matchedUser = foundStudent;
        }
      }

      if (!matchedUser) {
        return sendJson(res, 401, { error: 'Invalid credentials. Authentication failed.' });
      }

      // Generate server session token
      const sessionToken = `sess_${matchedUser.role}_${crypto.randomBytes(24).toString('hex')}`;
      let loginId = null;

      // REQUIREMENT 6: Record every successful student login in DAVP_Student_Login_Records.xlsx
      if (matchedUser.role === 'student') {
        try {
          const loginRecord = await recordStudentLogin({
            studentId: matchedUser.studentId,
            name: matchedUser.name,
            email: matchedUser.email,
            department: matchedUser.department,
            course: matchedUser.course,
            yearOfStudy: matchedUser.yearOfStudy
          });
          loginId = loginRecord.loginId;
        } catch (excelErr) {
          console.error('[authApi] Error recording student login to Excel:', excelErr);
        }
      }

      const safeUser = {
        id: matchedUser.id,
        studentId: matchedUser.studentId || null,
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role,
        department: matchedUser.department,
        course: matchedUser.course || null,
        yearOfStudy: matchedUser.yearOfStudy || null,
        title: matchedUser.title || 'Student Scholar',
        activeCheckouts: matchedUser.activeCheckouts ?? 0,
        permissions: matchedUser.permissions || ['read:catalog', 'borrow:books']
      };

      SESSIONS.set(sessionToken, {
        user: safeUser,
        loginId,
        loginTime: new Date().toISOString()
      });

      return sendJson(res, 200, {
        success: true,
        token: sessionToken,
        user: safeUser,
        loginId
      });
    });
    return;
  }

  // 3. GET /api/auth/me
  if (req.method === 'GET' && url === '/api/auth/me') {
    const session = getAuthenticatedSession(req);
    if (!session || !session.user) {
      return sendJson(res, 401, { error: 'Unauthorized: No active session.' });
    }
    return sendJson(res, 200, { user: session.user });
  }

  // 4. POST /api/auth/logout
  if (req.method === 'POST' && url === '/api/auth/logout') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (token) {
      const session = SESSIONS.get(token);
      if (session && session.loginId) {
        // Record logout timestamp in Excel
        recordStudentLogout(session.loginId).catch(err => {
          console.error('[authApi] Error recording logout in Excel:', err);
        });
      }
      SESSIONS.delete(token);
    }
    return sendJson(res, 200, { success: true, message: 'Logged out successfully.' });
  }

  // 5. GET /api/admin/profile (Strict RBAC: ADMIN ONLY)
  if (url === '/api/admin/profile') {
    const session = getAuthenticatedSession(req);
    if (!session || !session.user) {
      return sendJson(res, 401, { 
        error: 'Authentication Required',
        message: 'You must be logged in to access institutional profile data.'
      });
    }

    if (session.user.role !== 'admin') {
      return sendJson(res, 403, { 
        error: 'Access Denied (403 Forbidden)',
        code: 'ERR_ADMIN_ROLE_REQUIRED',
        message: `Forbidden: Institutional User Profile is strictly restricted to authenticated Administrators. Your role '${session.user.role}' lacks administrative credentials.`
      });
    }

    return sendJson(res, 200, {
      profile: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        title: session.user.title,
        department: session.user.department,
        activeCheckouts: session.user.activeCheckouts,
        permissions: session.user.permissions,
        institutionalGrants: [
          'Direct Open Access Ingestion across OpenStax, DOAB & Project Gutenberg',
          'Full Analytics Export (CSV / JSON Schema Compatible with Python Notebook)',
          'Administrative Catalog Curation (Add, Edit, and Adjust Physical Inventory)',
          'Student Management & Excel Student Login Activity Monitoring'
        ]
      }
    });
  }

  // 6. GET /api/admin/students (Strict RBAC: ADMIN ONLY)
  if (req.method === 'GET' && url === '/api/admin/students') {
    const session = getAuthenticatedSession(req);
    if (!session || !session.user) {
      return sendJson(res, 401, { error: 'Authentication Required' });
    }
    if (session.user.role !== 'admin') {
      return sendJson(res, 403, {
        error: 'Access Denied (403 Forbidden)',
        code: 'ERR_ADMIN_ROLE_REQUIRED',
        message: 'Student management is strictly restricted to authenticated Administrators.'
      });
    }

    const students = loadRegisteredStudents().map(s => ({
      id: s.id,
      studentId: s.studentId,
      name: s.name,
      email: s.email,
      department: s.department,
      course: s.course,
      yearOfStudy: s.yearOfStudy,
      createdAt: s.createdAt,
      role: 'student'
    }));

    return sendJson(res, 200, {
      success: true,
      totalStudents: students.length,
      students
    });
  }

  // 7. GET /api/admin/student-logins (Strict RBAC: ADMIN ONLY)
  if (req.method === 'GET' && url === '/api/admin/student-logins') {
    const session = getAuthenticatedSession(req);
    if (!session || !session.user) {
      return sendJson(res, 401, { error: 'Authentication Required' });
    }
    if (session.user.role !== 'admin') {
      return sendJson(res, 403, {
        error: 'Access Denied (403 Forbidden)',
        code: 'ERR_ADMIN_ROLE_REQUIRED',
        message: 'Student login records are strictly restricted to authenticated Administrators.'
      });
    }

    getAllLoginRecords().then(records => {
      // Count currently active sessions
      let activeStudentSessions = 0;
      SESSIONS.forEach(sess => {
        if (sess.user && sess.user.role === 'student') activeStudentSessions++;
      });

      return sendJson(res, 200, {
        success: true,
        totalLogins: records.length,
        activeStudentSessions,
        excelFile: 'DAVP_Student_Login_Records.xlsx',
        records
      });
    }).catch(err => {
      return sendJson(res, 500, { error: 'Failed to read login records: ' + err.message });
    });
    return;
  }

  // 8. GET /api/admin/student-logins/export-excel (Strict RBAC: ADMIN ONLY)
  if (req.method === 'GET' && url === '/api/admin/student-logins/export-excel') {
    const session = getAuthenticatedSession(req);
    if (!session || !session.user) {
      return sendJson(res, 401, { error: 'Authentication Required' });
    }
    if (session.user.role !== 'admin') {
      return sendJson(res, 403, {
        error: 'Access Denied (403 Forbidden)',
        code: 'ERR_ADMIN_ROLE_REQUIRED',
        message: 'Downloading Excel login records is strictly restricted to Administrators.'
      });
    }

    ensureExcelFileExists().then(() => {
      const filePath = getExcelFilePath();
      if (!fs.existsSync(filePath)) {
        return sendJson(res, 404, { error: 'Excel file not found.' });
      }

      const fileBuffer = fs.readFileSync(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="DAVP_Student_Login_Records.xlsx"');
      res.setHeader('Content-Length', fileBuffer.length);
      res.end(fileBuffer);
    }).catch(err => {
      return sendJson(res, 500, { error: 'Failed to prepare Excel export: ' + err.message });
    });
    return;
  }

  // 9. GET /api/admin/student-logins/export-csv (Strict RBAC: ADMIN ONLY)
  if (req.method === 'GET' && url === '/api/admin/student-logins/export-csv') {
    const session = getAuthenticatedSession(req);
    if (!session || !session.user) {
      return sendJson(res, 401, { error: 'Authentication Required' });
    }
    if (session.user.role !== 'admin') {
      return sendJson(res, 403, {
        error: 'Access Denied (403 Forbidden)',
        code: 'ERR_ADMIN_ROLE_REQUIRED',
        message: 'Downloading CSV login records is strictly restricted to Administrators.'
      });
    }

    generateCsvData().then(csvData => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="DAVP_Student_Login_Records.csv"');
      res.end(csvData);
    }).catch(err => {
      return sendJson(res, 500, { error: 'Failed to generate CSV export: ' + err.message });
    });
    return;
  }

  // Fallthrough to next Vite middleware
  next();
}
