import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, QrCode, Building, CreditCard, User, Upload, Camera } from 'lucide-react';

const SystemSettings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    bank_name: '',
    bank_account_number: '',
    bank_account_name: ''
  });
  
  const [qrisPreview, setQrisPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settingsId, setSettingsId] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // Ignore not found
      
      if (data) {
        setSettingsId(data.id);
        setFormData({
          bank_name: data.bank_name || '',
          bank_account_number: data.bank_account_number || '',
          bank_account_name: data.bank_account_name || ''
        });
        setQrisPreview(data.qris_image_url || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrisPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const payload = {
        bank_name: formData.bank_name,
        bank_account_number: formData.bank_account_number,
        bank_account_name: formData.bank_account_name,
        qris_image_url: qrisPreview
      };

      if (settingsId) {
        const { error } = await supabase
          .from('site_settings')
          .update(payload)
          .eq('id', settingsId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([payload]);
        if (error) throw error;
      }
      
      setMessage('Pengaturan berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error: any) {
      console.error('Error saving settings:', error);
      alert('Gagal menyimpan: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const bankOptions = [
    'BCA', 'Mandiri', 'BNI', 'BRI', 'BSI', 'CIMB Niaga', 'Permata', 'Danamon', 'Jago', 'SeaBank'
  ];

  if (loading) {
    return <div className="p-8">Memuat pengaturan...</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          Pengaturan Sistem
        </h2>
        <p className="text-gray-500 mt-1">Kelola data rekening bank dan QRIS untuk metode pembayaran pembeli.</p>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-100 flex items-center gap-3 shadow-sm font-bold animate-in fade-in">
          <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 mb-6 overflow-hidden">
        
        {/* QRIS Upload */}
        <div className="p-6 md:p-10 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2 border-b border-gray-100 pb-4">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            Metode Pembayaran: QRIS
          </h3>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4">
              <div 
                onClick={triggerFileInput}
                className="relative group cursor-pointer"
              >
                <div className="w-64 h-80 bg-gray-50 rounded-xl flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative z-10 transition-transform group-hover:scale-105">
                  {qrisPreview ? (
                    <img src={qrisPreview} alt="QRIS" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 group-hover:text-primary transition-colors">
                      <QrCode size={64} className="mb-2" />
                      <span className="text-sm font-bold">Upload QRIS</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white mb-1" size={28} />
                    <span className="text-white text-xs font-bold">Ganti Gambar</span>
                  </div>
                </div>
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
            
            <div className="flex-1">
              <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800">
                Gambar QRIS ini akan ditampilkan kepada pembeli saat mereka memilih metode pembayaran <strong>QRIS</strong> di halaman Checkout. Pastikan gambar jelas dan mudah di-scan oleh aplikasi *mobile banking* atau *e-wallet*.
              </p>
            </div>
          </div>
        </div>

        {/* Bank Data */}
        <div className="p-6 md:p-10 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-200 pb-4">
            <div className="w-2 h-6 bg-green-500 rounded-full"></div>
            Metode Pembayaran: Transfer Bank
          </h3>
          <p className="text-sm text-gray-500 mb-8">Informasi rekening ini akan ditampilkan saat pembeli memilih metode pembayaran Transfer Bank.</p>
          
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
                <User size={16} className="text-gray-400" /> Atas Nama <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="bank_account_name"
                required
                value={formData.bank_account_name}
                onChange={handleChange}
                placeholder="Contoh: PT Waringin Store"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-gray-800"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100 flex justify-end bg-white">
          <button 
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-8 py-3.5 rounded-xl hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 font-bold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-none"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><Save size={18} strokeWidth={2.5} /> Simpan Pengaturan</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
