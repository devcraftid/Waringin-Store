import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart, Store } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    alert('Simulasi Checkout Berhasil! Anda akan diarahkan ke halaman pembayaran.');
    clearCart();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ShoppingCart /> Keranjang Belanja
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
              <ShoppingCart size={48} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Keranjang belanja Anda kosong</h2>
            <p className="text-gray-500 mb-6">Yuk, mulai belanja dan isi keranjangmu dengan produk impian!</p>
            <Link to="/" className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-hover transition font-bold">
              Belanja Sekarang
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items List */}
            <div className="flex-1 space-y-4">
              {/* Group items by Shop Name (Simulation) */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" checked readOnly />
                  <Store size={18} className="text-gray-600" />
                  <span className="font-bold text-gray-800">Semua Toko</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {items.map(item => (
                    <div key={item.id} className="p-4 flex gap-4">
                      <input type="checkbox" className="w-4 h-4 mt-2 text-primary rounded border-gray-300 focus:ring-primary" checked readOnly />
                      
                      <div className="w-20 h-20 bg-gray-100 rounded border border-gray-200 shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded" />
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-gray-800 line-clamp-2">{item.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">Toko: {item.shop_name}</p>
                          </div>
                          <div className="font-bold text-gray-800 text-right shrink-0">
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto pt-4">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition flex items-center gap-1 text-sm font-medium"
                          >
                            <Trash2 size={16} /> Hapus
                          </button>
                          
                          <div className="flex items-center">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l hover:bg-gray-50"
                            >
                              <Minus size={14} />
                            </button>
                            <input 
                              type="text" 
                              className="w-10 h-8 border-y border-gray-300 text-center text-sm focus:outline-none"
                              value={item.quantity}
                              readOnly
                            />
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r hover:bg-gray-50"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Belanja</h3>
                
                <div className="space-y-3 text-sm text-gray-600 mb-4 border-b border-gray-100 pb-4">
                  <div className="flex justify-between">
                    <span>Total Harga ({items.length} Barang)</span>
                    <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Ongkos Kirim</span>
                    <span>Rp 0</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-gray-800">Total Tagihan</span>
                  <span className="text-xl font-bold text-primary">Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-hover transition font-bold mb-4"
                >
                  Beli ({items.reduce((acc, curr) => acc + curr.quantity, 0)})
                </button>
                
                <Link to="/" className="w-full block text-center py-2 text-sm text-primary font-medium hover:underline">
                  Lanjut Belanja
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
