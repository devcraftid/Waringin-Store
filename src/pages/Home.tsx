import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { supabase } from '../lib/supabaseClient';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Shirt, ShoppingBag, Smartphone, Sparkles, Watch, Tv, Gem, Activity, Car, Laptop, PackageOpen } from 'lucide-react';

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'pakaian': return <Shirt size={30} strokeWidth={1.2} fill="currentColor" className="text-[#ee4d2d]" />;
    case 'sepatu': return <ShoppingBag size={30} strokeWidth={1.2} fill="currentColor" className="text-[#ff7337]" />;
    case 'handphone': return <Smartphone size={30} strokeWidth={1.5} className="text-[#20b2aa]" />;
    case 'kecantikan': return <Sparkles size={30} strokeWidth={1.2} fill="currentColor" className="text-[#ff69b4]" />;
    case 'jam-tangan': return <Watch size={30} strokeWidth={1.5} className="text-[#e6a800]" />;
    case 'elektronik': return <Tv size={30} strokeWidth={1.5} className="text-[#4169e1]" />;
    case 'aksesoris': return <Gem size={30} strokeWidth={1.2} fill="currentColor" className="text-[#2ecc71]" />;
    case 'olahraga': return <Activity size={30} strokeWidth={2} className="text-[#3f51b5]" />;
    case 'otomotif': return <Car size={30} strokeWidth={1.2} fill="currentColor" className="text-[#707070]" />;
    case 'komputer': return <Laptop size={30} strokeWidth={1.5} className="text-[#00bfff]" />;
    default: return <PackageOpen size={30} strokeWidth={1.2} className="text-gray-500" />;
  }
};

const ITEMS_PER_PAGE = 12;

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setDbCategories(data);
    };
    fetchCats();
  }, []);

  const fetchProducts = async (currentPage: number, reset: boolean = false) => {
    try {
      if (reset) setLoading(true);
      
      let query = supabase
        .from('products')
        .select(`
          *,
          shops (name, slug),
          product_images (image_url),
          categories!inner (name, slug)
        `, { count: 'exact' })
        .eq('status', 'active');

      // Apply Search Filter
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      // Apply DB Category Filter
      if (categoryQuery) {
        query = query.eq('categories.slug', categoryQuery);
      }

      // Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error && error.code !== 'PGRST116') {
        console.error('Fetch error:', error);
      }
      
      if (reset) {
        setProducts(data || []);
      } else {
        setProducts(prev => [...prev, ...(data || [])]);
      }
      
      if (count !== null) {
        setHasMore((from + (data?.length || 0)) < count);
      }

    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [searchQuery, categoryQuery]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, false);
  };

  const handleCategoryClick = (slug: string) => {
    if (categoryQuery === slug) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    // Clear search when clicking a category directly
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-6 flex-1">
        {/* Top Banner Section - Hide when searching */}
        {!searchQuery && !categoryQuery && (
          <section className="flex flex-col md:flex-row gap-3 mb-8">
            <div className="flex-1 bg-gray-200 rounded-xl overflow-hidden h-[200px] md:h-[300px] relative shadow-sm">
              <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80" alt="Promo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8 md:p-12">
                <div className="text-white max-w-md">
                  <h2 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">MEGA SALE 12.12</h2>
                  <p className="mb-6 opacity-90 text-sm md:text-base">Diskon hingga 90% + Gratis Ongkir Sepuasnya untuk semua kategori produk favorit Anda.</p>
                  <button onClick={scrollToProducts} className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg">
                    Beli Sekarang
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-1/3">
              <div className="bg-gray-200 rounded-xl h-[100px] md:h-[144px] overflow-hidden shadow-sm flex-1 relative group cursor-pointer" onClick={scrollToProducts}>
                <img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=500&q=80" alt="Promo 2" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
              </div>
              <div className="bg-gray-200 rounded-xl h-[100px] md:h-[144px] overflow-hidden shadow-sm flex-1 relative group cursor-pointer" onClick={scrollToProducts}>
                <img src="https://images.unsplash.com/photo-1555529733-0e670560f7e1?w=500&q=80" alt="Promo 3" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
              </div>
            </div>
          </section>
        )}

        {/* Categories Section - Hide when searching */}
        {!searchQuery && (
          <section className="bg-white rounded-lg shadow-sm p-4 mb-8 border border-gray-100">
            <div className="mb-4 border-b pb-2 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-700 uppercase">Kategori</h2>
              {categoryQuery && (
                <button onClick={() => {searchParams.delete('category'); setSearchParams(searchParams);}} className="text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20">
                  Lihat Semua
                </button>
              )}
            </div>
            {dbCategories.length === 0 ? (
               <div className="text-center py-6 text-gray-400 text-sm">Belum ada kategori di database.</div>
            ) : (
              <div className="grid grid-cols-4 md:grid-cols-10 gap-x-2 gap-y-4 pt-2">
                {dbCategories.map((cat) => (
                  <div 
                    key={cat.id} 
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="flex flex-col items-center justify-start cursor-pointer group"
                  >
                    <div className={`w-[52px] h-[52px] md:w-[60px] md:h-[60px] bg-white rounded-2xl flex items-center justify-center mb-2 shadow-sm border border-gray-100 group-hover:-translate-y-1 transition transform duration-200 ${
                      categoryQuery === cat.slug ? 'ring-2 ring-primary ring-offset-2 border-primary' : 'group-hover:border-primary/50 group-hover:shadow-md'
                    }`}>
                      {getCategoryIcon(cat.slug)}
                    </div>
                    <span className={`text-[10px] md:text-xs text-center leading-tight px-1 max-w-[80px] break-words ${categoryQuery === cat.slug ? 'text-primary font-bold' : 'text-gray-700'}`}>
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Product Recommendations */}
        <section id="products">
          <div className="bg-white border-b-4 border-primary sticky top-[60px] md:top-[116px] z-40 mb-4 rounded-t-lg shadow-sm">
            <h2 className="text-center py-4 text-primary font-bold uppercase text-lg">
              {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 
               categoryQuery ? `Kategori: ${dbCategories.find(c => c.slug === categoryQuery)?.name || categoryQuery}` : 
               'Rekomendasi Untukmu'}
            </h2>
          </div>
          
          {loading && page === 1 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 h-64 animate-pulse p-2">
                  <div className="bg-gray-200 w-full aspect-square mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 md:p-20 flex flex-col items-center justify-center text-center rounded-xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4 bg-gray-50 p-6 rounded-full inline-block">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Produk tidak ditemukan</h3>
              <p className="text-gray-500 max-w-md">Maaf, kami tidak dapat menemukan produk yang sesuai dengan pencarian atau filter Anda. Coba gunakan kata kunci lain.</p>
              {(searchQuery || categoryQuery) && (
                <button 
                  onClick={() => navigate('/')} 
                  className="mt-6 bg-primary text-white px-8 py-2.5 rounded-lg hover:bg-primary-hover font-bold transition shadow-sm"
                >
                  Lihat Semua Produk
                </button>
              )}
            </div>
          ) : (
            <>
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
                      <div className="flex items-center text-[10px] md:text-xs text-gray-500 justify-between mt-auto pt-2 border-t border-gray-50">
                        <span className="line-clamp-1 flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[8px] font-bold">✓</span>
                          {product.shops?.name || 'Waringin Store'}
                        </span>
                        <span className="shrink-0">Stok {product.stock}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 text-center">
                  <button 
                    onClick={loadMore} 
                    disabled={loading}
                    className="px-16 md:px-32 py-3 bg-white border border-primary text-primary font-bold rounded hover:bg-primary hover:text-white transition shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
