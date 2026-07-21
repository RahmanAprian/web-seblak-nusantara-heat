import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { HERO_PLACEHOLDER } from '../utils/placeholder';

const SIDE_IMG = HERO_PLACEHOLDER;

export default function Login() {
  const [no_hp, setNoHp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(no_hp, password);
      const redirectTo = location.state?.from || (user.role === 'admin' ? '/admin' : '/');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal login. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 hero-gradient d-flex align-items-center py-5">
      <div className="container">
        <div className="card-soft mx-auto overflow-hidden" style={{ maxWidth: 900 }}>
          <div className="row g-0">
            <div
              className="col-md-5 d-none d-md-block"
              style={{
                backgroundImage: `url(${SIDE_IMG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: 480,
              }}
            />
            <div className="col-md-7 p-5">
              <h2 className="fw-bold text-spicy mb-1">Selamat Datang Kembali</h2>
              <p className="text-muted mb-4">Masuk untuk melanjutkan pesanan pedasmu.</p>

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nomor HP</label>
                  <input
                    type="text"
                    className="form-control form-control-spicy"
                    placeholder="0812xxxx"
                    value={no_hp}
                    onChange={(e) => setNoHp(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control form-control-spicy"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword((s) => !s)}
                      tabIndex={-1}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-spicy w-100 mb-3" disabled={loading}>
                  {loading ? 'Memproses...' : 'Masuk'}
                </button>
                <p className="text-center text-muted small mb-0">
                  Belum punya akun?{' '}
                  <Link to="/daftar" className="text-spicy fw-semibold">
                    Daftar sekarang
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
