import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Minus, Plus, ShoppingCart, Store, CheckCircle, Package, Heart } from 'lucide-react';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            shops (id, name, slug),
            product_images (image_url)
          `)
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !product) return;
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('id')
          .eq('customer_id', user.id)
          .eq('product_id', product.id)
          .single();
        if (data) setIsWishlisted(true);
      } catch (e) {
        // Not found in wishlist is fine
      }
    };
    checkWishlist();
  }, [user, product]);

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase' && quantity < (product?.stock || 0)) {
      setQuantity(q => q + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    setAddingToCart(true);
    addToCart(product, quantity, product.shops?.name || 'Toko');
    
    // Simulate API delay for better UX
    setTimeout(() => {
      setAddingToCart(false);
      alert('Produk berhasil ditambahkan ke keranjang!');
    }, 500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    addToCart(product, quantity, product.shops?.name || 'Toko');
    navigate('/cart');
  };

  const toggleWishlist = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu untuk menyimpan ke Wishlist');
      navigate('/login');
      return;
    }
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await supabase.from('wishlists').delete().eq('customer_id', user.id).eq('product_id', product.id);
        setIsWishlisted(false);
      } else {
        await supabase.from('wishlists').insert([{ customer_id: user.id, product_id: product.id }]);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">Memuat detail produk...</div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-2">Produk Tidak Ditemukan</h2>
          <Link to="/" className="text-primary hover:underline">Kembali ke Beranda</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Waringin Store</Link>
          <span>&gt;</span>
          <span className="capitalize">{product.product_type}</span>
          <span>&gt;</span>
          <span className="text-gray-800 line-clamp-1">{product.title}</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row gap-8">
          {/* Image Section */}
          <div className="w-full md:w-2/5 shrink-0">
            {product.product_images && product.product_images.length > 0 ? (
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-4 relative">
                <img src={product.product_images[0].image_url} alt={product.title} className="w-full h-full object-cover" />
                {product.discount_percentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded shadow-md">
                    Promo
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 mb-4 border border-gray-200 relative">
                <Package size={64} className="mb-4 text-gray-300" />
                <span>Gambar Belum Tersedia</span>
                {product.discount_percentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded shadow-md">
                    Promo
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              {product.product_images && product.product_images.length > 0 ? (
                product.product_images.map((img: any, idx: number) => (
                  <div key={idx} className="aspect-square w-16 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:border-primary overflow-hidden">
                    <img src={img.image_url} alt="thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                [1, 2, 3, 4].map(idx => (
                  <div key={idx} className="aspect-square w-16 bg-gray-100 rounded border border-gray-200 cursor-pointer hover:border-primary"></div>
                ))
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start gap-4 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
              <button 
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className={`p-2 rounded-full border transition ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'}`}
                title="Tambahkan ke Wishlist"
              >
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1 text-yellow-500 font-medium">★ 4.8</span>
              <span className="border-l border-gray-300 h-4"></span>
              <span>150 Penilaian</span>
              <span className="border-l border-gray-300 h-4"></span>
              <span>500+ Terjual</span>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              {product.discount_percentage > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-400 line-through text-sm">Rp {product.price.toLocaleString('id-ID')}</span>
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">Diskon {product.discount_percentage}%</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    Rp {(product.price - (product.price * (product.discount_percentage / 100))).toLocaleString('id-ID')}
                  </div>
                </>
              ) : (
                <div className="text-3xl font-bold text-primary">Rp {product.price.toLocaleString('id-ID')}</div>
              )}
            </div>

            {/* Shop Info Card (Compact) */}
            <div className="flex items-center justify-between border border-gray-200 p-4 rounded-lg mb-6 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <Store size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{product.shops?.name || 'Toko Tidak Diketahui'}</h3>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-green-600"><CheckCircle size={12} /> Terverifikasi</span>
                    <span>Aktif 2 jam lalu</span>
                  </div>
                </div>
              </div>
              <Link 
                to={`/shop/${product.shops?.slug}`} 
                className="text-sm px-4 py-2 border border-primary text-primary rounded hover:bg-primary/5 transition font-medium"
              >
                Kunjungi Toko
              </Link>
            </div>

            <div className="flex-1"></div>

            {/* Add to Cart Actions */}
            <div className="border-t border-gray-100 pt-6 mt-6">
              <div className="flex items-center gap-6 mb-6">
                <span className="text-sm text-gray-600 font-medium w-24">Kuantitas</span>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleQuantityChange('decrease')}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l hover:bg-gray-50"
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    type="text" 
                    className="w-12 h-8 border-y border-gray-300 text-center text-sm focus:outline-none"
                    value={quantity}
                    readOnly
                  />
                  <button 
                    onClick={() => handleQuantityChange('increase')}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r hover:bg-gray-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">Tersisa {product.stock} buah</span>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock === 0}
                  className="flex-1 bg-primary/10 text-primary border border-primary px-6 py-3 rounded-md hover:bg-primary/20 transition font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart size={20} />
                  {addingToCart ? 'Memasukkan...' : 'Masukkan Keranjang'}
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-hover transition font-bold disabled:opacity-50"
                >
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Spesifikasi & Deskripsi Produk</h2>
          
          <div className="text-sm text-gray-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md mb-6">
              <div className="flex">
                <span className="w-32 text-gray-500">Kategori</span>
                <span className="font-medium">Fashion / Pakaian</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Kondisi</span>
                <span className="font-medium">Baru</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Berat</span>
                <span className="font-medium">500 Gram</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Tipe Produk</span>
                <span className="font-medium capitalize">{product.product_type}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="whitespace-pre-line leading-relaxed">
                {product.description || 'Tidak ada deskripsi untuk produk ini.'}
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
