import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const Help = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Pusat Bantuan</h1>
          <p className="text-gray-600 mb-8">Temukan jawaban untuk semua pertanyaan Anda seputar layanan Waringin Store.</p>
          
          <div className="prose max-w-none text-gray-600">
            <p>Halaman ini saat ini berisi teks contoh. Anda dapat mengubah konten halaman ini di dalam file <code>src/pages/info/Help.tsx</code>.</p>
            <br/>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
