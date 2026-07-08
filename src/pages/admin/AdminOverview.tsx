import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Users, Store, PackageSearch, TrendingUp } from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    users: 0,
    shops: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, shopsRes, productsRes] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('shops').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          users: usersRes.count || 0,
          shops: shopsRes.count || 0,
          products: productsRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Ringkasan Sistem</h2>
        <p className="text-gray-500 mt-1">Pantau performa dan statistik keseluruhan Waringin Store.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 border border-gray-100 flex items-center gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all pointer-events-none"></div>
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
            <Users size={28} strokeWidth={2.5} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Pengguna</p>
            <h3 className="text-3xl font-black text-gray-800">{stats.users}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 border border-gray-100 flex items-center gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-all pointer-events-none"></div>
          <div className="w-14 h-14 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 shadow-inner">
            <Store size={28} strokeWidth={2.5} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Toko</p>
            <h3 className="text-3xl font-black text-gray-800">{stats.shops}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 border border-gray-100 flex items-center gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all pointer-events-none"></div>
          <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-inner">
            <PackageSearch size={28} strokeWidth={2.5} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Produk</p>
            <h3 className="text-3xl font-black text-gray-800">{stats.products}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 border border-gray-100 flex items-center gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-all pointer-events-none"></div>
          <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 shadow-inner">
            <TrendingUp size={28} strokeWidth={2.5} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Transaksi Aktif</p>
            <h3 className="text-3xl font-black text-gray-800">0</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            Aktivitas Terbaru
          </h3>
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <TrendingUp size={32} className="text-gray-300" />
            </div>
            <p className="font-medium text-gray-500">Belum ada aktivitas transaksi yang tercatat.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            Tugas Admin
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl border border-gray-200/60">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="font-bold text-gray-700">Verifikasi Toko Baru</span>
              </div>
              <span className="bg-red-100 text-red-600 py-1.5 px-4 rounded-full font-extrabold text-xs shadow-sm">0 Menunggu</span>
            </li>
            <li className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl border border-gray-200/60">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-bold text-gray-700">Laporan Pengguna</span>
              </div>
              <span className="bg-green-100 text-green-600 py-1.5 px-4 rounded-full font-extrabold text-xs shadow-sm">Aman</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
