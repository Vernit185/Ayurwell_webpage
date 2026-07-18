import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Real Pages
import MainChat from './components/chat/MainChat';

// Premium Pages & Layout
import { Layout } from './Layout';
import { Doctors } from './pages/Doctors';
import { KnowledgeHub } from './pages/KnowledgeHub';
import { Products } from './pages/Products';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            {/* Premium Pages with Navbar */}
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/doctors" replace />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/knowledge-hub" element={<KnowledgeHub />} />
              <Route path="/products" element={<Products />} />
              <Route path="/chatbot" element={<MainChat />} />
            </Route>

            {/* Embeddable Chatbot Route (No Sidebar/Layout) */}
            <Route path="/embed/chat/:id" element={<MainChat />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </Router>
      <Toaster position="bottom-right" richColors />
    </ThemeProvider>
  );
}
