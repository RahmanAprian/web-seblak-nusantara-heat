import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import MainLayout from '../components/MainLayout';
import ProductCard from '../components/ProductCard';

const HERO_IMG = '/img/images.jpg';

export default function Landing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('semua');
  const { user } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['semua', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    if (activeCategory === 'semua') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleAdd = (product) => {
    if (!user) {
      navigate('/login', { state: { from: '/pesan' } });
      return;
    }
    cart.addItem(product, 1, 3);
    navigate('/pesan');
  };

  const handleOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: '/pesan' } });
    } else {
      navigate('/pesan');
    }
  };

  return (
    <MainLayout>
      {/* Hero */}
      <section className="hero-gradient py-5">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge-spice active mb-3 d-inline-flex">
                🌶️ Pedasnya Juara, Rasanya Nagih
              </span>
              <h1 className="display-5 mb-3" style={{ lineHeight: 1.1 }}>
                Elevasi <span className="text-spicy fst-italic">Street Food</span> ke Level
                Gastronomi Premium.
              </h1>
              <p className="text-muted fs-6 mb-4">
                Nikmati keajaiban kerupuk basah dengan racikan bumbu kencur autentik dan level
                pedas yang bisa kamu kendalikan. Dibuat dari bahan pilihan untuk pengalaman rasa
                tak terlupakan.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <button className="btn btn-spicy btn-lg" onClick={handleOrderClick}>
                  Pesan Sekarang
                </button>
                <a href="#menu" className="btn btn-outline-spicy btn-lg">
                  Lihat Menu
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                src={HERO_IMG}
                alt="Seblak Pedas"
                className="img-fluid rounded-4 shadow"
                style={{ maxHeight: 380, width: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="container py-5" id="menu">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Menu Unggulan Kami</h2>
          <p className="text-muted">
            Varian seblak paling favorit yang diracik khusus untuk memanjakan lidah para pecinta
            kuliner pedas Nusantara.
          </p>
        </div>

        <div className="chip-scroll mb-4 justify-content-center flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`badge-spice ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'semua' ? 'Semua Menu' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-spicy" />
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((product) => (
              <div className="col-6 col-md-4 col-lg-3" key={product.id}>
                <ProductCard product={product} onAdd={handleAdd} requireLoginNotice={!user} />
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted">Belum ada menu di kategori ini.</p>
            )}
          </div>
        )}
      </section>

      {/* Why us */}
      <section className="py-5" style={{ backgroundColor: 'var(--cream-dim)' }}>
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <h2 className="fw-bold mb-3">
                Kenapa Memilih <span className="text-spicy">Seblak Pedas Gastronomy</span>?
              </h2>
              <p className="text-muted">
                Kami mendefinisikan ulang standar kualitas seblak di Indonesia dengan komitmen
                pada rasa dan kebersihan.
              </p>
            </div>
            <div className="col-lg-7">
              <div className="row g-3">
                {[
                  ['bi-basket2-fill', 'Bahan 100% Segar', 'Setiap hari kami hanya menggunakan kerupuk dan bumbu rempah yang baru diolah.'],
                  ['bi-fire', 'Kontrol Level Pedas', 'Satu-satunya seblak dengan takaran gramasi pedas konsisten untuk setiap pesanan Anda.'],
                  ['bi-lightning-charge-fill', 'Pengiriman Kilat', 'Optimasi logistik memastikan seblak sampai di tangan Anda dalam kondisi masih panas.'],
                  ['bi-patch-check-fill', 'Higienis & Halal', 'Dapur modern bersertifikat Halal MUI menjamin ketenangan santap Anda.'],
                ].map(([icon, title, desc]) => (
                  <div className="col-sm-6" key={title}>
                    <div className="card-soft p-3 h-100">
                      <div
                        className="mb-2 d-flex align-items-center justify-content-center rounded-3"
                        style={{ width: 42, height: 42, backgroundColor: 'rgba(255,143,6,0.15)' }}
                      >
                        <i className={`bi ${icon} text-spicy fs-5`}></i>
                      </div>
                      <h6 className="fw-bold mb-1">{title}</h6>
                      <p className="text-muted small mb-0">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container my-5">
        <div className="bg-spicy rounded-4 p-5 text-white text-center position-relative overflow-hidden">
          <h2 className="fw-bold mb-3">Sudah Siap Merasakan Sensasi Pedasnya?</h2>
          <p className="mb-4 opacity-75">
            Gabung dengan ribuan pecinta seblak lainnya dan nikmati level pedas favoritmu, kapan
            saja kamu mau.
          </p>
          {!user ? (
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/daftar" className="btn btn-light btn-lg fw-bold">
                Daftar Sekarang
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg">
                Sudah Punya Akun
              </Link>
            </div>
          ) : (
            <button className="btn btn-light btn-lg fw-bold" onClick={handleOrderClick}>
              Pesan Sekarang
            </button>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
