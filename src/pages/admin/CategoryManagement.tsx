import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Tag, Link as LinkIcon, Database } from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    
    setAdding(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCatName, slug: newCatSlug }])
        .select();
        
      if (error) throw error;
      if (data) {
        setCategories([...categories, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
        setNewCatName('');
        setNewCatSlug('');
      }
    } catch (error: any) {
      alert('Gagal menambah kategori: ' + error.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus kategori "${name}"? Tindakan ini tidak bisa dibatalkan.`)) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        setCategories(categories.filter(c => c.id !== id));
      } catch (error: any) {
        alert('Gagal menghapus kategori (mungkin masih digunakan oleh produk).');
      }
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-6 md:p-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <div className="w-2 h-6 bg-primary rounded-full"></div>
              Kategori Produk
            </h2>
            <p className="text-sm text-gray-500 mt-2 ml-4">Atur klasifikasi barang yang akan ditampilkan di beranda pembeli.</p>
          </div>
          
          <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-lg border border-orange-100 flex items-center gap-2 text-sm font-bold shadow-sm">
            <Database size={16} /> Total Kategori: {categories.length}
          </div>
        </div>
        
        {/* Formulir Tambah Kategori */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200/60 shadow-sm mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Tambah Kategori Baru</h3>
          
          <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 relative z-10">
            <div className="flex-1 space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                <Tag size={14} className="text-gray-400" /> Nama Kategori
              </label>
              <input 
                type="text" 
                placeholder="Misal: Elektronik, Pakaian Pria..."
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all shadow-sm"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                }}
              />
            </div>
            
            <div className="flex-1 space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                <LinkIcon size={14} className="text-gray-400" /> Slug URL
              </label>
              <input 
                type="text" 
                placeholder="otomatis-terisi-seperti-ini"
                required
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-mono text-sm shadow-inner"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={adding || !newCatName}
                className="w-full md:w-auto bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none h-[46px]"
              >
                {adding ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><Plus size={18} strokeWidth={2.5} /> Simpan</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tabel Kategori */}
        <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="p-5 border-b border-gray-100 w-16 text-center">No</th>
                <th className="p-5 border-b border-gray-100">Detail Kategori</th>
                <th className="p-5 border-b border-gray-100 text-right pr-8">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-sm font-medium">Memuat daftar kategori...</p>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400 bg-gray-50/50 rounded-xl py-8 mx-4 border border-dashed border-gray-200">
                      <Database size={32} className="text-gray-300" />
                      <p className="text-sm font-medium">Belum ada kategori yang ditambahkan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-5 text-center text-sm font-bold text-gray-400 border-r border-gray-50 bg-gray-50/30">
                      {idx + 1}
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-base">{cat.name}</span>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                          <LinkIcon size={12} />
                          <span className="font-mono text-xs">{cat.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-right pr-6">
                      <button 
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-700 bg-white hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all shadow-sm opacity-60 group-hover:opacity-100"
                        title="Hapus Kategori"
                      >
                        <Trash2 size={16} />
                        <span className="text-xs font-bold hidden sm:inline">Hapus</span>
                      </button>
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

export default CategoryManagement;
