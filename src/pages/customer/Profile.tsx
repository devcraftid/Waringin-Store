import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { LogOut, User, MapPin, ShoppingBag, Heart, Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          shops (name),
          order_items (
            quantity,
            price_at_time,
            products (title, product_images (image_url))
          )
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-bold"><Clock size={12} /> Menunggu</span>;
      case 'paid': return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-bold"><Package size={12} /> Dikemas</span>;
      case 'shipped': return <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs font-bold"><Truck size={12} /> Dikirim</span>;
      case 'completed': return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold"><CheckCircle size={12} /> Selesai</span>;
      case 'cancelled': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold"><XCircle size={12} /> Dibatalkan</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4 flex items-center gap-4 border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 line-clamp-1">{profile?.full_name || 'Pengguna'}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 p-2 rounded transition font-medium ${activeTab === 'profile' ? 'text-primary bg-primary/5' : 'text-gray-600 hover:text-primary'}`}
                >
                  <User size={18} /> Akun Saya
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 p-2 rounded transition font-medium ${activeTab === 'orders' ? 'text-primary bg-primary/5' : 'text-gray-600 hover:text-primary'}`}
                >
                  <ShoppingBag size={18} /> Pesanan Saya
                </button>
                <button className="w-full flex items-center gap-3 text-gray-400 p-2 rounded cursor-not-allowed">
                  <Heart size={18} /> Wishlist
                </button>
                <button className="w-full flex items-center gap-3 text-gray-400 p-2 rounded cursor-not-allowed">
                  <MapPin size={18} /> Alamat
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 text-red-500 hover:bg-red-50 p-2 rounded transition mt-4 font-medium"
                >
                  <LogOut size={18} /> Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
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
                          <button className="text-sm text-blue-600 hover:underline whitespace-nowrap font-medium">Ubah</button>
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
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">Pesanan Saya</h2>
                  <p className="text-sm text-gray-500">Pantau status pesanan dan riwayat belanja Anda.</p>
                </div>
                
                <div className="p-6 bg-gray-50/50">
                  {loadingOrders ? (
                    <div className="flex justify-center items-center py-12 text-gray-500 font-medium">Memuat pesanan...</div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-16 text-center">
                      <ShoppingBag size={48} className="text-gray-300 mb-4" />
                      <h3 className="text-lg font-bold text-gray-700">Belum Ada Pesanan</h3>
                      <p className="text-gray-500 text-sm mt-1">Anda belum pernah melakukan pemesanan.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-gray-800 text-sm">{order.shops?.name || 'Toko'}</span>
                              <span className="text-xs text-gray-400 border-l border-gray-300 pl-3">
                                {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </span>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <div className="divide-y divide-gray-100 p-4">
                            {order.order_items.map((item: any, idx: number) => (
                              <div key={idx} className="py-3 first:pt-0 flex gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 shrink-0 overflow-hidden text-gray-300 flex items-center justify-center">
                                  {item.products?.product_images?.[0]?.image_url ? (
                                    <img src={item.products.product_images[0].image_url} alt={item.products.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <Package size={20} />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{item.products?.title}</h4>
                                  <p className="text-xs text-gray-500 mt-1">{item.quantity} x Rp {item.price_at_time.toLocaleString('id-ID')}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-bold text-gray-800 text-sm">Rp {(item.quantity * item.price_at_time).toLocaleString('id-ID')}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="bg-primary/5 px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Total Tagihan:</span>
                            <span className="font-bold text-primary text-lg">Rp {order.total_amount.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
