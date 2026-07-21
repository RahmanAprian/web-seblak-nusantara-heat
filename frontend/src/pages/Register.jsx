import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { HERO_PLACEHOLDER } from '../utils/placeholder';

const SIDE_IMG = HERO_PLACEHOLDER;

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    no_hp: '',
    alamat: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        setGeneralError(err.response.data.message || 'Data tidak valid.');
      } else {
        setGeneralError('Terjadi kesalahan. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 hero-gradient d-flex align-items-center py-5">
      <div className="container">
        <div className="card-soft mx-auto overflow-hidden" style={{ maxWidth: 950 }}>
          <div className="row g-0">
            <div
              className="col-md-5 d-none d-md-flex flex-column justify-content-end text-white p-4"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.1)), url(${SIDE_IMG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: 560,
              }}
            >
              <h3 className="fw-bold">Seblak Pedas</h3>
              <p className="mb-0">Level pedas yang bikin nagih, rasa autentik yang bikin rindu.</p>
            </div>
            <div className="col-md-7 p-5">
              <h2 className="fw-bold text-spicy mb-1">Gabung Sekarang</h2>
              <p className="text-muted mb-4">Mulai petualangan rasa pedasmu bersama kami.</p>

              {generalError && <div className="alert alert-danger py-2">{generalError}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-control form-control-spicy"
                    placeholder="Contoh: Budi Santoso"
                    value={form.name}
                    onChange={handleChange('name')}
                    required
                  />
                  {errors.name && <small className="text-danger">{errors.name[0]}</small>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Nomor HP</label>
                  <input
                    type="text"
                    className="form-control form-control-spicy"
                    placeholder="0812xxxx"
                    value={form.no_hp}
                    onChange={handleChange('no_hp')}
                    required
                  />
                  {errors.no_hp && <small className="text-danger">{errors.no_hp[0]}</small>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Alamat Lengkap</label>
                  <textarea
                    className="form-control form-control-spicy"
                    rows={2}
                    placeholder="Jl. Pedas No. 123, Bandung"
                    value={form.alamat}
                    onChange={handleChange('alamat')}
                    required
                  />
                  {errors.alamat && <small className="text-danger">{errors.alamat[0]}</small>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control form-control-spicy"
                      placeholder="Minimal 6 karakter"
                      value={form.password}
                      onChange={handleChange('password')}
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
                  {errors.password && <small className="text-danger">{errors.password[0]}</small>}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Konfirmasi Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control form-control-spicy"
                    placeholder="Ulangi password"
                    value={form.password_confirmation}
                    onChange={handleChange('password_confirmation')}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-spicy w-100 mb-3" disabled={loading}>
                  {loading ? 'Memproses...' : 'Daftar →'}
                </button>

                <p className="text-center text-muted small mb-0">
                  Sudah punya akun?{' '}
                  <Link to="/login" className="text-spicy fw-semibold">
                    Masuk di sini
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
