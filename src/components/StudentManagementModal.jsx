import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Users, FileSpreadsheet, Download, Search, Filter, 
  CheckCircle2, Clock, ShieldAlert, RefreshCw, GraduationCap, 
  Calendar, Building, Mail, LogOut, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StudentManagementModal({ isOpen, onClose }) {
  const { 
    isAdmin, 
    isAuthenticated, 
    triggerAccessDenied, 
    fetchStudents, 
    fetchStudentLogins, 
    downloadStudentLoginsExcel,
    downloadStudentLoginsCsv 
  } = useAuth();

  const [activeTab, setActiveTab] = useState('LOGINS'); // 'LOGINS' or 'STUDENTS'
  const [students, setStudents] = useState([]);
  const [loginRecords, setLoginRecords] = useState([]);
  const [totalLogins, setTotalLogins] = useState(0);
  const [activeSessions, setActiveSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [isExporting, setIsExporting] = useState(false);

  // Strict RBAC Guard on modal opening
  useEffect(() => {
    if (!isOpen) return;

    if (!isAuthenticated || !isAdmin) {
      onClose();
      triggerAccessDenied(
        'Student Management Dashboard',
        'Forbidden: Student registration and login records are strictly restricted to authenticated Administrators.'
      );
      return;
    }

    loadData();
  }, [isOpen, isAdmin, isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsRes, loginsRes] = await Promise.all([
        fetchStudents().catch(() => ({ students: [] })),
        fetchStudentLogins().catch(() => ({ records: [], totalLogins: 0, activeStudentSessions: 0 }))
      ]);

      setStudents(studentsRes.students || []);
      setLoginRecords(loginsRes.records || []);
      setTotalLogins(loginsRes.totalLogins || loginsRes.records?.length || 0);
      setActiveSessions(loginsRes.activeStudentSessions || 0);
    } catch (err) {
      console.error('Failed to load student management data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    setIsExporting(true);
    await downloadStudentLoginsExcel();
    setIsExporting(false);
  };

  const handleDownloadCsv = async () => {
    await downloadStudentLoginsCsv();
  };

  // Distinct departments and courses for filtering
  const allDepartments = useMemo(() => {
    const depts = new Set();
    students.forEach(s => s.department && depts.add(s.department));
    loginRecords.forEach(r => r.department && depts.add(r.department));
    return Array.from(depts).sort();
  }, [students, loginRecords]);

  const allCourses = useMemo(() => {
    const courses = new Set();
    students.forEach(s => s.course && courses.add(s.course));
    loginRecords.forEach(r => r.course && courses.add(r.course));
    return Array.from(courses).sort();
  }, [students, loginRecords]);

  // Filtered Login Records
  const filteredLoginRecords = useMemo(() => {
    return loginRecords.filter(r => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (r.name || '').toLowerCase().includes(q);
        const matchId = (r.studentId || '').toLowerCase().includes(q);
        const matchEmail = (r.email || '').toLowerCase().includes(q);
        const matchLoginId = (r.loginId || '').toLowerCase().includes(q);
        if (!matchName && !matchId && !matchEmail && !matchLoginId) return false;
      }
      if (deptFilter !== 'ALL' && r.department !== deptFilter) return false;
      if (courseFilter !== 'ALL' && r.course !== courseFilter) return false;
      return true;
    });
  }, [loginRecords, searchQuery, deptFilter, courseFilter]);

  // Filtered Students Roster
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (s.name || '').toLowerCase().includes(q);
        const matchId = (s.studentId || '').toLowerCase().includes(q);
        const matchEmail = (s.email || '').toLowerCase().includes(q);
        if (!matchName && !matchId && !matchEmail) return false;
      }
      if (deptFilter !== 'ALL' && s.department !== deptFilter) return false;
      if (courseFilter !== 'ALL' && s.course !== courseFilter) return false;
      return true;
    });
  }, [students, searchQuery, deptFilter, courseFilter]);

  if (!isOpen || !isAdmin) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog student-mgmt-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-form-header">
          <div className="form-header-title">
            <Users size={22} className="text-blue" />
            <div>
              <h3>Student Management & Login Analytics</h3>
              <span className="dialog-subtitle">Administrator Portal • Automated Excel Logging (`DAVP_Student_Login_Records.xlsx`)</span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <div className="student-mgmt-body">
          {/* Top 4 KPI Metrics */}
          <div className="mgmt-kpi-grid">
            <div className="mgmt-kpi-card">
              <span className="mgmt-kpi-title">Registered Students</span>
              <span className="mgmt-kpi-val text-blue">{students.length}</span>
              <span className="mgmt-kpi-sub">Verified Scholar Accounts</span>
            </div>

            <div className="mgmt-kpi-card">
              <span className="mgmt-kpi-title">Total Logins Recorded</span>
              <span className="mgmt-kpi-val text-emerald">{totalLogins}</span>
              <span className="mgmt-kpi-sub">Appended to Excel Worksheet</span>
            </div>

            <div className="mgmt-kpi-card">
              <span className="mgmt-kpi-title">Active Student Sessions</span>
              <span className="mgmt-kpi-val text-cyan">{activeSessions}</span>
              <span className="mgmt-kpi-sub">Currently Authenticated</span>
            </div>

            <div className="mgmt-kpi-card">
              <span className="mgmt-kpi-title">Excel Storage File</span>
              <div className="excel-status-pill">
                <FileSpreadsheet size={15} className="text-emerald" />
                <span className="excel-filename">DAVP_Student_Login_Records.xlsx</span>
              </div>
              <span className="mgmt-kpi-sub">Synchronized on every login</span>
            </div>
          </div>

          {/* Action Bar: Export Buttons & Refresh */}
          <div className="mgmt-action-toolbar">
            <div className="mgmt-tabs-toggle">
              <button
                type="button"
                className={`mgmt-tab-btn ${activeTab === 'LOGINS' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('LOGINS')}
              >
                <Clock size={15} />
                <span>Student Login History ({loginRecords.length})</span>
              </button>
              <button
                type="button"
                className={`mgmt-tab-btn ${activeTab === 'STUDENTS' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('STUDENTS')}
              >
                <GraduationCap size={15} />
                <span>Registered Students Roster ({students.length})</span>
              </button>
            </div>

            <div className="mgmt-export-buttons">
              <button
                type="button"
                className="btn-export-excel"
                onClick={handleDownloadExcel}
                disabled={isExporting}
                title="Download live Excel workbook containing all student login records"
              >
                <FileSpreadsheet size={16} />
                <span>{isExporting ? 'Exporting...' : 'Download Student Login Records (Excel)'}</span>
                <Download size={14} />
              </button>

              <button
                type="button"
                className="btn-export-csv"
                onClick={handleDownloadCsv}
                title="Download CSV export"
              >
                <Download size={14} />
                <span>CSV</span>
              </button>

              <button
                type="button"
                className="btn-refresh-data"
                onClick={loadData}
                title="Reload latest records from Excel"
              >
                <RefreshCw size={15} className={loading ? 'spin-slow' : ''} />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mgmt-filter-row">
            <div className="mgmt-search-box">
              <Search size={16} className="search-box-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, student ID, email, or login ID..."
                className="mgmt-search-input"
              />
              {searchQuery && (
                <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="mgmt-filter-dropdown">
              <Filter size={15} className="dropdown-icon" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="mgmt-select"
              >
                <option value="ALL">All Departments ({allDepartments.length})</option>
                {allDepartments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="mgmt-filter-dropdown">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="mgmt-select"
              >
                <option value="ALL">All Courses ({allCourses.length})</option>
                {allCourses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TAB A: Student Login History (Live Excel Log) */}
          {activeTab === 'LOGINS' && (
            <div className="mgmt-table-container">
              {loading ? (
                <div className="mgmt-loading-state">
                  <RefreshCw size={28} className="spin-slow text-blue" />
                  <p>Reading live student login records from `DAVP_Student_Login_Records.xlsx`...</p>
                </div>
              ) : filteredLoginRecords.length === 0 ? (
                <div className="mgmt-empty-state">
                  <Clock size={36} className="text-slate" />
                  <h4>No Login Records Found</h4>
                  <p>No student login records matched your search or filter criteria.</p>
                </div>
              ) : (
                <table className="mgmt-data-table">
                  <thead>
                    <tr>
                      <th>Login ID</th>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Course</th>
                      <th>Year</th>
                      <th>Login Time</th>
                      <th>Status</th>
                      <th>Logout Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLoginRecords.map((r) => (
                      <tr key={r.loginId}>
                        <td className="font-mono text-cyan">{r.loginId}</td>
                        <td className="font-mono font-semibold">{r.studentId}</td>
                        <td className="font-semibold text-white">{r.name}</td>
                        <td className="text-slate">{r.email}</td>
                        <td>{r.department}</td>
                        <td>{r.course}</td>
                        <td><span className="year-pill">{r.yearOfStudy}</span></td>
                        <td>
                          <div className="datetime-cell">
                            <span>{r.loginDate}</span>
                            <span className="time-sub">{r.loginTime}</span>
                          </div>
                        </td>
                        <td>
                          <span className="status-badge-success">
                            <Check size={11} /> {r.loginStatus}
                          </span>
                        </td>
                        <td>
                          {r.logoutTimestamp ? (
                            <span className="datetime-cell text-slate">
                              {r.logoutTimestamp.slice(11, 19)}
                            </span>
                          ) : (
                            <span className="active-tag">Active / Not logged out</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB B: Registered Students Roster */}
          {activeTab === 'STUDENTS' && (
            <div className="mgmt-table-container">
              {loading ? (
                <div className="mgmt-loading-state">
                  <RefreshCw size={28} className="spin-slow text-blue" />
                  <p>Loading registered student accounts from database...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="mgmt-empty-state">
                  <GraduationCap size={36} className="text-slate" />
                  <h4>No Registered Students Found</h4>
                  <p>No students match the current filter query.</p>
                </div>
              ) : (
                <table className="mgmt-data-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Full Name</th>
                      <th>University Email</th>
                      <th>Department</th>
                      <th>Course / Programme</th>
                      <th>Year of Study</th>
                      <th>Registration Date</th>
                      <th>Role</th>
                      <th>Access Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s) => (
                      <tr key={s.id || s.studentId}>
                        <td className="font-mono font-semibold text-cyan">{s.studentId}</td>
                        <td className="font-semibold text-white">{s.name}</td>
                        <td className="text-slate">{s.email}</td>
                        <td>{s.department}</td>
                        <td>{s.course}</td>
                        <td><span className="year-pill">{s.yearOfStudy}</span></td>
                        <td className="text-slate">
                          {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Active'}
                        </td>
                        <td>
                          <span className="role-pill role-student">student</span>
                        </td>
                        <td>
                          <span className="status-badge-success">
                            <CheckCircle2 size={12} /> Permitted
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mgmt-footer-bar">
          <span className="footer-file-note">
            <FileSpreadsheet size={14} className="text-emerald" />
            File location: <code>./DAVP_Student_Login_Records.xlsx</code> (Sheet: <code>Student_Login_Records</code>)
          </span>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

