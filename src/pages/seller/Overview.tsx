import React, { useEffect, useState } from 'react';
import { Package, TrendingUp, AlertCircle, Wallet } from 'lucide-react';
import { useOutletContext, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const Overview = () => {
  const { shop } = useOutletContext<{ shop: any }>();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    newOrders: 0,
    readyToShip: 0,
    outOfStock: 0,
    retainedBalance: 0,
    productCount: 0
  });

  useEffect(() => {
    if (shop) fetchDashboardStats();
  }, [shop]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const { data: orders } = await supabase
        .from('orders')
        .select('status, total_amount')
        .eq('shop_id', shop.id);
        
      const { data: products } = await supabase
        .from('products')
        .select('stock')
        .eq('shop_id', shop.id);

      let newOrders = 0;
      let readyToShip = 0;
      let retainedBalance = 0;
      let outOfStock = 0;

      if (orders) {
        orders.forEach(order => {
          if (order.status === 'pending') newOrders++;
          if (order.status === 'paid') readyToShip++;
          if (order.status === 'completed') retainedBalance += Number(order.total_amount);
        });
      }

      if (products) {
        products.forEach(p => {
          if (p.stock <= 0) outOfStock++;
        });
      }

      setStats({
        newOrders,
        readyToShip,
        outOfStock,
        retainedBalance,
        productCount: products ? products.length : 0
      });
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Ringkasan Toko</h2>
          <p className="text-gray-500 mt-1">Pantau aktivitas penjualan dan performa toko Anda hari ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/seller/orders" className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 border border-gray-100 flex flex-col justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Package size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pesanan Baru</span>
          </div>
          <p className="text-3xl font-black text-gray-800">{loading ? '...' : stats.newOrders}</p>
        </Link>

        <Link to="/seller/orders" className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 border border-gray-100 flex flex-col justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <TrendingUp size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Siap Dikirim</span>
          </div>
          <p className="text-3xl font-black text-gray-800">{loading ? '...' : stats.readyToShip}</p>
        </Link>

        <Link to="/seller/products" className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 border border-gray-100 flex flex-col justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
              <AlertCircle size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Produk Habis</span>
          </div>
          <p className="text-3xl font-black text-gray-800">{loading ? '...' : stats.outOfStock}</p>
        </Link>

        <Link to="/seller/finance" className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 border border-gray-100 flex flex-col justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Wallet size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saldo Tertahan</span>
          </div>
          <p className="text-xl md:text-2xl font-black text-gray-800">Rp {loading ? '...' : stats.retainedBalance.toLocaleString('id-ID')}</p>
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 md:p-8 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          Status Kelengkapan Toko
        </h3>
        <div className="space-y-4">
          {/* 1. Profil Toko */}
          <div className="flex items-start gap-4 p-5 border rounded-xl bg-green-50/50 border-green-200/60 shadow-sm transition-all hover:bg-green-50">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              ✓
            </div>
            <div className="pt-0.5">
              <h4 className="font-bold text-gray-800 text-base">Profil Toko Dibuat</h4>
              <p className="text-sm text-gray-500 mt-1">Toko "{shop.name}" sudah beroperasi secara resmi.</p>
            </div>
          </div>
          
          {/* 2. Rekening Bank */}
          {shop.bank_name && shop.bank_account_number ? (
             <div className="flex items-start gap-4 p-5 border rounded-xl bg-green-50/50 border-green-200/60 shadow-sm transition-all hover:bg-green-50">
               <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                 ✓
               </div>
               <div className="pt-0.5">
                 <h4 className="font-bold text-gray-800 text-base">Rekening Pencairan Diatur</h4>
                 <p className="text-sm text-gray-500 mt-1">Anda sudah menautkan rekening bank ({shop.bank_name}).</p>
               </div>
             </div>
          ) : (
            <div className="flex items-start gap-4 p-5 border rounded-xl bg-blue-50/50 border-blue-200/60 shadow-sm transition-all hover:bg-blue-50">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                2
              </div>
              <div className="pt-0.5">
                <h4 className="font-bold text-gray-800 text-base">Atur Rekening Pencairan</h4>
                <p className="text-sm text-gray-500 mt-1">Anda belum menautkan rekening bank. Hal ini wajib untuk mencairkan saldo Anda nanti.</p>
                <Link to="/seller/settings" className="mt-3 inline-block bg-primary text-white text-xs font-bold px-4 py-2 rounded">Atur Sekarang</Link>
              </div>
            </div>
          )}

          {/* 3. Produk */}
          {stats.productCount > 0 ? (
            <div className="flex items-start gap-4 p-5 border rounded-xl bg-green-50/50 border-green-200/60 shadow-sm transition-all hover:bg-green-50">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                ✓
              </div>
              <div className="pt-0.5">
                <h4 className="font-bold text-gray-800 text-base">Produk Berhasil Ditambahkan</h4>
                <p className="text-sm text-gray-500 mt-1">Anda memiliki {stats.productCount} produk di etalase Anda.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4 p-5 border rounded-xl bg-blue-50/50 border-blue-200/60 shadow-sm transition-all hover:bg-blue-50">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                3
              </div>
              <div className="pt-0.5">
                <h4 className="font-bold text-gray-800 text-base">Tambah Produk Pertama</h4>
                <p className="text-sm text-gray-500 mt-1">Etalase toko Anda masih kosong. Ayo tambahkan produk pertama Anda sekarang!</p>
                <Link to="/seller/products/new" className="mt-3 inline-block bg-primary text-white text-xs font-bold px-4 py-2 rounded">Upload Produk</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
