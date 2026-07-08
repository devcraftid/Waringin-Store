import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Store, ShieldCheck, MapPin, Globe } from 'lucide-react';

const ShopManagement = () => {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:owner_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShops(data || []);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop => 
    shop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gray-50/30">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <div className="w-2 h-6 bg-primary rounded-full"></div>
              Manajemen Toko
            </h2>
            <p className="text-sm text-gray-500 mt-2 ml-4">Pantau seluruh toko (seller) yang beroperasi di platform Waringin Store.</p>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama toko atau pemilik..."
              className="pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 w-full sm:w-72 text-sm transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-5 border-b border-gray-100">Informasi Toko</th>
                <th className="p-5 border-b border-gray-100">Pemilik (Seller)</th>
                <th className="p-5 border-b border-gray-100">Slug / URL Tautan</th>
                <th className="p-5 border-b border-gray-100 text-center">Status Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-sm font-medium">Memuat daftar toko...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredShops.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400 bg-gray-50/50 rounded-xl py-8 mx-4 border border-dashed border-gray-200">
                      <Store size={32} className="text-gray-300" />
                      <p className="text-sm font-medium">Tidak ada toko yang cocok dengan pencarian.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredShops.map((shop, idx) => (
                  <tr key={shop.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-5 flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border shrink-0 mt-1
                        ${idx % 3 === 0 ? 'bg-orange-50 text-orange-600 border-orange-100' : idx % 3 === 1 ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}
                      `}>
                        <Store size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">{shop.name}</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-[250px] leading-relaxed">
                          {shop.description || 'Toko ini belum menambahkan deskripsi.'}
                        </p>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                          {shop.profiles?.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                          {shop.profiles?.full_name || 'Tidak diketahui'}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 w-max group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                        <Globe size={14} className="text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-mono text-gray-600 group-hover:text-primary transition-colors cursor-pointer">
                          /{shop.slug}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className="inline-flex items-center gap-1.5 text-green-700 text-xs font-bold bg-green-50 border border-green-200 px-3 py-1.5 rounded-full shadow-sm">
                        <ShieldCheck size={14} className="text-green-500" />
                        {shop.status || 'Aktif Diverifikasi'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShopManagement;
