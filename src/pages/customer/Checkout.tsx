import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ChevronRight, Store, Package, QrCode, Banknote, Truck } from 'lucide-react';

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer' | 'cod'>('bank_transfer');
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch addresses
        const { data: addressData } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('customer_id', user.id)
          .order('is_primary', { ascending: false });
          
        setAddresses(addressData || []);
        if (addressData && addressData.length > 0) {
          const primary = addressData.find(a => a.is_primary);
          setSelectedAddress(primary || addressData[0]);
        }

        // Fetch site settings (Admin QRIS/Bank)
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .single();
          
        if (settingsData) {
          setSiteSettings(settingsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, items, navigate]);

  const handlePlaceOrder = async () => {
    // ... existing logic ...
    if (!selectedAddress) {
      alert('Pilih alamat pengiriman terlebih dahulu.');
      return;
    }

    try {
      setIsProcessing(true);

      const itemsByShop = items.reduce((acc, item) => {
        if (!acc[item.shop_id]) {
          acc[item.shop_id] = [];
        }
        acc[item.shop_id].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      for (const shopId of Object.keys(itemsByShop)) {
        const shopItems = itemsByShop[shopId];
        const shopTotal = shopItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([{
            customer_id: user?.id,
            shop_id: shopId,
            total_amount: shopTotal,
            status: 'pending',
            payment_method: paymentMethod
          }])
          .select()
          .single();

        if (orderError) throw orderError;

        const orderItemsToInsert = shopItems.map(item => ({
          order_id: orderData.id,
          product_id: item.id,
          quantity: item.quantity,
          price_at_time: item.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsToInsert);

        if (itemsError) throw itemsError;

        for (const item of shopItems) {
          const { data: product } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.id)
            .single();
            
          if (product && product.stock >= item.quantity) {
            await supabase
              .from('products')
              .update({ stock: product.stock - item.quantity })
              .eq('id', item.id);
          }
        }
      }

      clearCart();
      navigate('/checkout/success');
      
    } catch (error: any) {
      console.error('Error during checkout:', error);
      alert('Terjadi kesalahan saat checkout: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">Memuat rincian checkout...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            
            {/* 1. Address Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <MapPin size={20} className="text-primary" />
                <span className="font-bold text-gray-800">Alamat Pengiriman</span>
              </div>
              
              <div className="p-6">
                {addresses.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">Anda belum memiliki alamat tersimpan.</p>
                    <Link to="/profile" className="inline-block bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-hover transition">
                      Tambah Alamat Baru
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map(addr => (
                      <label 
                        key={addr.id} 
                        className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition ${selectedAddress?.id === addr.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}
                      >
                        <input 
                          type="radio" 
                          name="address" 
                          className="mt-1 text-primary focus:ring-primary"
                          checked={selectedAddress?.id === addr.id}
                          onChange={() => setSelectedAddress(addr)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800">{addr.full_name}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{addr.label}</span>
                            {addr.is_primary && <span className="text-xs text-primary bg-primary/10 font-bold px-2 py-0.5 rounded-full">Utama</span>}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{addr.phone}</p>
                          <p className="text-sm text-gray-600">{addr.full_address}</p>
                          <p className="text-sm text-gray-600">{addr.city}, {addr.postal_code}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Products Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <Package size={20} className="text-primary" />
                <span className="font-bold text-gray-800">Rincian Produk</span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {items.map(item => (
                  <div key={item.id} className="p-4 flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center text-gray-300">
                      {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <Package size={20} />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Store size={10} /> {item.shop_name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                        <span className="font-bold text-gray-800">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Payment Method Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <CreditCard size={20} className="text-primary" />
                <span className="font-bold text-gray-800">Metode Pembayaran</span>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <label className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition text-center gap-3 ${paymentMethod === 'qris' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-primary/50'}`}>
                    <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'qris'} onChange={() => setPaymentMethod('qris')} />
                    <QrCode size={32} className={paymentMethod === 'qris' ? 'text-primary' : 'text-gray-400'} />
                    <div>
                      <div className="font-bold text-gray-800 text-sm">QRIS</div>
                      <div className="text-xs text-gray-500">Scan & Pay</div>
                    </div>
                  </label>
                  
                  <label className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition text-center gap-3 ${paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-primary/50'}`}>
                    <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} />
                    <Banknote size={32} className={paymentMethod === 'bank_transfer' ? 'text-primary' : 'text-gray-400'} />
                    <div>
                      <div className="font-bold text-gray-800 text-sm">Transfer Bank</div>
                      <div className="text-xs text-gray-500">Verifikasi Manual</div>
                    </div>
                  </label>
                  
                  <label className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition text-center gap-3 ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-primary/50'}`}>
                    <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                    <Truck size={32} className={paymentMethod === 'cod' ? 'text-primary' : 'text-gray-400'} />
                    <div>
                      <div className="font-bold text-gray-800 text-sm">Bayar di Tempat</div>
                      <div className="text-xs text-gray-500">Cash on Delivery</div>
                    </div>
                  </label>
                </div>

                {/* Dynamic Payment Details from Admin Settings */}
                {paymentMethod === 'qris' && siteSettings?.qris_image_url && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <h4 className="font-bold text-blue-900 mb-2">Scan QRIS Berikut</h4>
                    <p className="text-sm text-blue-700 mb-4 text-center">Buka aplikasi m-banking atau e-wallet Anda (Gopay, OVO, Dana) dan scan kode di bawah ini.</p>
                    <div className="w-64 h-80 bg-white p-4 rounded-xl shadow-sm border border-blue-200 flex items-center justify-center">
                      <img src={siteSettings.qris_image_url} alt="QRIS Payment" className="w-full h-full object-contain" />
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && siteSettings?.bank_account_number && (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-6 animate-in fade-in zoom-in duration-300">
                    <h4 className="font-bold text-green-900 mb-4">Transfer ke Rekening Berikut:</h4>
                    <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm space-y-3">
                      <div className="flex justify-between border-b border-green-50 pb-2">
                        <span className="text-gray-500 text-sm">Bank</span>
                        <span className="font-bold text-gray-800">{siteSettings.bank_name}</span>
                      </div>
                      <div className="flex justify-between border-b border-green-50 pb-2">
                        <span className="text-gray-500 text-sm">Nomor Rekening</span>
                        <span className="font-bold text-primary text-lg">{siteSettings.bank_account_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 text-sm">Atas Nama</span>
                        <span className="font-bold text-gray-800">{siteSettings.bank_account_name}</span>
                      </div>
                    </div>
                    <p className="text-xs text-green-700 mt-4 text-center">Pastikan nominal transfer sesuai dengan Total Tagihan hingga ke digit terakhir.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar / Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Belanja</h3>
              
              <div className="space-y-3 text-sm text-gray-600 mb-4 border-b border-gray-100 pb-4">
                <div className="flex justify-between">
                  <span>Total Harga ({items.reduce((a, b) => a + b.quantity, 0)} Barang)</span>
                  <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span>Gratis</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-orange-600">
                    <span>Biaya Penanganan COD</span>
                    <span>Rp 2.000</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-800">Total Tagihan</span>
                <span className="text-xl font-bold text-primary">
                  Rp {(cartTotal + (paymentMethod === 'cod' ? 2000 : 0)).toLocaleString('id-ID')}
                </span>
              </div>
              
              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing || !selectedAddress || items.length === 0}
                className="w-full bg-primary text-white py-3.5 rounded-md hover:bg-primary-hover transition font-bold mb-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Memproses...
                  </span>
                ) : (
                  'Buat Pesanan'
                )}
              </button>
              
              <div className="text-xs text-gray-500 text-center">
                Dengan membuat pesanan, Anda menyetujui Syarat & Ketentuan Waringin Store.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
