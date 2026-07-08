import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Create the profile manually (since we don't have a Postgres Trigger set up)
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: fullName,
              role: role,
            }
          ]);
          
        if (profileError) {
          console.error("Profile creation error:", profileError);
          // If profile fails, they still have an auth account but no profile.
          // In a real production app, use Postgres Triggers.
        }
      }

      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat pendaftaran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Daftar Akun</h1>
          <p className="text-gray-600">Bergabunglah dengan Waringin Store</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nama Lengkap"
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password (minimal 6 karakter)"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-gray-600 mb-2">Daftar sebagai:</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  value="customer" 
                  checked={role === 'customer'}
                  onChange={() => setRole('customer')}
                  className="text-primary focus:ring-primary"
                />
                <span>Pembeli</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  value="seller" 
                  checked={role === 'seller'}
                  onChange={() => setRole('seller')}
                  className="text-primary focus:ring-primary"
                />
                <span>Penjual</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-hover transition font-bold disabled:opacity-50 mt-4"
          >
            {loading ? 'Memproses...' : 'DAFTAR'}
          </button>
        </form>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>Sudah punya akun?</span>
          <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
