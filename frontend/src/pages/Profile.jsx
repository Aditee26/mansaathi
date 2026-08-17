import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './PageLayouts.css';
import './Profile.css';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [dailyReminder, setDailyReminder] = useState(user?.dailyReminder ?? true);
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileSubmitting(true);
    try {
      const { data } = await api.put('/users/me', { name, dailyReminder });
      updateUser(data.user);
      setProfileMsg({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (passwords.next !== passwords.confirm) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordSubmitting(true);
    try {
      await api.put('/users/me/password', {
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setPasswordMsg({ type: 'success', text: 'Password updated.' });
      setPasswords({ current: '', next: '', confirm: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    try {
      await api.delete('/users/me');
      logout();
      navigate('/');
    } catch (err) {
      alert(getErrorMessage(err));
      setDeleting(false);
    }
  };

  return (
    <div className="container page">
      <div className="page-header">
        <div>
          <h1>Profile & settings</h1>
          <p className="muted">Manage your account details and preferences.</p>
        </div>
      </div>

      <div className="profile-sections">
        <section className="card">
          <div className="section-title">
            <h3>Profile</h3>
          </div>
          {profileMsg && (
            <div className={`alert alert-${profileMsg.type}`}>{profileMsg.text}</div>
          )}
          <form onSubmit={handleProfileSubmit}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="input" value={user?.email || ''} disabled />
              <span className="field-hint">Email can't be changed.</span>
            </div>
            <label className="row checkbox-row" htmlFor="reminder">
              <input
                id="reminder"
                type="checkbox"
                checked={dailyReminder}
                onChange={(e) => setDailyReminder(e.target.checked)}
              />
              Send me a daily check-in reminder
            </label>
            <button type="submit" className="btn btn-primary" disabled={profileSubmitting}>
              {profileSubmitting ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </section>

        <section className="card">
          <div className="section-title">
            <h3>Change password</h3>
          </div>
          {passwordMsg && (
            <div className={`alert alert-${passwordMsg.type}`}>{passwordMsg.text}</div>
          )}
          <form onSubmit={handlePasswordSubmit}>
            <div className="field">
              <label htmlFor="current-password">Current password</label>
              <input
                id="current-password"
                type="password"
                className="input"
                autoComplete="current-password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type="password"
                className="input"
                autoComplete="new-password"
                value={passwords.next}
                onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="confirm-password">Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                className="input"
                autoComplete="new-password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={passwordSubmitting}>
              {passwordSubmitting ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </section>

        <section className="card danger-zone">
          <div className="section-title">
            <h3>Danger zone</h3>
          </div>
          <p className="muted text-sm">
            Deleting your account permanently removes your journals, mood history, and activity
            log. This cannot be undone.
          </p>
          <div className="field" style={{ maxWidth: 320 }}>
            <label htmlFor="delete-confirm">Type DELETE to confirm</label>
            <input
              id="delete-confirm"
              className="input"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-danger"
            disabled={deleteConfirm !== 'DELETE' || deleting}
            onClick={handleDeleteAccount}
          >
            {deleting ? 'Deleting…' : 'Delete my account'}
          </button>
        </section>
      </div>
    </div>
  );
}
