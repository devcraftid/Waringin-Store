import React from 'react';
import { Package, TrendingUp, AlertCircle, Wallet } from 'lucide-react';

const Overview = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Ringkasan Toko</h2>
        <p className="text-gray-500 mt-1">Pantau aktivitas penjualan dan performa toko Anda hari ini.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 border border-gray-100 flex flex-col justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Package size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pesanan Baru</span>
          </div>
          <p className="text-3xl font-black text-gray-800">0</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 border border-gray-100 flex flex-col justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <TrendingUp size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Siap Dikirim</span>
          </div>
          <p className="text-3xl font-black text-gray-800">0</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 border border-gray-100 flex flex-col justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
              <AlertCircle size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Produk Habis</span>
          </div>
          <p className="text-3xl font-black text-gray-800">0</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 border border-gray-100 flex flex-col justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Wallet size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saldo Tertahan</span>
          </div>
          <p className="text-2xl font-black text-gray-800">Rp 0</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 md:p-8 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          Langkah Memulai Penjualan
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-5 border rounded-xl bg-green-50/50 border-green-200/60 shadow-sm transition-all hover:bg-green-50">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              ✓
            </div>
            <div className="pt-0.5">
              <h4 className="font-bold text-gray-800 text-base">Profil Toko Dibuat</h4>
              <p className="text-sm text-gray-500 mt-1">Toko Anda sudah siap beroperasi dan dapat menerima pesanan.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 border rounded-xl bg-blue-50/50 border-blue-200/60 shadow-sm transition-all hover:bg-blue-50">
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              2
            </div>
            <div className="pt-0.5">
              <h4 className="font-bold text-gray-800 text-base">Tambah Produk Pertama</h4>
              <p className="text-sm text-gray-500 mt-1">Upload foto produk, isi detail, dan tentukan harga untuk mulai berjualan. Calon pembeli sedang menunggu!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
