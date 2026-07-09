const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'Help', title: 'Pusat Bantuan', desc: 'Temukan jawaban untuk semua pertanyaan Anda seputar layanan Waringin Store.' },
  { name: 'Payment', title: 'Metode Pembayaran', desc: 'Informasi mengenai berbagai metode pembayaran yang kami terima.' },
  { name: 'Shipping', title: 'Pengiriman & Gratis Ongkir', desc: 'Informasi terkait jasa kurir, durasi pengiriman, dan promo gratis ongkir.' },
  { name: 'Returns', title: 'Pengembalian Barang & Dana', desc: 'Panduan lengkap cara mengajukan retur atau pengembalian dana.' },
  { name: 'Warranty', title: 'Garansi Waringin Store', desc: 'Syarat dan ketentuan garansi perlindungan produk dari Waringin Store.' },
  { name: 'Contact', title: 'Hubungi Kami', desc: 'Layanan pelanggan kami siap membantu Anda 24/7.' },
  { name: 'About', title: 'Tentang Kami', desc: 'Mengenal lebih dekat visi, misi, dan perjalanan Waringin Store.' },
  { name: 'Careers', title: 'Karir', desc: 'Bergabunglah bersama tim kami dan bangun masa depan e-commerce bersama.' },
  { name: 'Privacy', title: 'Kebijakan Privasi', desc: 'Bagaimana kami melindungi dan mengelola data pribadi Anda.' },
  { name: 'Terms', title: 'Syarat & Ketentuan', desc: 'Peraturan dan ketentuan penggunaan platform Waringin Store.' },
  { name: 'Blog', title: 'Blog Waringin Store', desc: 'Artikel, tips, dan berita terbaru seputar dunia belanja online.' },
];

const dir = path.join(__dirname, '../src/pages/info');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

pages.forEach(p => {
  const content = `import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const ${p.name} = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">${p.title}</h1>
          <p className="text-gray-600 mb-8">${p.desc}</p>
          
          <div className="prose max-w-none text-gray-600">
            <p>Halaman ini saat ini berisi teks contoh. Anda dapat mengubah konten halaman ini di dalam file <code>src/pages/info/${p.name}.tsx</code>.</p>
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

export default ${p.name};
`;

  fs.writeFileSync(path.join(dir, `${p.name}.tsx`), content);
});

console.log('Successfully generated 11 info pages!');
