import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { LogOut, User, MapPin, ShoppingBag, Heart, Package, Clock, Truck, CheckCircle, XCircle, Trash2, Plus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'address'>('profile');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', full_name: '', phone: '', full_address: '', city: '', postal_code: '' });

  useEffect(() => {
    if (user) {
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'wishlist') fetchWishlists();
      if (activeTab === 'address') fetchAddresses();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, shops(name), order_items(quantity, price_at_time, products(title, product_images(image_url)))')
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (error) { console.error('Error fetching orders:', error); }
    finally { setLoading(false); }
  };

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id, products(id, title, slug, price, product_images(image_url))')
        .eq('customer_id', user?.id);
      if (error) throw error;
      setWishlists(data || []);
    } catch (error) { console.error('Error fetching wishlists:', error); }
    finally { setLoading(false); }
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('customer_id', user?.id)
        .order('is_primary', { ascending: false });
      if (error) throw error;
      setAddresses(data || []);
    } catch (error) { console.error('Error fetching addresses:', error); }
    finally { setLoading(false); }
  };

  const removeWishlist = async (id: string) => {
    try {
      await supabase.from('wishlists').delete().eq('id', id);
      setWishlists(prev => prev.filter(w => w.id !== id));
    } catch (error) { console.error('Error deleting wishlist:', error); }
  };

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .insert([{ ...newAddress, customer_id: user?.id, is_primary: addresses.length === 0 }])
        .select()
        .single();
      
      if (error) throw error;
      setAddresses([...addresses, data]);
      setShowAddressForm(false);
      setNewAddress({ label: '', full_name: '', phone: '', full_address: '', city: '', postal_code: '' });
    } catch (error) { console.error('Error saving address:', error); }
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
      case 'cancelled': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold"><XCircle size={12} /> Batal</span>;
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
                {[
                  { id: 'profile', icon: User, label: 'Akun Saya' },
                  { id: 'orders', icon: ShoppingBag, label: 'Pesanan Saya' },
                  { id: 'wishlist', icon: Heart, label: 'Wishlist' },
                  { id: 'address', icon: MapPin, label: 'Alamat' }
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 p-2 rounded transition font-medium ${activeTab === item.id ? 'text-primary bg-primary/5' : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`}
                  >
                    <item.icon size={18} /> {item.label}
                  </button>
                ))}
                
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <>
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Profil Saya</h2>
                    <p className="text-sm text-gray-500">Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun</p>
                  </div>
                  <div className="p-6">
                    {/* Simplified for brevity - reuse previous form */}
                    <div className="max-w-2xl flex flex-col gap-6">
                      <div className="flex items-center">
                        <label className="w-32 text-right pr-6 text-sm text-gray-600 font-medium">Email</label>
                        <p className="text-sm font-medium">{user?.email}</p>
                      </div>
                      <div className="flex items-center">
                        <label className="w-32 text-right pr-6 text-sm text-gray-600 font-medium">Nama Lengkap</label>
                        <input type="text" defaultValue={profile?.full_name || ''} className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary text-sm" />
                      </div>
                      <div className="flex items-center pt-4">
                        <div className="w-32 pr-6"></div>
                        <button className="bg-primary text-white px-6 py-2 rounded font-medium hover:bg-primary-hover">Simpan</button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <>
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Pesanan Saya</h2>
                  </div>
                  <div className="p-6 bg-gray-50/50">
                    {loading ? <div className="text-center py-10">Memuat...</div> : orders.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">Belum ada pesanan.</div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map(order => (
                          <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b flex justify-between">
                              <span className="font-bold text-sm">{order.shops?.name}</span>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="p-4">
                              {order.order_items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 mb-2">
                                  <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                                    {item.products?.product_images?.[0] && <img src={item.products.product_images[0].image_url} alt="img" className="w-full h-full object-cover rounded" />}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold">{item.products?.title}</h4>
                                    <p className="text-xs text-gray-500">{item.quantity} x Rp {item.price_at_time.toLocaleString('id-ID')}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <>
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Wishlist Saya</h2>
                  </div>
                  <div className="p-6">
                    {loading ? <div className="text-center py-10">Memuat...</div> : wishlists.length === 0 ? (
                      <div className="text-center py-16 flex flex-col items-center">
                        <Heart size={48} className="text-gray-300 mb-4" />
                        <h3 className="font-bold text-lg text-gray-700">Wishlist Kosong</h3>
                        <p className="text-gray-500 text-sm">Anda belum menambahkan produk ke wishlist.</p>
                        <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold">Mulai Belanja</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {wishlists.map(w => (
                          <div key={w.id} className="border border-gray-200 rounded-xl overflow-hidden group">
                            <Link to={`/product/${w.products.slug}`} className="block relative aspect-square bg-gray-100">
                              {w.products.product_images?.[0] ? (
                                <img src={w.products.product_images[0].image_url} alt={w.products.title} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />
                              )}
                            </Link>
                            <div className="p-3">
                              <h3 className="text-sm font-medium line-clamp-2 mb-1">{w.products.title}</h3>
                              <p className="font-bold text-primary mb-3">Rp {w.products.price.toLocaleString('id-ID')}</p>
                              <button 
                                onClick={() => removeWishlist(w.id)}
                                className="w-full flex justify-center items-center gap-2 py-1.5 border border-red-200 text-red-500 rounded text-xs font-bold hover:bg-red-50 transition"
                              >
                                <Trash2 size={14} /> Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Address Tab */}
              {activeTab === 'address' && (
                <>
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Alamat Saya</h2>
                    {!showAddressForm && (
                      <button 
                        onClick={() => setShowAddressForm(true)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-hover text-sm"
                      >
                        <Plus size={16} /> Tambah Alamat
                      </button>
                    )}
                  </div>
                  
                  <div className="p-6">
                    {showAddressForm ? (
                      <form onSubmit={saveAddress} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="font-bold mb-4">Tambah Alamat Baru</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Label (Cth: Rumah, Kantor)</label>
                            <input required type="text" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary" />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Nama Penerima</label>
                            <input required type="text" value={newAddress.full_name} onChange={e => setNewAddress({...newAddress, full_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary" />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Nomor Telepon</label>
                            <input required type="text" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary" />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Kota & Kode Pos</label>
                            <div className="flex gap-2">
                              <input required type="text" placeholder="Kota" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary" />
                              <input required type="text" placeholder="Kode Pos" value={newAddress.postal_code} onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})} className="w-24 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary" />
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm text-gray-600 mb-1">Alamat Lengkap</label>
                            <textarea required rows={3} value={newAddress.full_address} onChange={e => setNewAddress({...newAddress, full_address: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"></textarea>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100">Batal</button>
                          <button type="submit" className="px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-primary-hover">Simpan Alamat</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        {loading ? <div className="text-center py-10">Memuat...</div> : addresses.length === 0 ? (
                          <div className="text-center py-16 flex flex-col items-center">
                            <MapPin size={48} className="text-gray-300 mb-4" />
                            <h3 className="font-bold text-lg text-gray-700">Belum Ada Alamat</h3>
                            <p className="text-gray-500 text-sm">Tambahkan alamat pengiriman untuk mempermudah checkout.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {addresses.map(addr => (
                              <div key={addr.id} className={`border p-4 rounded-lg flex justify-between items-start ${addr.is_primary ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-gray-800">{addr.full_name}</h4>
                                    <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">{addr.label}</span>
                                    {addr.is_primary && <span className="text-xs text-primary px-2 py-0.5 bg-primary/10 rounded-full font-bold">Utama</span>}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{addr.phone}</p>
                                  <p className="text-sm text-gray-600">{addr.full_address}</p>
                                  <p className="text-sm text-gray-600">{addr.city}, {addr.postal_code}</p>
                                </div>
                                <div className="flex gap-3">
                                  <button className="text-sm font-medium text-primary hover:underline">Ubah</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
