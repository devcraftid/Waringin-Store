import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, Save, Info, Tag, Layers, FileText, DollarSign, Package, CheckCircle2, ImagePlus, X } from 'lucide-react';

const ProductForm = () => {
  const { shop } = useOutletContext<{ shop: any }>();
  const navigate = useNavigate();
  
  const { id } = useParams();
  const isEditing = !!id;
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    discount_percentage: '0',
    stock: '',
    product_type: 'physical',
    status: 'active',
    category_id: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*, product_images(image_url)')
          .eq('id', id)
          .single();
          
        if (data) {
          setFormData({
            title: data.title,
            slug: data.slug,
            description: data.description || '',
            price: data.price.toString(),
            discount_percentage: (data.discount_percentage || 0).toString(),
            stock: data.stock.toString(),
            product_type: data.product_type,
            status: data.status,
            category_id: data.category_id || ''
          });
          if (data.product_images && data.product_images.length > 0) {
            setProductImage(data.product_images[0].image_url);
          }
        }
        setLoading(false);
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Ukuran gambar maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let productId = id;
      
      if (isEditing) {
        const { error: dbError } = await supabase
          .from('products')
          .update({
            category_id: formData.category_id || null,
            product_type: formData.product_type,
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            price: parseFloat(formData.price) || 0,
            discount_percentage: parseInt(formData.discount_percentage) || 0,
            stock: parseInt(formData.stock) || 0,
            status: formData.status
          })
          .eq('id', id);
          
        if (dbError) throw dbError;
      } else {
        const { data, error: dbError } = await supabase
          .from('products')
          .insert([
            {
              shop_id: shop.id,
              category_id: formData.category_id || null,
              product_type: formData.product_type,
              title: formData.title,
              slug: formData.slug,
              description: formData.description,
              price: parseFloat(formData.price) || 0,
              discount_percentage: parseInt(formData.discount_percentage) || 0,
              stock: parseInt(formData.stock) || 0,
              status: formData.status
            }
          ])
          .select();

        if (dbError) {
          if (dbError.code === '23505') {
            throw new Error('Produk dengan judul/slug ini sudah ada.');
          }
          throw dbError;
        }
        productId = data[0].id;
      }

      if (productId && productImage) {
        await supabase.from('product_images').delete().eq('product_id', productId);
        
        const { error: imageError } = await supabase
          .from('product_images')
          .insert([{
            product_id: productId,
            image_url: productImage,
            is_primary: true
          }]);
          
        if (imageError) {
          console.error('Gagal menyimpan gambar:', imageError);
        }
      }

      navigate('/seller/products');
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan produk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button 
          onClick={() => navigate('/seller/products')} 
          className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:text-primary text-gray-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <p className="text-sm text-gray-500">Lengkapi detail produk Anda agar menarik bagi pembeli.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 flex items-center gap-3 shadow-sm">
           <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0 font-bold">!</div>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Image Upload */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ImagePlus className="text-primary" size={20} /> Foto Produk
            </h3>
            
            <div className="flex flex-col items-center justify-center w-full">
              {productImage ? (
                <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 group">
                  <img src={productImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => setProductImage(null)}
                      className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-transform transform hover:scale-110 shadow-lg"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-primary/50 transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-primary mb-4 transition-colors">
                      <ImagePlus size={32} />
                    </div>
                    <p className="mb-2 text-sm text-gray-500 font-bold"><span className="text-primary">Klik untuk unggah</span> atau seret gambar ke sini</p>
                    <p className="text-xs text-gray-400">PNG, JPG atau WEBP (Maks. 2MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Info className="text-primary" size={20} /> Informasi Dasar
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Sepatu Sneakers Pria Original"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  value={formData.title}
                  onChange={handleTitleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    <select
                      name="category_id"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none font-medium text-gray-700"
                      value={formData.category_id}
                      onChange={handleChange}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {/* Custom arrow for select */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  {categories.length === 0 && <p className="text-xs text-orange-500 mt-1 font-medium">Kategori belum tersedia di database.</p>}
                </div>
                
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    Tipe Produk
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    <select
                      name="product_type"
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none font-medium text-gray-700"
                      value={formData.product_type}
                      onChange={handleChange}
                    >
                      <option value="physical">Fisik (Barang)</option>
                      <option value="digital">Digital (E-book, Lisensi)</option>
                      <option value="service">Jasa (Konsultasi, Layanan)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  Deskripsi Produk
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-gray-400 pointer-events-none" size={16} />
                  <textarea
                    name="description"
                    rows={6}
                    placeholder="Tuliskan deskripsi lengkap produk Anda..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <DollarSign className="text-green-500 bg-green-50 rounded p-0.5" size={24} /> Harga & Stok
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  Harga Penjualan (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    required
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-gray-800"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  Ketersediaan Stok <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    required
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-gray-800"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Promo & Discount */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Tag className="text-orange-500 bg-orange-50 rounded p-0.5" size={24} /> Promo & Diskon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  Diskon Produk (%)
                </label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  <input
                    type="number"
                    name="discount_percentage"
                    min="0"
                    max="100"
                    placeholder="0"
                    className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-gray-800"
                    value={formData.discount_percentage}
                    onChange={handleChange}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
                <p className="text-xs text-gray-500">Kosongkan atau isi 0 jika tidak ada diskon.</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex flex-col justify-center">
                <p className="text-sm text-orange-800 font-medium mb-1">Simulasi Harga Pembeli:</p>
                {parseFloat(formData.price) > 0 && parseInt(formData.discount_percentage) > 0 ? (
                  <div>
                    <span className="text-gray-400 line-through text-sm mr-2">Rp {parseFloat(formData.price).toLocaleString('id-ID')}</span>
                    <span className="text-xl font-black text-orange-600">Rp {(parseFloat(formData.price) - (parseFloat(formData.price) * (parseInt(formData.discount_percentage) / 100))).toLocaleString('id-ID')}</span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-gray-800">Rp {parseFloat(formData.price || '0').toLocaleString('id-ID')}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Display Status */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-blue-500 bg-blue-50 rounded p-0.5" size={24} /> Status Penayangan
            </h3>
            <div className="space-y-1.5">
              <div className="relative w-full md:w-1/2">
                <select
                  name="status"
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none font-bold text-gray-800"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Aktif (Langsung Tampilkan di Toko)</option>
                  <option value="draft">Draft (Simpan, tapi Sembunyikan)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-4 z-10 flex justify-end gap-4 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-bold"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading || !formData.title || !formData.price || !formData.stock}
            className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-bold flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><Save size={18} strokeWidth={2.5} /> {isEditing ? 'Simpan Perubahan' : 'Simpan Produk'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
