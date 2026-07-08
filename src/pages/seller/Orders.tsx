import React from 'react';
import { Package, Search, Filter, Box } from 'lucide-react';

const Orders = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Pesanan Pelanggan</h2>
        <p className="text-gray-500 mt-1">Kelola dan pantau semua pesanan yang masuk ke toko Anda.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="px-6 md:px-8 border-b border-gray-100 bg-gray-50/50 flex overflow-x-auto scrollbar-hide">
          <button className="text-primary font-bold border-b-2 border-primary py-4 px-4 whitespace-nowrap">Semua Pesanan</button>
          <button className="text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-100/50 py-4 px-4 whitespace-nowrap transition-colors">Perlu Dikirim</button>
          <button className="text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-100/50 py-4 px-4 whitespace-nowrap transition-colors">Dikirim</button>
          <button className="text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-100/50 py-4 px-4 whitespace-nowrap transition-colors">Selesai</button>
          <button className="text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-100/50 py-4 px-4 whitespace-nowrap transition-colors">Dibatalkan</button>
        </div>
        
        {/* Filters */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-white flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari Nomor Pesanan atau Nama Pembeli..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm shadow-sm"
            />
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-medium transition-all shadow-sm">
            <Filter size={18} />
            Filter Lanjutan
          </button>
        </div>

        {/* Empty State */}
        <div className="p-16 md:p-24 flex flex-col items-center justify-center text-center bg-gray-50/30">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6 shadow-inner border border-gray-200/60">
            <Box size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Pesanan</h3>
          <p className="text-gray-500 text-sm max-w-md leading-relaxed">
            Saat ini toko Anda belum memiliki pesanan masuk. Terus promosikan produk Anda agar pembeli berdatangan!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Orders;
