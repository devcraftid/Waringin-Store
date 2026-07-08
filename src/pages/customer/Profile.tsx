import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, MapPin, ShoppingBag, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 line-clamp-1">{profile?.full_name || 'Pengguna'}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                <a href="#" className="flex items-center gap-3 text-primary font-medium p-2 bg-primary/5 rounded">
                  <User size={18} /> Akun Saya
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-primary p-2 transition">
                  <ShoppingBag size={18} /> Pesanan Saya
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-primary p-2 transition">
                  <Heart size={18} /> Wishlist
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-primary p-2 transition">
                  <MapPin size={18} /> Alamat
                </a>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 text-red-500 hover:bg-red-50 p-2 rounded transition mt-4"
                >
                  <LogOut size={18} /> Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Profil Saya</h2>
                <p className="text-sm text-gray-500">Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun</p>
              </div>
              
              <div className="p-6">
                <div className="max-w-2xl flex flex-col-reverse md:flex-row gap-8">
                  {/* Form */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center">
                      <label className="w-32 text-right pr-6 text-sm text-gray-600 font-medium">Email</label>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="w-32 text-right pr-6 text-sm text-gray-600 font-medium">Nama Lengkap</label>
                      <div className="flex-1">
                        <input 
                          type="text" 
                          defaultValue={profile?.full_name || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="w-32 text-right pr-6 text-sm text-gray-600 font-medium">Nomor Telepon</label>
                      <div className="flex-1 flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Belum diatur"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary text-sm bg-gray-50"
                          disabled
                        />
                        <button className="text-sm text-blue-600 hover:underline whitespace-nowrap">Ubah</button>
                      </div>
                    </div>
                    
                    <div className="flex items-center pt-4">
                      <div className="w-32 pr-6"></div>
                      <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-hover transition font-medium">
                        Simpan
                      </button>
                    </div>
                  </div>
                  
                  {/* Avatar Upload */}
                  <div className="w-full md:w-64 flex flex-col items-center justify-start md:border-l border-gray-200 md:pl-8">
                    <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden flex items-center justify-center text-4xl text-gray-400">
                      {profile?.full_name?.charAt(0).toUpperCase() || <User size={48} />}
                    </div>
                    <button className="border border-gray-300 px-4 py-2 text-sm rounded bg-white hover:bg-gray-50 font-medium text-gray-700">
                      Pilih Gambar
                    </button>
                    <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
                      Ukuran gambar: maks. 1 MB<br/>
                      Format gambar: .JPEG, .PNG
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
