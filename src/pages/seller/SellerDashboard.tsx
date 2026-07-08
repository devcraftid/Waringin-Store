import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { LogOut, Package, ShoppingBag, DollarSign, Settings, Plus, Menu, X } from 'lucide-react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';

const SellerDashboard = () => {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // By default true on desktop, false on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

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

  useEffect(() => {
    const fetchShop = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .eq('owner_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching shop:', error);
        }

        if (!data) {
          navigate('/seller/setup', { replace: true });
        } else {
          setShop(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  if (!shop) return null;

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
        fixed md:relative z-50 h-full bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-100
        transition-all duration-300 ease-in-out flex flex-col shrink-0
        ${isSidebarOpen ? 'w-64 translate-x-0 md:ml-0' : 'w-64 -translate-x-full md:-ml-64'}
      `}>
        <div className="flex items-center justify-between p-6 shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-3 text-primary">
            <ShoppingBag size={28} strokeWidth={2.5} /> 
            <h2 className="text-xl font-bold tracking-tight">Seller Centre</h2>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-primary transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <Link 
            to="/seller" 
            onClick={() => window.innerWidth <= 768 && setIsSidebarOpen(false)}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
              location.pathname === '/seller' 
              ? 'bg-primary text-white font-medium shadow-md' 
              : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Package size={20} className={location.pathname === '/seller' ? 'text-white' : 'text-gray-400 group-hover:text-primary transition-colors'} /> 
            Dashboard
          </Link>
          <Link 
            to="/seller/products" 
            onClick={() => window.innerWidth <= 768 && setIsSidebarOpen(false)}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
              location.pathname.includes('/seller/products') 
              ? 'bg-primary text-white font-medium shadow-md' 
              : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <ShoppingBag size={20} className={location.pathname.includes('/seller/products') ? 'text-white' : 'text-gray-400 group-hover:text-primary transition-colors'} /> 
            Produk Saya
          </Link>
          <Link 
            to="/seller/orders" 
            onClick={() => window.innerWidth <= 768 && setIsSidebarOpen(false)}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
              location.pathname.includes('/seller/orders') 
              ? 'bg-primary text-white font-medium shadow-md' 
              : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Package size={20} className={location.pathname.includes('/seller/orders') ? 'text-white' : 'text-gray-400 group-hover:text-primary transition-colors'} /> 
            Pesanan
          </Link>
          <Link 
            to="/seller/finance" 
            onClick={() => window.innerWidth <= 768 && setIsSidebarOpen(false)}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
              location.pathname.includes('/seller/finance') 
              ? 'bg-primary text-white font-medium shadow-md' 
              : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <DollarSign size={20} className={location.pathname.includes('/seller/finance') ? 'text-white' : 'text-gray-400 group-hover:text-primary transition-colors'} /> 
            Keuangan
          </Link>
          <Link 
            to="/seller/settings" 
            onClick={() => window.innerWidth <= 768 && setIsSidebarOpen(false)}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
              location.pathname.includes('/seller/settings') 
              ? 'bg-primary text-white font-medium shadow-md' 
              : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Settings size={20} className={location.pathname.includes('/seller/settings') ? 'text-white' : 'text-gray-400 group-hover:text-primary transition-colors'} /> 
            Pengaturan Toko
          </Link>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 py-4 px-4 md:px-8 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="text-gray-500 hover:text-primary transition p-2 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm border border-gray-200"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-hover rounded-lg text-white flex items-center justify-center text-sm font-bold shadow-md">
                {shop.name.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight hidden sm:block">
                {shop.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex flex-col items-end hidden md:flex">
              <span className="text-sm font-bold text-gray-800">{profile?.full_name}</span>
              <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-0.5">Pemilik Toko</span>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 md:px-4 md:py-2 rounded-lg transition-all duration-200 font-medium"
            >
              <LogOut size={18} />
              <span className="text-sm hidden md:block">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ shop }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
