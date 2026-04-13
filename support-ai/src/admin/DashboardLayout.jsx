import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { fetchTickets } from './utils/api';
import { 
  GraduationCap, LayoutDashboard, Ticket, 
  AlertTriangle, BookOpen, LogOut, Loader2
} from 'lucide-react';

export const DataContext = React.createContext();

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const loadData = async () => {
    try {
      const tickets = await fetchTickets();
      // Ensure tickets exist
      if(tickets && tickets.length > 0) {
        setData(tickets);
        setError(null);
        setLastUpdated(new Date());
      }
    } catch (err) {
      setError('Failed to fetch ticket data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { name: 'All Tickets', path: '/admin/tickets', icon: <Ticket className="w-5 h-5" /> },
    { name: 'Escalations', path: '/admin/escalations', icon: <AlertTriangle className="w-5 h-5" /> },
    { name: 'FAQ Performance', path: '/admin/faqs', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-zinc-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#0D0D0D] border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="bg-scaler-red p-1.5 rounded">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold tracking-tight">Admin Console</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                  isActive 
                    ? 'bg-scaler-red/10 text-scaler-red border border-scaler-red/20' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-[#0A0A0A]">
        <header className="sticky top-0 z-10 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center h-16">
          <div className="text-sm font-medium text-zinc-400">
             Dashboard
          </div>
          <div className="text-xs text-zinc-500 flex items-center gap-2">
            {loading ? <Loader2 className="w-3 h-3 animate-spin"/> : <div className="w-2 h-2 rounded-full bg-green-500" />}
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto">
          {error ? (
             <div className="text-red-400 bg-red-500/10 p-4 border border-red-500/20 rounded-lg">
               {error}
             </div>
          ) : (
            <DataContext.Provider value={{ data, loading }}>
              <Outlet />
            </DataContext.Provider>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
