import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Layanan Pelanggan</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-primary">Bantuan</Link></li>
              <li><Link to="/" className="hover:text-primary">Metode Pembayaran</Link></li>
              <li><Link to="/" className="hover:text-primary">Lacak Pesanan</Link></li>
              <li><Link to="/" className="hover:text-primary">Gratis Ongkir</Link></li>
              <li><Link to="/" className="hover:text-primary">Pengembalian Barang & Dana</Link></li>
              <li><Link to="/" className="hover:text-primary">Garansi Waringin Store</Link></li>
              <li><Link to="/" className="hover:text-primary">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* About SkripShop */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Jelajahi Waringin Store</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-primary">Tentang Kami</Link></li>
              <li><Link to="/" className="hover:text-primary">Karir</Link></li>
              <li><Link to="/" className="hover:text-primary">Kebijakan Privasi</Link></li>
              <li><Link to="/" className="hover:text-primary">Syarat & Ketentuan</Link></li>
              <li><Link to="/" className="hover:text-primary">Blog Waringin Store</Link></li>
              <li><Link to="/seller" className="hover:text-primary">Seller Centre</Link></li>
              <li><Link to="/" className="hover:text-primary">Flash Sale</Link></li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Pembayaran</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-100 h-10 rounded flex items-center justify-center p-1 border">BCA</div>
              <div className="bg-gray-100 h-10 rounded flex items-center justify-center p-1 border">BNI</div>
              <div className="bg-gray-100 h-10 rounded flex items-center justify-center p-1 border">BRI</div>
              <div className="bg-gray-100 h-10 rounded flex items-center justify-center p-1 border">Mandiri</div>
              <div className="bg-gray-100 h-10 rounded flex items-center justify-center p-1 border">Qris</div>
              <div className="bg-gray-100 h-10 rounded flex items-center justify-center p-1 border text-xs">COD</div>
            </div>
            
            <h3 className="font-bold text-gray-900 mb-4 mt-6">Pengiriman</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-100 h-10 rounded flex items-center justify-center p-1 border text-xs text-center leading-none">Skrip<br/>Express</div>
              <div className="bg-gray-100 h-10 rounded flex items-center justify-center p-1 border text-xs">JNE</div>
              <div className="bg-gray-100 h-10 rounded flex items-center justify-center p-1 border text-xs">J&T</div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Ikuti Kami</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/" className="flex items-center gap-2 hover:text-primary">
                  <div className="bg-gray-100 p-2 rounded-full text-xs font-bold w-8 h-8 flex items-center justify-center">FB</div> Facebook
                </Link>
              </li>
              <li>
                <Link to="/" className="flex items-center gap-2 hover:text-primary">
                  <div className="bg-gray-100 p-2 rounded-full text-xs font-bold w-8 h-8 flex items-center justify-center">IG</div> Instagram
                </Link>
              </li>
              <li>
                <Link to="/" className="flex items-center gap-2 hover:text-primary">
                  <div className="bg-gray-100 p-2 rounded-full text-xs font-bold w-8 h-8 flex items-center justify-center">X</div> Twitter
                </Link>
              </li>
              <li>
                <Link to="/" className="flex items-center gap-2 hover:text-primary">
                  <div className="bg-gray-100 p-2 rounded-full text-xs font-bold w-8 h-8 flex items-center justify-center">YT</div> YouTube
                </Link>
              </li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Download Aplikasi Waringin Store</h3>
            <div className="flex gap-2">
              <div className="w-24 h-24 bg-gray-200 border rounded flex items-center justify-center text-xs text-gray-500">QR Code</div>
              <div className="flex flex-col gap-2 justify-center">
                <div className="w-24 h-10 bg-gray-800 text-white rounded flex items-center justify-center text-xs font-bold">App Store</div>
                <div className="w-24 h-10 bg-gray-800 text-white rounded flex items-center justify-center text-xs font-bold">Google Play</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2026 Waringin Store. Hak Cipta Dilindungi.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Negara: Indonesia</span>
            <span>Singapura</span>
            <span>Malaysia</span>
            <span>Thailand</span>
            <span>Taiwan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
