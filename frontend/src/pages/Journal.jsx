import { useState, useEffect, useCallback } from 'react';
import api, { getErrorMessage } from '../services/api';
import JournalCard from '../components/journal/JournalCard';
import JournalForm from '../components/journal/JournalForm';
import Modal from '../components/common/Modal';
import { LoadingState, EmptyState, ErrorState } from '../components/common/States';
import './PageLayouts.css';

export default function Journal() {
  const [journals, setJournals] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchJournals = useCallback(async () => {
    setStatus('loading');
    try {
      const { data } = await api.get('/journals');
      setJournals(data.journals);
      setStatus('ready');
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  const openNew = () => {
    setEditingJournal(null);
    setFormOpen(true);
  };

  const openEdit = (journal) => {
    setEditingJournal(journal);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editingJournal) {
        const { data } = await api.put(`/journals/${editingJournal._id}`, payload);
        setJournals((prev) => prev.map((j) => (j._id === data.journal._id ? data.journal : j)));
      } else {
        const { data } = await api.post('/journals', payload);
        setJournals((prev) => [data.journal, ...prev]);
      }
      setFormOpen(false);
      setEditingJournal(null);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await api.delete(`/journals/${pendingDelete._id}`);
      setJournals((prev) => prev.filter((j) => j._id !== pendingDelete._id));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="container page">
      <div className="page-header">
        <div>
          <h1>Journal</h1>
          <p className="muted">A private space for the thoughts that need more room.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNew}>
          New entry
        </button>
      </div>

      {status === 'loading' && <LoadingState label="Loading your entries…" />}
      {status === 'error' && <ErrorState message={errorMsg} onRetry={fetchJournals} />}
      {status === 'ready' && journals.length === 0 && (
        <EmptyState
          title="No journal entries yet"
          message="Write your first entry — there's no right way to start."
          action={
            <button type="button" className="btn btn-primary btn-sm" onClick={openNew}>
              Write your first entry
            </button>
          }
        />
      )}

      {status === 'ready' && journals.length > 0 && (
        <div className="entry-list">
          {journals.map((journal) => (
            <JournalCard
              key={journal._id}
              journal={journal}
              onEdit={openEdit}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <Modal
          title={editingJournal ? 'Edit entry' : 'New journal entry'}
          onClose={() => setFormOpen(false)}
        >
          <JournalForm
            initial={editingJournal}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
          />
        </Modal>
      )}

      {pendingDelete && (
        <Modal title="Delete this entry?" onClose={() => setPendingDelete(null)}>
          <p>This can't be undone. "{pendingDelete.title}" will be permanently removed.</p>
          <div className="row" style={{ gap: 'var(--sp-3)' }}>
            <button type="button" className="btn btn-danger" onClick={confirmDelete}>
              Delete entry
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
