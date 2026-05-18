import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import ToasterProvider from './components/ToasterProvider';
import { useEffect } from 'react';

export default function App() {
  // Keyboard shortcuts: '/' or Cmd/Ctrl+/ to toggle start menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Meta key (Windows/Cmd) or forward slash
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('toggleStartMenu'));
      } else if (e.key === '/') {
        // Only trigger on '/' if not in an input field
        if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('toggleStartMenu'));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <ToasterProvider />
      <BrowserRouter>
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />

          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Route (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
