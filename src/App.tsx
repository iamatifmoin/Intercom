import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/login/LoginPage';
import AgentDashboard from './components/dashboard/AgentDashboard';
import Home from './pages/Home';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { initializeStorage } from './utils/storage';
import ChatWidget from './components/chat/ChatWidget';

// Protected route component
const ProtectedRoute: React.FC<{ 
  element: React.ReactNode;
  role?: 'agent' | 'user';
}> = ({ element, role }) => {
  const { auth } = useAuth();
  
  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && auth.currentUser?.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  return <>{element}</>;
};

const AppRoutes: React.FC = () => {
  const { auth } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute 
              element={<AgentDashboard />} 
              role="agent" 
            />
          } 
        />
        <Route path="/" element={<Home />} />
      </Routes>
      
      {/* Show chat widget for logged-in users who are not agents */}
      {auth.isLoggedIn && auth.currentUser?.role === 'user' && (
        <ChatWidget />
      )}
    </Router>
  );
};

function App() {
  // Initialize storage with demo data
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <AuthProvider>
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;