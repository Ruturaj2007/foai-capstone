import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Programs from './components/Programs';
import Admissions from './components/Admissions';
import CampusLife from './components/CampusLife';
import Footer from './components/Footer';

// Admin Imports
import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './admin/Login';
import DashboardLayout from './admin/DashboardLayout';
import Overview from './admin/Overview';
import AllTickets from './admin/AllTickets';
import Escalations from './admin/Escalations';
import FAQPerformance from './admin/FAQPerformance';

const PublicSite = () => (
  <div className="min-h-screen bg-dark text-zinc-100 font-sans overflow-x-hidden">
    <Navbar />
    <main>
      <Hero />
      <Programs />
      <Admissions />
      <CampusLife />
    </main>
    <Footer />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  return children;
};

// Required wrapper to ensure useAuth hook is available inside Routes
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/admin/login" element={<Login />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="tickets" element={<AllTickets />} />
        <Route path="escalations" element={<Escalations />} />
        <Route path="faqs" element={<FAQPerformance />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
