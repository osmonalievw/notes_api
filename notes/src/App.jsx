import { Edit, FileText, Plus, Save, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import './App.css'

// This should be the address of the running API
const API_BASE = 'http://127.0.0.1:5000';

export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editNote, setEditNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_BASE}/notes`);
      const data = await response.json();
      if (data.success) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new note
  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });
      
      if (response.ok) {
        await fetchNotes();
        setNewNote({ title: '', content: '' });
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // Update note
  const updateNote = async (id) => {
    if (!editNote.title.trim() || !editNote.content.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editNote),
      });
      
      if (response.ok) {
        await fetchNotes();
        setEditingId(null);
        setEditNote({ title: '', content: '' });
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Start editing
  const startEditing = (note) => {
    setEditingId(note.id);
    setEditNote({ title: note.title, content: note.content });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditNote({ title: '', content: '' });
  };

  // Cancel creating
  const cancelCreating = () => {
    setIsCreating(false);
    setNewNote({ title: '', content: '' });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading your notes...</div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <FileText className="header-icon" />
            <h1 className="header-title">My Notes</h1>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary"
          >
            <Plus size={20} />
            <span>New Note</span>
          </button>
        </div>
      </header>

      <div className="main-content">
        {/* Create Note Form */}
        {isCreating && (
          <div className="create-form">
            <div className="form-header">
              <h2 className="form-title">Create New Note</h2>
              <button
                onClick={cancelCreating}
                className="btn-close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="form-body">
              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="input-field"
              />
              <textarea
                placeholder="Write your note here..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows="6"
                className="textarea-field"
              />
              <div className="form-actions">
                <button
                  onClick={createNote}
                  className="btn-primary"
                >
                  <Save size={16} />
                  <span>Save Note</span>
                </button>
                <button
                  onClick={cancelCreating}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="empty-state">
            <FileText size={64} className="empty-icon" />
            <h3 className="empty-title">No notes yet</h3>
            <p className="empty-description">Create your first note to get started!</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note.id} className="note-card">
                {editingId === note.id ? (
                  // Edit Mode
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editNote.title}
                      onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                      className="edit-input"
                    />
                    <textarea
                      value={editNote.content}
                      onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                      rows="6"
                      className="edit-textarea"
                    />
                    <div className="edit-actions">
                      <button
                        onClick={() => updateNote(note.id)}
                        className="btn-small btn-primary"
                      >
                        <Save size={16} />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="btn-small btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="note-content">
                    <div className="note-header">
                      <h3 className="note-title">{note.title}</h3>
                      <div className="note-actions">
                        <button
                          onClick={() => startEditing(note)}
                          className="btn-icon"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="btn-icon btn-danger"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="note-text">{note.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}