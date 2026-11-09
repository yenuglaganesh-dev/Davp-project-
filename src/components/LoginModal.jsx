import React, { useState } from 'react';
import { 
  X, LogIn, LogOut, ShieldCheck, GraduationCap, 
  AlertCircle, KeyRound, Check, Eye, EyeOff, UserPlus, 
  Mail, Lock, User, IdCard, Building, BookOpen, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose, initialTab = 'SIGN_IN' }) {
  const { user, login, register, logout, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab); // 'SIGN_IN' or 'SIGN_UP'
  
  // Sign In state
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up state
  const [signUpData, setSignUpData] = useState({
    name: '',
    studentId: '',
    email: '',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science',
    yearOfStudy: '1st Year',
    password: '',
    confirmPassword: ''
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirm, setShowSignUpConfirm] = useState(false);

  // Status & feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Sign In submit
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password) {
      setErrorMsg('Please enter both your email address/username and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await login(emailOrUsername.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
    }
  };



  // Sign Up submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations
    if (!signUpData.name.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!signUpData.studentId.trim()) {
      setErrorMsg('Student ID / Registration Number is required.');
      return;
    }
    if (!signUpData.email.trim()) {
      setErrorMsg('University Email Address is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpData.email.trim())) {
      setErrorMsg('Please enter a valid email address format.');
      return;
    }
    if (!signUpData.password || signUpData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }

    setIsSubmitting(true);
    const res = await register(signUpData);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(res.message || 'Student account created successfully!');
      // Switch to sign in tab and prefill
      setEmailOrUsername(signUpData.email);
      setPassword(signUpData.password);
      setTimeout(() => {
        setActiveTab('SIGN_IN');
      }, 1500);
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog auth-login-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-form-header">
          <div className="form-header-title">
            <KeyRound size={20} />
            <h3>Institutional Authentication & Role Portal</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <div className="auth-portal-body">
          {/* Active Session Info Banner if already logged in */}
          {isAuthenticated && (
            <div className="active-session-box">
              <div className="session-user-badge">
                <span className="user-avatar-tag">
                  {user.role === 'admin' ? <ShieldCheck size={28} /> : <GraduationCap size={28} />}
                </span>
                <div className="session-user-details">
                  <h4 className="user-name">{user.name}</h4>
                  <span className="user-email">{user.email}</span>
                  <span className={`role-pill role-${user.role}`}>
                    Active Role: {user.role === 'admin' ? 'ADMINISTRATOR' : 'STUDENT SCHOLAR'}
                  </span>
                </div>
              </div>

              <p className="session-role-desc">
                {user.role === 'admin' 
                  ? 'Authenticated as Administrator. You have full access to catalog management, student login records, and administrative tools.' 
                  : `Signed in as Student Scholar (${user.studentId || 'Enrolled'}). Access textbook catalog, readings, and personal borrow records.`}
              </p>

              <div className="session-actions">
                <button type="button" className="btn-logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Sign Out of Library Portal</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab Navigation: SIGN IN vs SIGN UP */}
          <div className="auth-tabs-header">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'SIGN_IN' ? 'is-active' : ''}`}
              onClick={() => { setActiveTab('SIGN_IN'); setErrorMsg(''); setSuccessMsg(''); }}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'SIGN_UP' ? 'is-active' : ''}`}
              onClick={() => { setActiveTab('SIGN_UP'); setErrorMsg(''); setSuccessMsg(''); }}
            >
              <UserPlus size={16} />
              <span>Sign Up (Student Scholar)</span>
            </button>
          </div>

          {/* Feedback alerts */}
          {errorMsg && (
            <div className="auth-error-banner">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-success-banner">
              <Check size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === 'SIGN_IN' && (
            <div className="tab-pane-content">
              {/* Standard Sign In Form */}
              <div className="custom-login-section">
                <form onSubmit={handleSignIn} className="custom-login-form">
                  <div className="form-group">
                    <label className="form-label">Email Address or Username</label>
                    <div className="input-with-icon">
                      <Mail size={16} className="input-leading-icon" />
                      <input
                        type="text"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="e.g. admin@library.edu or student@library.edu"
                        className="form-input with-leading-icon"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-with-icon">
                      <Lock size={16} className="input-leading-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="form-input with-leading-icon with-trailing-icon"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-auth-submit"
                    disabled={isSubmitting}
                  >
                    <LogIn size={16} />
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                  </button>

                  <div className="auth-switch-link">
                    <span>Don't have an account?</span>{' '}
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => { setActiveTab('SIGN_UP'); setErrorMsg(''); }}
                    >
                      Create Student Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: SIGN UP (STUDENT REGISTRATION) */}
          {activeTab === 'SIGN_UP' && (
            <div className="tab-pane-content">
              <div className="signup-header-note">
                <GraduationCap size={18} className="text-blue" />
                <span>Student Scholar Account Registration. Your logins will be recorded in the library registry.</span>
              </div>

              <form onSubmit={handleSignUp} className="custom-signup-form">
                <div className="signup-fields-grid">
                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <div className="input-with-icon">
                      <User size={16} className="input-leading-icon" />
                      <input
                        type="text"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="form-input with-leading-icon"
                        required
                      />
                    </div>
                  </div>

                  {/* Student ID / Reg Number */}
                  <div className="form-group">
                    <label className="form-label">Student ID / Reg. No. *</label>
                    <div className="input-with-icon">
                      <IdCard size={16} className="input-leading-icon" />
                      <input
                        type="text"
                        value={signUpData.studentId}
                        onChange={(e) => setSignUpData({ ...signUpData, studentId: e.target.value })}
                        placeholder="e.g. STU-2026-042"
                        className="form-input with-leading-icon"
                        required
                      />
                    </div>
                  </div>

                  {/* University Email */}
                  <div className="form-group full-width">
                    <label className="form-label">University Email Address *</label>
                    <div className="input-with-icon">
                      <Mail size={16} className="input-leading-icon" />
                      <input
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        placeholder="student.name@library.edu"
                        className="form-input with-leading-icon"
                        required
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <div className="input-with-icon">
                      <Building size={16} className="input-leading-icon" />
                      <select
                        value={signUpData.department}
                        onChange={(e) => setSignUpData({ ...signUpData, department: e.target.value })}
                        className="form-input with-leading-icon"
                        required
                      >
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Data Science & Artificial Intelligence">Data Science & AI</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Mathematics & Computing">Mathematics & Computing</option>
                        <option value="Electronics & Communication">Electronics & Communication</option>
                      </select>
                    </div>
                  </div>

                  {/* Course / Programme */}
                  <div className="form-group">
                    <label className="form-label">Course / Programme *</label>
                    <div className="input-with-icon">
                      <BookOpen size={16} className="input-leading-icon" />
                      <input
                        type="text"
                        value={signUpData.course}
                        onChange={(e) => setSignUpData({ ...signUpData, course: e.target.value })}
                        placeholder="e.g. B.Tech Computer Science"
                        className="form-input with-leading-icon"
                        required
                      />
                    </div>
                  </div>

                  {/* Year of Study */}
                  <div className="form-group">
                    <label className="form-label">Year of Study *</label>
                    <div className="input-with-icon">
                      <Calendar size={16} className="input-leading-icon" />
                      <select
                        value={signUpData.yearOfStudy}
                        onChange={(e) => setSignUpData({ ...signUpData, yearOfStudy: e.target.value })}
                        className="form-input with-leading-icon"
                        required
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate / Master's">Postgraduate / Master's</option>
                        <option value="Research Scholar / Ph.D.">Research Scholar / Ph.D.</option>
                      </select>
                    </div>
                  </div>

                  {/* Role Note: Automatic Student Assignment */}
                  <div className="form-group">
                    <label className="form-label">Account Role</label>
                    <input
                      type="text"
                      value="Student Scholar (Assigned Automatically)"
                      disabled
                      className="form-input disabled-role-input"
                    />
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label className="form-label">Password * (Min. 6 chars)</label>
                    <div className="input-with-icon">
                      <Lock size={16} className="input-leading-icon" />
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        placeholder="••••••••"
                        className="form-input with-leading-icon with-trailing-icon"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      >
                        {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label className="form-label">Confirm Password *</label>
                    <div className="input-with-icon">
                      <Lock size={16} className="input-leading-icon" />
                      <input
                        type={showSignUpConfirm ? 'text' : 'password'}
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="form-input with-leading-icon with-trailing-icon"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowSignUpConfirm(!showSignUpConfirm)}
                      >
                        {showSignUpConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-auth-submit"
                  disabled={isSubmitting}
                >
                  <UserPlus size={16} />
                  <span>{isSubmitting ? 'Creating Student Account...' : 'Create Student Account'}</span>
                </button>

                <div className="auth-switch-link">
                  <span>Already have an account?</span>{' '}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => { setActiveTab('SIGN_IN'); setErrorMsg(''); }}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
