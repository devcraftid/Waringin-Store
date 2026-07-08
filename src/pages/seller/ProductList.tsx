import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit, Trash2, Package, Search, Image as ImageIcon } from 'lucide-react';

const ProductList = () => {
  const { shop } = useOutletContext<{ shop: any }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, [shop]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          product_images (image_url)
        `)
        .eq('shop_id', shop.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${title}"?`)) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Gagal menghapus produk');
      }
    }
  };

  const filteredProducts = products.filter(p => {
    if (activeTab === 'active') return p.status === 'active' && p.stock > 0;
    if (activeTab === 'out_of_stock') return p.stock <= 0;
    if (activeTab === 'draft') return p.status === 'draft';
    return true;
  });

  const countAll = products.length;
  const countActive = products.filter(p => p.status === 'active' && p.stock > 0).length;
  const countOutOfStock = products.filter(p => p.stock <= 0).length;
  const countDraft = products.filter(p => p.status === 'draft').length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gray-50/30">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <div className="w-2 h-6 bg-primary rounded-full"></div>
              Produk Saya
            </h2>
            <p className="text-sm text-gray-500 mt-2 ml-4">Kelola semua barang dagangan yang Anda jual di Waringin Store.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link 
              to="/seller/products/new" 
              className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-bold flex items-center justify-center gap-2"
            >
              <Plus size={18} strokeWidth={2.5} /> Tambah Produk
            </Link>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setActiveTab('all')} className={`font-bold pb-2 px-2 whitespace-nowrap transition-colors ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}>Semua ({countAll})</button>
            <button onClick={() => setActiveTab('active')} className={`font-bold pb-2 px-2 whitespace-nowrap transition-colors ${activeTab === 'active' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}>Aktif ({countActive})</button>
            <button onClick={() => setActiveTab('out_of_stock')} className={`font-bold pb-2 px-2 whitespace-nowrap transition-colors ${activeTab === 'out_of_stock' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}>Habis ({countOutOfStock})</button>
            <button onClick={() => setActiveTab('draft')} className={`font-bold pb-2 px-2 whitespace-nowrap transition-colors ${activeTab === 'draft' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}>Draf ({countDraft})</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-5 border-b border-gray-100">Info Produk</th>
                <th className="p-5 border-b border-gray-100">Tipe</th>
                <th className="p-5 border-b border-gray-100">Harga</th>
                <th className="p-5 border-b border-gray-100 text-center">Stok</th>
                <th className="p-5 border-b border-gray-100 text-center">Status</th>
                <th className="p-5 border-b border-gray-100 text-right pr-8">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-sm font-medium">Memuat data produk...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-400 bg-gray-50/50 rounded-xl py-12 mx-4 border border-dashed border-gray-200">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package size={32} className="text-gray-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-base font-bold text-gray-700">Belum Ada Produk di Tab Ini</p>
                        <p className="text-sm mt-1 max-w-sm mx-auto">Tidak ada produk yang cocok dengan kriteria filter saat ini.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 border border-gray-200 shrink-0 overflow-hidden">
                          {product.product_images && product.product_images.length > 0 ? (
                            <img src={product.product_images[0].image_url} alt="img" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={24} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-base line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">{product.title}</p>
                          <p className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 px-2 py-0.5 rounded-md inline-block">
                            {product.categories?.name || 'Tanpa Kategori'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-medium text-gray-600 capitalize">
                      {product.product_type}
                    </td>
                    <td className="p-5 text-sm font-black text-primary">
                      Rp {product.price.toLocaleString('id-ID')}
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-gray-100 text-gray-700' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full font-bold shadow-sm ${
                        product.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' : 
                        product.status === 'draft' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
                        'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {product.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                        {product.status === 'active' ? 'Aktif' : product.status}
                      </span>
                    </td>
                    <td className="p-5 text-right pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/seller/products/edit/${product.id}`} 
                          className="p-2 text-blue-500 hover:text-blue-700 bg-white hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-all shadow-sm flex items-center justify-center" 
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id, product.title)}
                          className="p-2 text-red-500 hover:text-red-700 bg-white hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all shadow-sm" 
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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

export default ProductList;
