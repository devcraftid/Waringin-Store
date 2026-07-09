import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, Bell, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, profile } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const navCategories = [
    { name: 'Kemeja Pria', slug: 'kemeja' },
    { name: 'Sepatu Sneaker', slug: 'sepatu' },
    { name: 'Laptop Gaming', slug: 'laptop' },
    { name: 'Skincare', slug: 'skincare' },
    { name: 'Tas Wanita', slug: 'tas' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Banner */}
      <div className="bg-primary text-white text-xs py-1.5 px-4 flex justify-between items-center hidden md:flex">
        <div className="flex gap-4">
          <Link to="/seller" className="hover:text-gray-200">Seller Centre</Link>
          <a href="#download-app" className="hover:text-gray-200">Download</a>
          <div className="flex items-center gap-2">
            <span>Ikuti kami di</span>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-gray-200">FB</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-gray-200">IG</a>
          </div>
        </div>
        <div className="flex gap-4">
          <Link to="/profile/notifications" className="flex items-center gap-1 hover:text-gray-200"><Bell size={14}/> Notifikasi</Link>
          <Link to="/help" className="flex items-center gap-1 hover:text-gray-200">Bantuan</Link>
          <span className="flex items-center gap-1">Bahasa Indonesia</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-primary shrink-0">
            <img src="/logo.png" alt="Waringin Store Logo" className="w-14 h-14 object-contain rounded-lg" />
            <span className="text-xl md:text-2xl font-bold tracking-tight text-gray-800">Waringin Store</span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:block flex-1 max-w-3xl">
            <form onSubmit={handleSearch} className="flex w-full relative">
              <input 
                type="text" 
                placeholder="Cari produk, toko, atau kategori..." 
                className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute right-1 top-1 bottom-1 bg-primary text-white px-4 rounded-md hover:bg-primary-hover transition flex items-center justify-center">
                <Search size={18} />
              </button>
            </form>
            {/* Quick Links */}
            <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
              {navCategories.map(cat => (
                <Link key={cat.slug} to={`/?category=${cat.slug}`} className="hover:text-primary">{cat.name}</Link>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            {/* Cart Icon */}
            <Link to="/cart" className="relative text-gray-700 hover:text-primary transition">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Desktop Auth Links */}
            <div className="hidden md:flex items-center gap-3 border-l pl-6 border-gray-300">
              {user ? (
                <Link to={profile?.role === 'admin' ? '/admin' : profile?.role === 'seller' ? '/seller' : '/profile'} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {profile?.full_name?.charAt(0).toUpperCase() || <User size={16} />}
                  </div>
                  <span className="max-w-[100px] truncate">{profile?.full_name || 'Pengguna'}</span>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="text-sm font-medium text-gray-700 hover:text-primary transition">Daftar</Link>
                  <Link to="/login" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition">
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden text-gray-700 hover:text-primary"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 absolute w-full shadow-lg">
          <div className="p-4 space-y-4">
            <form onSubmit={handleSearch} className="flex w-full relative">
              <input 
                type="text" 
                placeholder="Cari produk..." 
                className="w-full pl-4 pr-12 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute right-1 top-1 bottom-1 bg-primary text-white px-3 rounded-md">
                <Search size={16} />
              </button>
            </form>
            
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <Link to="/seller" className="text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Seller Centre</Link>
              {user ? (
                <Link 
                  to={profile?.role === 'admin' ? '/admin' : profile?.role === 'seller' ? '/seller' : '/profile'} 
                  className="flex items-center gap-2 text-primary font-bold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={18} /> Profil Saya ({profile?.full_name || 'Pengguna'})
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="bg-primary text-white text-center py-2 rounded font-bold" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="bg-gray-100 text-gray-700 text-center py-2 rounded font-bold" onClick={() => setIsMobileMenuOpen(false)}>Daftar</Link>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 mb-2 font-bold uppercase">Kategori Populer</p>
              <div className="flex flex-wrap gap-2">
                {navCategories.map(cat => (
                  <Link 
                    key={cat.slug} 
                    to={`/?category=${cat.slug}`} 
                    className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-600 border border-gray-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Temporary Logo Icon Component since ShoppingBag from lucide-react was missing in the import
const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
    <path d="M3 6h18"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

export default Navbar;
