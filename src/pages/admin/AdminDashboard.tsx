import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Users, Store, LayoutDashboard, Database, ShieldCheck, Menu, X } from 'lucide-react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // By default true on desktop, false on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  // Add event listener for window resize to handle sidebar state gracefully
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Manajemen Pengguna', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Manajemen Toko', path: '/admin/shops', icon: <Store size={20} /> },
    { name: 'Kategori Produk', path: '/admin/categories', icon: <Database size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 h-full bg-gray-900 text-gray-300 shadow-2xl
        transition-all duration-300 ease-in-out flex flex-col shrink-0
        ${isSidebarOpen ? 'w-64 translate-x-0 md:ml-0' : 'w-64 -translate-x-full md:-ml-64'}
      `}>
        <div className="flex items-center justify-between p-6 shrink-0 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <ShieldCheck size={32} className="text-primary" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Admin</h2>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              onClick={() => window.innerWidth <= 768 && setIsSidebarOpen(false)}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                ? 'bg-primary/20 text-primary border border-primary/30 font-medium shadow-sm' 
                : 'hover:bg-gray-800 hover:text-white text-gray-400 border border-transparent'
              }`}
            >
              <div className={`${location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)) ? 'text-primary' : 'text-gray-500 group-hover:text-primary transition-colors'}`}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-4 md:px-8 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="text-gray-500 hover:text-primary transition p-2 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm border border-gray-200"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight hidden sm:block">
              Sistem Kontrol Utama
            </h1>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gray-800">{profile?.full_name || 'Administrator'}</span>
              <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-0.5">Admin Role</span>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 p-2 md:px-4 md:py-2 rounded-lg transition-all duration-200 font-medium shadow-sm"
            >
              <LogOut size={18} />
              <span className="text-sm hidden md:block">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
