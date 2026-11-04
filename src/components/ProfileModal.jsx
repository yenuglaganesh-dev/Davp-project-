import React, { useEffect, useState } from 'react';
import { X, User, ShieldCheck, CheckCircle2, Users, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ isOpen, onClose, bookCount, borrowedCount = 0, onOpenStudentManagement }) {
  const { user, isAdmin, isAuthenticated, triggerAccessDenied, fetchAdminProfile } = useAuth();
  const [adminProfileData, setAdminProfileData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Strict RBAC Guard on entry:
  // If not admin or not authenticated, immediately trigger Access Denied and close
  useEffect(() => {
    if (!isOpen) return;

    if (!isAuthenticated || !isAdmin) {
      onClose();
      triggerAccessDenied(
        'Institutional User Profile',
        `Forbidden: Institutional User Profile is strictly restricted to authenticated Administrators. Your current role is '${user ? user.role : 'unauthenticated guest'}'.`
      );
      return;
    }

    // Authenticated admin: verify with backend API
    setIsVerifying(true);
    fetchAdminProfile()
      .then(profile => {
        setAdminProfileData(profile);
      })
      .catch(err => {
        console.error('Admin profile fetch rejected by backend:', err);
        onClose();
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [isOpen, isAdmin, isAuthenticated, user]);

  if (!isOpen) return null;

  // If user is not admin, do not render any profile content
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const displayName = adminProfileData?.name || user?.name || 'Dr. Ganesh Yenugula';
  const displayDept = adminProfileData?.department || user?.department || 'Department of Data Analytics & Visual Computing (DAVP)';
  const displayTitle = adminProfileData?.title || user?.title || 'Institutional Faculty & Researcher';
  const displayCheckouts = adminProfileData?.activeCheckouts ?? borrowedCount ?? 3;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog profile-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <div className="form-header-title">
            <User size={20} />
            <h3>Institutional User Profile</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {isVerifying ? (
          <div className="profile-loading-state">
            <ShieldCheck size={32} className="spin-slow text-blue" />
            <p>Verifying institutional administrator credentials against backend...</p>
          </div>
        ) : (
          <div className="profile-content-body">
            {/* Admin Hero Card */}
            <div className="profile-hero-card">
              <div className="profile-avatar-large">
                <User size={36} />
              </div>
              <div className="profile-hero-meta">
                <h4 className="profile-display-name">{displayName}</h4>
                <span className="profile-badge-faculty">
                  <ShieldCheck size={13} /> {displayTitle}
                </span>
                <p className="profile-inst-name">{displayDept}</p>
              </div>
            </div>

            {/* Catalog Access, Active Checkouts, Permissions */}
            <div className="profile-stats-grid">
              <div className="profile-stat-box">
                <span className="box-label">Catalog Access</span>
                <span className="box-val text-blue">{bookCount} Titles</span>
                <span className="box-sub">Full Institutional Access</span>
              </div>
              <div className="profile-stat-box">
                <span className="box-label">Active Checkouts</span>
                <span className="box-val text-emerald">{displayCheckouts} Books</span>
                <span className="box-sub">Digital Lending Active</span>
              </div>
              <div className="profile-stat-box">
                <span className="box-label">Permissions</span>
                <span className="box-val text-cyan">Admin / Edit</span>
                <span className="box-sub">Administrative Catalog Management Privileges</span>
              </div>
            </div>

            {/* Active Credentials & Grants */}
            <div className="profile-privileges-card">
              <h5 className="privileges-title">Active Credentials & Grants</h5>
              <div className="privilege-item">
                <CheckCircle2 size={15} className="text-emerald" />
                <span>Direct Open Access Ingestion across OpenStax, DOAB & Project Gutenberg</span>
              </div>
              <div className="privilege-item">
                <CheckCircle2 size={15} className="text-emerald" />
                <span>Full Analytics Export (CSV / JSON Schema Compatible with Python Notebook)</span>
              </div>
              <div className="privilege-item">
                <CheckCircle2 size={15} className="text-emerald" />
                <span>Administrative Catalog Curation (Add, Edit, and Adjust Physical Inventory)</span>
              </div>
              <div className="privilege-item">
                <CheckCircle2 size={15} className="text-emerald" />
                <span>Student Management & Excel Student Login Activity Monitoring (`DAVP_Student_Login_Records.xlsx`)</span>
              </div>
            </div>

            {/* Quick Link to Student Management */}
            {onOpenStudentManagement && (
              <div className="profile-admin-shortcuts">
                <button
                  type="button"
                  className="btn-hero-primary full-width"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
                  onClick={() => {
                    onClose();
                    onOpenStudentManagement();
                  }}
                >
                  <Users size={16} />
                  <span>Open Student Management & Excel Login Records</span>
                  <FileSpreadsheet size={16} />
                </button>
              </div>
            )}

            <div className="profile-footer-row">
              <button type="button" className="btn-modal-close full-width" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
