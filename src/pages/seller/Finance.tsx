import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, History, Download } from 'lucide-react';

const Finance = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Keuangan Toko</h2>
        <p className="text-gray-500 mt-1">Pantau dan kelola pencairan dana serta riwayat mutasi toko Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary via-primary to-blue-700 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                <Wallet size={16} />
                <span className="font-bold text-sm">Saldo Aktif</span>
              </div>
            </div>
            <h3 className="text-4xl font-black mb-2 tracking-tight">Rp 0</h3>
            <p className="text-sm text-blue-100 font-medium">Siap ditarik ke rekening bank Anda</p>
            
            <button className="mt-8 w-full bg-white text-primary py-3.5 rounded-xl font-bold hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              Tarik Dana Sekarang
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-8 flex flex-col justify-center relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl group-hover:bg-yellow-500/10 transition-colors pointer-events-none"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <TrendingUp size={24} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pendapatan Tertunda</p>
            <h3 className="text-3xl font-black text-gray-800 mb-3">Rp 0</h3>
            <div className="flex items-center gap-2 text-sm text-yellow-600 font-bold bg-yellow-50 px-3 py-1.5 rounded-lg w-max">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              Menunggu pesanan selesai
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-8 flex flex-col justify-center relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-xl group-hover:bg-green-500/10 transition-colors pointer-events-none"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <DollarSign size={24} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pendapatan Bulan Ini</p>
            <h3 className="text-3xl font-black text-gray-800 mb-3">Rp 0</h3>
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
              Bulan lalu: <span className="flex items-center text-green-500 font-bold"><ArrowUpRight size={16} strokeWidth={3}/> +0%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            Riwayat Mutasi & Penarikan
          </h3>
          <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors">
            <Download size={16} /> Unduh Laporan
          </button>
        </div>
        <div className="p-16 md:p-24 flex flex-col items-center justify-center text-center bg-gray-50/50">
          <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-gray-300 mb-4 shadow-inner">
            <History size={40} />
          </div>
          <p className="text-lg font-bold text-gray-700">Belum Ada Transaksi</p>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">Riwayat penjualan, pencairan dana, dan mutasi saldo akan muncul di sini.</p>
        </div>
      </div>
    </div>
  );
};

export default Finance;
