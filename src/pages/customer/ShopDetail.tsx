import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Store, CheckCircle, PackageOpen, Star, Package } from 'lucide-react';

const ShopDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      try {
        setLoading(true);
        // Fetch shop
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('*')
          .eq('slug', slug)
          .single();

        if (shopError) throw shopError;
        setShop(shopData);

        // Fetch products
        if (shopData) {
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select(`
              *,
              product_images (image_url)
            `)
            .eq('shop_id', shopData.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

          if (productError) throw productError;
          setProducts(productData || []);
        }
      } catch (err) {
        console.error('Error fetching shop details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchShopAndProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-500 font-medium">Memuat profil toko...</div>
        <Footer />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Store size={64} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Toko Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Toko yang Anda cari tidak tersedia atau URL salah.</p>
          <Link to="/" className="text-primary hover:underline font-bold bg-primary/10 px-6 py-2 rounded-lg">Kembali ke Beranda</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Shop Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 relative">
          <div className="h-32 md:h-48 bg-gradient-to-r from-primary to-blue-600"></div>
          <div className="px-6 md:px-10 pb-6 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 md:-mt-16 mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full p-2 shadow-lg shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                {shop.logo_url ? (
                  <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <Store size={48} className="text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  {shop.name}
                  {shop.is_verified && <CheckCircle className="text-green-500" size={24} />}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1"><Package size={16} /> {products.length} Produk</span>
                  <span className="flex items-center gap-1 text-yellow-500 font-medium"><Star size={16} fill="currentColor" /> 4.9 Penilaian</span>
                </div>
              </div>
            </div>
            {shop.description && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                  {shop.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Shop Products */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Semua Produk</h2>
          
          {products.length === 0 ? (
            <div className="bg-white p-12 flex flex-col items-center justify-center text-center rounded-2xl shadow-sm border border-gray-100">
              <PackageOpen size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-700 mb-2">Belum Ada Produk</h3>
              <p className="text-gray-500 text-sm">Toko ini belum menambahkan produk apa pun.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
              {products.map((product) => (
                <Link to={`/product/${product.slug}`} key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md hover:border-primary border border-gray-100 transition cursor-pointer flex flex-col group overflow-hidden">
                  <div className="aspect-square bg-gray-50 relative flex items-center justify-center text-gray-300 overflow-hidden">
                    {product.product_images && product.product_images.length > 0 ? (
                      <img src={product.product_images[0].image_url} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <PackageOpen size={48} strokeWidth={1} />
                    )}
                    {product.stock === 0 ? (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 backdrop-blur-[1px]">
                        <div className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-gray-700 shadow-lg transform -rotate-12 uppercase tracking-wider">
                          Habis Terjual
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition"></div>
                    )}
                    
                    {product.discount_percentage > 0 && product.stock > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">Promo</div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-xs md:text-sm text-gray-800 line-clamp-2 leading-snug mb-1.5 flex-grow group-hover:text-primary transition">
                      {product.title}
                    </h3>
                    <div className="flex flex-col mb-2">
                      {product.discount_percentage > 0 ? (
                        <>
                          <span className="text-primary font-bold text-sm md:text-base">
                            Rp {(product.price - (product.price * (product.discount_percentage / 100))).toLocaleString('id-ID')}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] text-gray-400 line-through">Rp {product.price.toLocaleString('id-ID')}</span>
                            <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1 rounded">-{product.discount_percentage}%</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-primary font-bold text-sm md:text-base">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ShopDetail;
