import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Store, Link as LinkIcon, AlignLeft } from 'lucide-react';

const ShopSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(generateSlug(newName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      const { error: dbError } = await supabase
        .from('shops')
        .insert([
          {
            owner_id: user.id,
            name,
            slug,
            description,
          }
        ]);

      if (dbError) {
        if (dbError.code === '23505') {
          throw new Error('Slug (URL Toko) sudah digunakan. Silakan pilih nama lain.');
        }
        throw dbError;
      }

      // Success, redirect to seller dashboard
      navigate('/seller');
    } catch (err: any) {
      setError(err.message || 'Gagal membuat toko.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 overflow-hidden relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-primary/20">
            <Store size={32} strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Buka Toko Anda</h1>
          <p className="text-gray-500 max-w-md mx-auto">Langkah pertama menuju kesuksesan. Lengkapi informasi dasar untuk mulai berjualan di Waringin Store.</p>
        </div>

        {error && (
          <div className="relative z-10 bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <span className="font-bold text-lg">!</span>
            </div>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <Store size={16} className="text-gray-400" />
              Nama Toko <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={50}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
              placeholder="Contoh: Waringin Store Official"
              value={name}
              onChange={handleNameChange}
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <LinkIcon size={16} className="text-gray-400" />
              URL Toko (Slug) <span className="text-red-500">*</span>
            </label>
            <div className="flex shadow-sm rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200">
              <span className="inline-flex items-center px-4 bg-gray-100 text-gray-500 text-sm font-medium border-r border-gray-200 select-none">
                waringinstore.com/
              </span>
              <input
                type="text"
                required
                className="flex-1 min-w-0 block w-full px-4 py-3 bg-gray-50/50 focus:bg-white border-0 outline-none"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5 ml-1">Karakter unik yang akan digunakan sebagai tautan (link) toko Anda. Hanya huruf, angka, dan strip (-).</p>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <AlignLeft size={16} className="text-gray-400" />
              Deskripsi Toko
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none resize-none"
              placeholder="Jelaskan secara singkat apa yang toko Anda jual agar pembeli lebih tertarik..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading || !name || !slug}
              className="w-full bg-primary text-white py-3.5 rounded-xl hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? 'Memproses Data...' : 'Buka Toko Sekarang'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Dengan membuka toko, Anda menyetujui Syarat & Ketentuan Waringin Store.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSetup;
