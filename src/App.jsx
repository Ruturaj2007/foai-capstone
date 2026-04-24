import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Programs from './components/Programs';
import Admissions from './components/Admissions';
import CampusLife from './components/CampusLife';
import Footer from './components/Footer';

// Main website auth
import { UserProvider } from './auth/UserContext';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';

// Admin Imports (untouched)
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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />

      {/* Main website auth */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />

      {/* Admin (untouched — hardcoded creds) */}
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
    <UserProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </UserProvider>
  );
}

export default App;
