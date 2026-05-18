import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconEdit, IconInbox, IconLoader2, IconLogout, IconStarFilled, IconTrash } from '@tabler/icons-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, isDangerous }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)' }}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 z-50 p-6 rounded-xl"
            style={{
              transform: 'translate(-50%, -50%)',
              background: 'rgba(230, 242, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '0.5px solid rgba(255, 255, 255, 0.9)',
              width: '90%',
              maxWidth: '400px',
            }}
          >
            <h3
              className="font-semibold mb-2"
              style={{
                fontSize: '18px',
                color: '#1a3870',
              }}
            >
              {title}
            </h3>
            <p
              className="text-sm mb-6"
              style={{
                color: '#6b92b8',
              }}
            >
              {message}
            </p>

            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  color: '#1a3870',
                  border: '0.5px solid rgba(255, 255, 255, 0.6)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 text-white"
                style={{
                  background: isDangerous
                    ? 'linear-gradient(135deg, #e050a0 0%, #c02880 100%)'
                    : 'linear-gradient(135deg, #1a6ef5 0%, #1a3870 100%)',
                }}
              >
                {isDangerous ? 'Delete' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    liveUrl: '',
    repoUrl: '',
    thumbnail: '',
    featured: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    fetchProjects();
  }, [token, navigate]);

  const getAuthHeader = () => ({
    Authorization: `Bearer ${token}`,
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/projects`);

      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTechStackChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      techStack: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editingId) {
        // Update project
        const response = await axios.put(`${API_URL}/projects/${editingId}`, payload, {
          headers: getAuthHeader(),
        });

        if (response.data.success) {
          setProjects((prev) =>
            prev.map((p) => (p._id === editingId ? response.data.data : p))
          );
          resetForm();
          setError(null);
        }
      } else {
        // Create project
        const response = await axios.post(`${API_URL}/projects`, payload, {
          headers: getAuthHeader(),
        });

        if (response.data.success) {
          setProjects((prev) => [response.data.data, ...prev]);
          resetForm();
          setError(null);
        }
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.error || 'Failed to save project');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      techStack: (project.techStack || []).join(', '),
      liveUrl: project.liveUrl || '',
      repoUrl: project.repoUrl || '',
      thumbnail: project.thumbnail || '',
      featured: project.featured || false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (project) => {
    setDeleteConfirm(project);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const response = await axios.delete(
        `${API_URL}/projects/${deleteConfirm._id}`,
        {
          headers: getAuthHeader(),
        }
      );

      if (response.data.success) {
        setProjects((prev) => prev.filter((p) => p._id !== deleteConfirm._id));
        setDeleteConfirm(null);
        setError(null);
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.response?.data?.error || 'Failed to delete project');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      techStack: '',
      liveUrl: '',
      repoUrl: '',
      thumbnail: '',
      featured: false,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login', { replace: true });
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: 'linear-gradient(135deg, #c8d8ee 0%, #d8e6f5 100%)',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8 flex items-center justify-between"
      >
        <div>
          <h1
            className="font-bold"
            style={{
              fontSize: '36px',
              color: '#1a3870',
            }}
          >
            Admin Dashboard
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#6b92b8',
              marginTop: '4px',
            }}
          >
            Manage your portfolio projects
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
          style={{
            background: 'rgba(224, 80, 160, 0.15)',
            color: '#e050a0',
            border: '0.5px solid rgba(224, 80, 160, 0.3)',
          }}
        >
          <IconLogout size={16} className="mr-2 inline-block" />
          Logout
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Add/Edit Project Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl"
          style={{
            background: 'rgba(230, 242, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '0.5px solid rgba(255, 255, 255, 0.9)',
          }}
        >
          <h2
            className="font-semibold mb-6"
            style={{
              fontSize: '20px',
              color: '#1a3870',
            }}
          >
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: '#6b92b8' }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '0.5px solid rgba(255, 255, 255, 0.8)',
                    color: '#1a3870',
                  }}
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: '#6b92b8' }}>
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleTechStackChange}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '0.5px solid rgba(255, 255, 255, 0.8)',
                    color: '#1a3870',
                  }}
                />
              </div>

              {/* Live URL */}
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: '#6b92b8' }}>
                  Live URL
                </label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '0.5px solid rgba(255, 255, 255, 0.8)',
                    color: '#1a3870',
                  }}
                />
              </div>

              {/* Repo URL */}
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: '#6b92b8' }}>
                  Repository URL
                </label>
                <input
                  type="url"
                  name="repoUrl"
                  value={formData.repoUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/user/repo"
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '0.5px solid rgba(255, 255, 255, 0.8)',
                    color: '#1a3870',
                  }}
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: '#6b92b8' }}>
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '0.5px solid rgba(255, 255, 255, 0.8)',
                    color: '#1a3870',
                  }}
                />
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold" style={{ color: '#6b92b8' }}>
                  Featured
                </label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: '#6b92b8' }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Project description..."
                rows="3"
                className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  border: '0.5px solid rgba(255, 255, 255, 0.8)',
                  color: '#1a3870',
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="p-3 rounded-lg text-xs"
                style={{
                  background: 'rgba(240, 80, 160, 0.15)',
                  color: '#e050a0',
                }}
              >
                {error}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={formSubmitting}
                className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all hover:scale-105 disabled:opacity-50 text-white"
                style={{
                  background: 'linear-gradient(135deg, #1a6ef5 0%, #1a3870 100%)',
                }}
              >
                {formSubmitting ? (
                  <>
                    <IconLoader2 size={16} className="mr-2 inline-block animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  'Update Project'
                ) : (
                  'Create Project'
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    color: '#1a3870',
                    border: '0.5px solid rgba(255, 255, 255, 0.6)',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl"
          style={{
            background: 'rgba(230, 242, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '0.5px solid rgba(255, 255, 255, 0.9)',
          }}
        >
          <h2
            className="font-semibold mb-6"
            style={{
              fontSize: '20px',
              color: '#1a3870',
            }}
          >
            Your Projects ({projects.length})
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg animate-pulse"
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    height: '100px',
                  }}
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div
              className="p-8 rounded-lg text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#6b92b8',
              }}
            >
              <IconInbox size={30} className="mx-auto mb-2" />
              <p>No projects yet. Create your first one above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    border: '0.5px solid rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3
                        className="font-semibold"
                        style={{
                          fontSize: '14px',
                          color: '#1a3870',
                        }}
                      >
                        {project.title}
                        {project.featured && (
                          <IconStarFilled size={12} className="ml-2 inline-block" style={{ color: '#ffd700' }} />
                        )}
                      </h3>
                      <p
                        className="text-xs mt-1"
                        style={{
                          color: '#6b92b8',
                        }}
                      >
                        {project.description?.substring(0, 100)}...
                      </p>
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                background: 'rgba(26, 110, 245, 0.15)',
                                color: '#1a6ef5',
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(project)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-110"
                        style={{
                          background: 'rgba(26, 110, 245, 0.2)',
                          color: '#1a6ef5',
                        }}
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(project)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-110"
                        style={{
                          background: 'rgba(224, 80, 160, 0.2)',
                          color: '#e050a0',
                        }}
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Project?"
        message={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        isDangerous={true}
      />
    </div>
  );
}
