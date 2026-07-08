import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Store, Link as LinkIcon, FileText, Camera, Save, Settings as SettingsIcon, Building, CreditCard, User, Upload } from 'lucide-react';

const Settings = () => {
  const { shop } = useOutletContext<{ shop: any }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: shop.name || '',
    description: shop.description || '',
    bank_name: shop.bank_name || '',
    bank_account_number: shop.bank_account_number || '',
    bank_account_name: shop.bank_account_name || ''
  });
  
  const [logoPreview, setLogoPreview] = useState<string>(shop.logo_url || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Ukuran gambar maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase
        .from('shops')
        .update({
          name: formData.name,
          description: formData.description,
          bank_name: formData.bank_name,
          bank_account_number: formData.bank_account_number,
          bank_account_name: formData.bank_account_name,
          logo_url: logoPreview
        })
        .eq('id', shop.id);

      if (error) throw error;
      
      setMessage('Pengaturan toko & rekening berhasil disimpan!');
      
      // Auto-hide message
      setTimeout(() => {
        setMessage('');
      }, 3000);
      
      // Force reload to update context across components
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error updating shop:', error);
      alert('Gagal menyimpan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const bankOptions = [
    'BCA', 'Mandiri', 'BNI', 'BRI', 'BSI', 'CIMB Niaga', 'Permata', 'Danamon', 'Jago', 'SeaBank'
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <SettingsIcon className="text-primary" size={28} /> Pengaturan Toko
        </h2>
        <p className="text-gray-500 mt-1">Sesuaikan identitas toko dan data rekening pencairan Anda.</p>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-100 flex items-center gap-3 shadow-sm font-bold animate-in fade-in">
          <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 mb-6 overflow-hidden">
        {/* Profil Toko */}
        <div className="p-6 md:p-10 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2 border-b border-gray-100 pb-4">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            Profil Publik Toko
          </h3>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-4">
                <div 
                  onClick={triggerFileInput}
                  className="relative group cursor-pointer"
                >
                  <div className="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative z-10 transition-transform group-hover:scale-105">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Toko" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl font-black text-gray-300 group-hover:text-primary transition-colors">{formData.name.charAt(0).toUpperCase()}</span>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white mb-1" size={28} />
                      <span className="text-white text-xs font-bold">Ubah Logo</span>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-xl -z-10 group-hover:bg-primary/20 transition-colors"></div>
                </div>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full flex items-center gap-1">
                  <Upload size={12} /> Format JPG/PNG (Maks 2MB)
                </span>
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Store size={16} className="text-gray-400" /> Nama Toko <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-gray-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <LinkIcon size={16} className="text-gray-400" /> URL Toko Tautan (Slug)
                  </label>
                  <div className="flex shadow-sm rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                    <span className="inline-flex items-center px-4 text-gray-400 text-sm font-medium border-r border-gray-200">
                      waringinstore.com/shop/
                    </span>
                    <input 
                      type="text" 
                      value={shop.slug}
                      disabled
                      className="flex-1 min-w-0 block w-full px-4 py-3 bg-gray-100 text-gray-500 font-mono text-sm outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5 pt-4">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <FileText size={16} className="text-gray-400" /> Deskripsi Singkat Toko
              </label>
              <textarea 
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Beritahu pembeli mengapa mereka harus berbelanja di toko Anda..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none leading-relaxed text-gray-700"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Data Rekening */}
        <div className="p-6 md:p-10 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-200 pb-4">
            <div className="w-2 h-6 bg-green-500 rounded-full"></div>
            Data Rekening Pencairan
          </h3>
          <p className="text-sm text-gray-500 mb-8">Informasi ini diperlukan untuk menarik dana dari hasil penjualan Anda. Pastikan nama rekening sesuai.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Building size={16} className="text-gray-400" /> Nama Bank <span className="text-red-500">*</span>
              </label>
              <select 
                name="bank_name"
                required
                value={formData.bank_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-gray-800"
              >
                <option value="" disabled>Pilih Bank</option>
                {bankOptions.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <CreditCard size={16} className="text-gray-400" /> Nomor Rekening <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="bank_account_number"
                required
                value={formData.bank_account_number}
                onChange={handleChange}
                placeholder="Contoh: 1234567890"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-gray-800"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <User size={16} className="text-gray-400" /> Nama Pemilik Rekening <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="bank_account_name"
                required
                value={formData.bank_account_name}
                onChange={handleChange}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-gray-800"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100 flex justify-end bg-white">
          <button 
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-8 py-3.5 rounded-xl hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 font-bold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><Save size={18} strokeWidth={2.5} /> Simpan Perubahan</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
