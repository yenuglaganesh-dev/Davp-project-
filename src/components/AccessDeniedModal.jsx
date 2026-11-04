import React from 'react';
import { ShieldAlert, X, Lock, KeyRound, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AccessDeniedModal({ onOpenLogin }) {
  const { accessDeniedState, closeAccessDenied, user } = useAuth();

  if (!accessDeniedState.isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={closeAccessDenied} role="alertdialog" aria-modal="true">
      <div className="modal-dialog access-denied-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="access-denied-header">
          <div className="security-icon-circle">
            <ShieldAlert size={36} className="shield-alert-svg" />
          </div>
          <button type="button" className="modal-close-btn" onClick={closeAccessDenied} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <div className="access-denied-content">
          <span className="error-code-badge">HTTP 403 • FORBIDDEN</span>
          <h2 className="access-denied-title">{accessDeniedState.title || 'Access Denied'}</h2>
          
          <div className="access-denied-box">
            <Lock size={18} className="lock-icon" />
            <p className="access-denied-explanation">
              {accessDeniedState.message || 'Institutional User Profile and administrative controls are strictly restricted to authenticated Administrators.'}
            </p>
          </div>

          <div className="security-audit-details">
            <div className="audit-row">
              <span className="audit-key">Target Resource:</span>
              <span className="audit-value font-mono">{accessDeniedState.attemptedAction || 'Institutional User Profile'}</span>
            </div>
            <div className="audit-row">
              <span className="audit-key">Current Identity:</span>
              <span className="audit-value">
                {user ? `${user.name} (${user.email})` : 'Unauthenticated Visitor / Guest'}
              </span>
            </div>
            <div className="audit-row">
              <span className="audit-key">Current Role:</span>
              <span className={`audit-role-pill ${user ? `role-${user.role}` : 'role-guest'}`}>
                {user ? user.role.toUpperCase() : 'GUEST'}
              </span>
            </div>
            <div className="audit-row">
              <span className="audit-key">Required Privilege:</span>
              <span className="audit-role-pill role-required">ADMIN (ADMINISTRATOR)</span>
            </div>
          </div>

          <div className="access-denied-actions">
            <button
              type="button"
              className="btn-switch-admin"
              onClick={() => {
                closeAccessDenied();
                if (onOpenLogin) onOpenLogin();
              }}
            >
              <KeyRound size={16} />
              <span>Login as Administrator</span>
            </button>
            <button
              type="button"
              className="btn-dismiss-denied"
              onClick={closeAccessDenied}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

