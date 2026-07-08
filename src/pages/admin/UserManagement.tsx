import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, UserCheck, Shield, ShoppingBag, ShieldCheck } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gray-50/30">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <div className="w-2 h-6 bg-primary rounded-full"></div>
              Manajemen Pengguna
            </h2>
            <p className="text-sm text-gray-500 mt-2 ml-4">Kelola semua profil dan hak akses pengguna Waringin Store.</p>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau role..."
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
                <th className="p-5 border-b border-gray-100">Pengguna</th>
                <th className="p-5 border-b border-gray-100">ID Sistem</th>
                <th className="p-5 border-b border-gray-100">Hak Akses (Role)</th>
                <th className="p-5 border-b border-gray-100">Tanggal Gabung</th>
                <th className="p-5 border-b border-gray-100 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-sm font-medium">Memuat data pengguna...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400 bg-gray-50/50 rounded-xl py-8 mx-4 border border-dashed border-gray-200">
                      <Search size={32} className="text-gray-300" />
                      <p className="text-sm font-medium">Tidak ada pengguna yang cocok dengan pencarian.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-5 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border
                        ${idx % 3 === 0 ? 'bg-blue-50 text-blue-600 border-blue-100' : idx % 3 === 1 ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-purple-50 text-purple-600 border-purple-100'}
                      `}>
                        {user.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{user.full_name || 'Tanpa Nama'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">User</p>
                      </div>
                    </td>
                    <td className="p-5 text-xs text-gray-500 font-mono bg-gray-50/30">
                      <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">{user.id.substring(0, 8)}...</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        {user.role === 'admin' ? <ShieldCheck size={16} className="text-red-500" /> :
                         user.role === 'seller' ? <ShoppingBag size={16} className="text-blue-500" /> :
                         <UserCheck size={16} className="text-green-500" />}
                        <span className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide shadow-sm ${
                          user.role === 'admin' ? 'bg-red-50 text-red-700 border border-red-100' :
                          user.role === 'seller' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          'bg-green-50 text-green-700 border border-green-100'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-sm text-gray-500 font-medium">
                      {new Date(user.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </td>
                    <td className="p-5 text-center">
                      <span className="inline-flex items-center gap-1.5 text-green-700 text-xs font-bold bg-green-50 border border-green-200 px-3 py-1.5 rounded-full shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        Aktif
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

export default UserManagement;
