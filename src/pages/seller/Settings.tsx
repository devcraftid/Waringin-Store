import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Store, Link as LinkIcon, FileText, Camera, Save, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { shop } = useOutletContext<{ shop: any }>();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <SettingsIcon className="text-primary" size={28} /> Pengaturan Toko
        </h2>
        <p className="text-gray-500 mt-1">Sesuaikan identitas, deskripsi, dan preferensi toko Anda di sini.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-6 md:p-10 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2 border-b border-gray-100 pb-4">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          Profil Publik Toko
        </h3>
        
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer">
                <div className="w-36 h-36 bg-gray-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative z-10 transition-transform group-hover:scale-105">
                  <span className="text-6xl font-black text-gray-300 group-hover:text-primary transition-colors">{shop.name.charAt(0).toUpperCase()}</span>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={32} />
                  </div>
                </div>
                {/* Decorative background behind avatar */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-xl -z-10 group-hover:bg-primary/20 transition-colors"></div>
              </div>
              <span className="text-sm font-bold text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full">Ubah Logo Toko</span>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Store size={16} className="text-gray-400" /> Nama Toko
                </label>
                <input 
                  type="text" 
                  defaultValue={shop.name}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-gray-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <LinkIcon size={16} className="text-gray-400" /> URL Toko Tautan (Slug)
                </label>
                <div className="flex shadow-sm rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                  <span className="inline-flex items-center px-4 text-gray-400 text-sm font-medium border-r border-gray-200">
                    waringinstore.com/
                  </span>
                  <input 
                    type="text" 
                    defaultValue={shop.slug}
                    disabled
                    className="flex-1 min-w-0 block w-full px-4 py-3 bg-gray-100 text-gray-500 font-mono text-sm outline-none cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-gray-400 font-medium mt-1.5 flex items-center gap-1">
                  <Info size={12} /> Tautan URL bersifat permanen dan tidak dapat diubah lagi.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-1.5 pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <FileText size={16} className="text-gray-400" /> Deskripsi Singkat Toko
            </label>
            <textarea 
              rows={5}
              defaultValue={shop.description}
              placeholder="Beritahu pembeli mengapa mereka harus berbelanja di toko Anda..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none leading-relaxed text-gray-700"
            ></textarea>
          </div>
          
          <div className="flex justify-end pt-6">
            <button className="bg-primary text-white px-8 py-3.5 rounded-xl hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 font-bold transition-all duration-200 flex items-center gap-2">
              <Save size={18} strokeWidth={2.5} /> Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for small Info icon
const Info = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export default Settings;
