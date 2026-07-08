import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const CheckoutSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 max-w-lg w-full text-center">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Pesanan Berhasil Dibuat!
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Terima kasih telah berbelanja di Waringin Store. Pesanan Anda telah kami teruskan ke penjual terkait dan sedang menunggu konfirmasi.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Package size={18} className="text-primary" /> Langkah Selanjutnya
            </h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>Silakan lakukan pembayaran sesuai instruksi.</li>
              <li>Penjual akan memproses pesanan Anda setelah pembayaran dikonfirmasi.</li>
              <li>Pantau status pesanan Anda di halaman Profil.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/profile" 
              className="bg-primary/10 text-primary border border-primary font-bold px-6 py-3 rounded-lg hover:bg-primary/20 transition flex items-center justify-center gap-2"
            >
              Lihat Pesanan Saya
            </Link>
            <Link 
              to="/" 
              className="bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-primary-hover transition flex items-center justify-center gap-2"
            >
              Kembali Belanja <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
