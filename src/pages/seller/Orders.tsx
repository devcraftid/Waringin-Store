import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Box, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useOutletContext } from 'react-router-dom';

const Orders = () => {
  const { shop } = useOutletContext<{ shop: any }>();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, pending, paid, shipped, completed, cancelled
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (shop) {
      fetchOrders();
    }
  }, [shop]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (!shop) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (full_name, email),
          order_items (
            quantity,
            price_at_time,
            products (title, product_images (image_url))
          )
        `)
        .eq('shop_id', shop.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Gagal memperbarui status pesanan.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o => activeTab === 'all' || o.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-bold"><Clock size={12} /> Menunggu Pembayaran</span>;
      case 'paid': return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-bold"><Package size={12} /> Perlu Dikirim</span>;
      case 'shipped': return <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs font-bold"><Truck size={12} /> Dikirim</span>;
      case 'completed': return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold"><CheckCircle size={12} /> Selesai</span>;
      case 'cancelled': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold"><XCircle size={12} /> Dibatalkan</span>;
      default: return null;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Pesanan Pelanggan</h2>
        <p className="text-gray-500 mt-1">Kelola dan pantau semua pesanan yang masuk ke toko Anda.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="px-6 md:px-8 border-b border-gray-100 bg-gray-50/50 flex overflow-x-auto scrollbar-hide">
          {[
            { id: 'all', label: 'Semua Pesanan' },
            { id: 'pending', label: 'Menunggu' },
            { id: 'paid', label: 'Perlu Dikirim' },
            { id: 'shipped', label: 'Dikirim' },
            { id: 'completed', label: 'Selesai' },
            { id: 'cancelled', label: 'Batal' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-4 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-primary font-bold border-b-2 border-primary' : 'text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-100/50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Filters */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-white flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari Nama Pembeli..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm shadow-sm"
            />
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-medium transition-all shadow-sm">
            <Filter size={18} />
            Filter Lanjutan
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 bg-gray-50/30 min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-500 font-medium py-20">Memuat data pesanan...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6 shadow-inner border border-gray-200/60">
                <Box size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Pesanan</h3>
              <p className="text-gray-500 text-sm max-w-md leading-relaxed">
                Tidak ada pesanan untuk kategori ini.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-800">{order.profiles?.full_name || 'Pembeli'}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-xs text-gray-500 flex gap-3">
                        <span>{new Date(order.created_at).toLocaleString('id-ID')}</span>
                        <span className="border-l border-gray-300 pl-3">ID: {order.id.split('-')[0]}...</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons based on status */}
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <>
                          <button 
                            disabled={updatingId === order.id}
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-200 transition disabled:opacity-50"
                          >
                            Tolak
                          </button>
                          <button 
                            disabled={updatingId === order.id}
                            onClick={() => updateOrderStatus(order.id, 'paid')}
                            className="text-xs font-bold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-lg transition disabled:opacity-50"
                          >
                            {updatingId === order.id ? 'Memproses...' : 'Terima Pembayaran'}
                          </button>
                        </>
                      )}
                      {order.status === 'paid' && (
                        <button 
                          disabled={updatingId === order.id}
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition disabled:opacity-50"
                        >
                          {updatingId === order.id ? 'Memproses...' : 'Kirim Barang'}
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button 
                          disabled={updatingId === order.id}
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition disabled:opacity-50"
                        >
                          {updatingId === order.id ? 'Memproses...' : 'Selesaikan Pesanan'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="divide-y divide-gray-100 px-6 py-2">
                    {order.order_items.map((item: any, idx: number) => (
                      <div key={idx} className="py-4 flex gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-200 shrink-0 overflow-hidden text-gray-300 flex items-center justify-center">
                          {item.products?.product_images?.[0]?.image_url ? (
                            <img src={item.products.product_images[0].image_url} alt={item.products.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={24} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.products?.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{item.quantity} x Rp {item.price_at_time.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-gray-800">Rp {(item.quantity * item.price_at_time).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Footer */}
                  <div className="bg-white px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total Pembayaran Pelanggan</span>
                    <span className="font-extrabold text-primary text-xl">Rp {order.total_amount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
