import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Widget from '../Widget';
import usePageTitle from '../../hooks/usePageTitle';
import { useNotifications } from '../../context/NotificationContext';
import { IconBrandGithub, IconBrandLinkedin, IconBrandX, IconLoader2, IconMail } from '@tabler/icons-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    Icon: IconBrandGithub,
    color: '#1a3870',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    Icon: IconBrandLinkedin,
    color: '#0a66c2',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    Icon: IconBrandX,
    color: '#000000',
  },
];

export default function ContactWidget() {
  usePageTitle('contact', 'Contact');
  const { notify } = useNotifications();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    return errors;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/contact`, formData);

      if (response.data.success) {
        setSubmitted(true);
        notify('Message submitted successfully.', { duration: 4000 });
        setFormData({ name: '', email: '', message: '' });
        setValidationErrors({});

        // Reset success state after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        const message = response.data.error || 'Failed to send message';
        setError(message);
        notify(message, { duration: 4000 });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const message = err.response?.data?.error || err.message || 'Failed to send message';
      setError(message);
      notify(message, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' });
    setValidationErrors({});
    setError(null);
    setSubmitted(false);
  };

  return (
    <Widget
      id="contact"
      title="Contact"
      icon={IconMail}
      iconBg="#60b8f0"
      defaultPosition={{ x: 200, y: 400 }}
      width={350}
    >
      <AnimatePresence mode="wait">
        {/* Form View */}
        {!submitted && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name Field */}
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{
                    color: '#6b92b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full px-3 py-2 rounded text-sm transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: validationErrors.name
                      ? '1px solid #e050a0'
                      : '0.5px solid rgba(255, 255, 255, 0.6)',
                    color: '#1a3870',
                  }}
                />
                {validationErrors.name && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: '#e050a0' }}
                  >
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{
                    color: '#6b92b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 rounded text-sm transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: validationErrors.email
                      ? '1px solid #e050a0'
                      : '0.5px solid rgba(255, 255, 255, 0.6)',
                    color: '#1a3870',
                  }}
                />
                {validationErrors.email && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: '#e050a0' }}
                  >
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{
                    color: '#6b92b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message here..."
                  rows="4"
                  className="w-full px-3 py-2 rounded text-sm transition-all resize-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: validationErrors.message
                      ? '1px solid #e050a0'
                      : '0.5px solid rgba(255, 255, 255, 0.6)',
                    color: '#1a3870',
                  }}
                />
                {validationErrors.message && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: '#e050a0' }}
                  >
                    {validationErrors.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="p-2 rounded text-xs text-center"
                  style={{
                    background: 'rgba(240, 80, 160, 0.1)',
                    color: '#e050a0',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded font-semibold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{
                  background: loading
                    ? 'rgba(26, 110, 245, 0.5)'
                    : 'rgba(26, 110, 245, 0.8)',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <IconLoader2 size={14} className="animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>

            {/* Social Links */}
            <div className="mt-4 pt-4 border-t border-white border-opacity-20">
              <p
                className="text-xs font-semibold block mb-3 text-center"
                style={{
                  color: '#6b92b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Connect
              </p>
              <div className="flex gap-2 justify-center">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:scale-110"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '0.5px solid rgba(255, 255, 255, 0.4)',
                      color: link.color,
                    }}
                    title={link.name}
                  >
                    <link.Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {submitted && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            {/* Checkmark Animation */}
            <motion.div
              className="mb-4 flex items-center justify-center"
              style={{ fontSize: '64px' }}
            >
              <motion.svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Circle */}
                <motion.circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="#40c8b8"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
                {/* Checkmark */}
                <motion.path
                  d="M20 32L28 40L44 24"
                  stroke="#40c8b8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
                />
              </motion.svg>
            </motion.div>

            {/* Success Message */}
            <h3
              className="font-semibold mb-2"
              style={{
                fontSize: '16px',
                color: '#40c8b8',
              }}
            >
              Message Sent!
            </h3>
            <p
              className="text-xs"
              style={{ color: '#6b92b8' }}
            >
              Thank you for reaching out. I'll get back to you soon.
            </p>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-1 rounded text-xs font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#1a6ef5',
                border: '0.5px solid rgba(255, 255, 255, 0.4)',
              }}
            >
              Send Another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Widget>
  );
}
