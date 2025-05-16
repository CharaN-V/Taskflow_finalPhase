import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { TasksPage } from './pages/TasksPage';
import { FilteredTasksPage } from './pages/FilteredTasksPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuthPage } from './pages/AuthPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TaskForm } from './components/TaskForm';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = React.useState(false);
  const { user } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <Sidebar isMobile={false} isOpen={true} onClose={() => {}} />
        </div>
        
        {/* Mobile Sidebar - shown when toggled */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
          </div>
        )}
        <Sidebar isMobile={true} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            onCreateTask={() => setIsTaskFormOpen(true)} 
          />
          
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/:filter" element={<FilteredTasksPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </main>
          
          <TaskForm isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} />
        </div>
      </div>
    </TaskProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;