import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import MainLayout from '../components/MainLayout';
import SpiceLevelPicker from '../components/SpiceLevelPicker';

import { FOOD_PLACEHOLDER } from '../utils/placeholder';

const FALLBACK_IMG = FOOD_PLACEHOLDER;

export default function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalSpice, setGlobalSpice] = useState(3);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/products')
      .then((res) => setProducts(res.data.filter((p) => p.is_available && p.stock > 0)))
      .finally(() => setLoading(false));

    if (user) {
      setDeliveryAddress(user.alamat || '');
      setPhone(user.no_hp || '');
    }
  }, [user]);

  const handleAdd = (product) => {
    cart.addItem(product, 1, globalSpice);
  };

  const ongkir = cart.items.length > 0 ? 5000 : 0;
  const total = cart.subtotal + ongkir;

  const handleCheckout = async () => {
    setError('');
    if (cart.items.length === 0) return;
    if (!deliveryAddress || !phone) {
      setError('Alamat pengiriman dan nomor HP wajib diisi.');
      return;
    }
    setPlacing(true);
    try {
      const payload = {
        items: cart.items.map((it) => ({
          product_id: it.product.id,
          quantity: it.quantity,
          spice_level: it.spice_level,
        })),
        delivery_address: deliveryAddress,
        phone,
        notes,
      };
      const res = await api.post('/orders', payload);
      cart.clearCart();
      navigate(`/pesanan/${res.data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pesanan. Coba lagi.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-4">
        <h2 className="fw-bold mb-1">Halo, {user?.name?.split(' ')[0]}! 🔥</h2>
        <p className="text-muted mb-4">Siap untuk tantangan pedas hari ini? Pilih seblakmu sekarang.</p>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card-soft p-3 p-md-4 mb-4">
              <h6 className="fw-bold mb-3">Pilih Level Pedas (berlaku untuk item yang ditambahkan)</h6>
              <SpiceLevelPicker value={globalSpice} onChange={setGlobalSpice} />
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-spicy" />
              </div>
            ) : (
              <div className="row g-3">
                {products.map((product) => (
                  <div className="col-6 col-md-4" key={product.id}>
                    <div className="card-soft h-100">
                      <img
                        src={product.image || FALLBACK_IMG}
                        alt={product.name}
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                        style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: '1.25rem 1.25rem 0 0' }}
                      />
                      <div className="card-body">
                        <h6 className="fw-bold mb-1">{product.name}</h6>
                        <p className="text-muted small mb-2" style={{ minHeight: 36 }}>
                          {product.description}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-spicy">
                            Rp {Number(product.price).toLocaleString('id-ID')}
                          </span>
                          <button
                            className="btn btn-spicy btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 34, height: 34 }}
                            onClick={() => handleAdd(product)}
                          >
                            <i className="bi bi-plus-lg"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card-soft p-4 sticky-top" style={{ top: 90 }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Keranjang Saya</h5>
                <span className="badge bg-spicy rounded-pill">{cart.totalItems} Item</span>
              </div>

              {cart.items.length === 0 ? (
                <p className="text-muted small">Keranjang masih kosong. Yuk pilih seblaknya!</p>
              ) : (
                <>
                  <div className="mb-3" style={{ maxHeight: 260, overflowY: 'auto' }}>
                    {cart.items.map((it) => (
                      <div
                        className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom"
                        key={`${it.product.id}-${it.spice_level}`}
                      >
                        <img
                          src={it.product.image || FALLBACK_IMG}
                          alt={it.product.name}
                          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 10 }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold small">{it.product.name}</div>
                          <div className="text-muted" style={{ fontSize: 12 }}>
                            Lvl {it.spice_level}
                          </div>
                          <div className="fw-bold text-spicy small">
                            Rp {(it.product.price * it.quantity).toLocaleString('id-ID')}
                          </div>
                        </div>
                        <div className="d-flex flex-column align-items-end gap-1">
                          <button
                            className="btn btn-sm btn-link text-danger p-0"
                            title="Hapus item"
                            onClick={() => cart.removeItem(it.product.id, it.spice_level)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                it.quantity <= 1
                                  ? cart.removeItem(it.product.id, it.spice_level)
                                  : cart.updateQuantity(it.product.id, it.spice_level, -1)
                              }
                            >
                              -
                            </button>
                            <span>{it.quantity}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => cart.updateQuantity(it.product.id, it.spice_level, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Alamat Pengiriman</label>
                    <textarea
                      className="form-control form-control-spicy"
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Nomor HP</label>
                    <input
                      type="text"
                      className="form-control form-control-spicy"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Catatan (opsional)</label>
                    <input
                      type="text"
                      className="form-control form-control-spicy"
                      placeholder="Contoh: jangan pakai bawang goreng"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-between small mb-1">
                    <span>Subtotal</span>
                    <span>Rp {cart.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-2">
                    <span>Ongkir</span>
                    <span>Rp {ongkir.toLocaleString('id-ID')}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold mb-3">
                    <span>Total</span>
                    <span className="text-spicy">Rp {total.toLocaleString('id-ID')}</span>
                  </div>

                  {error && <div className="alert alert-danger py-2 small">{error}</div>}

                  <button className="btn btn-spicy w-100" onClick={handleCheckout} disabled={placing}>
                    {placing ? 'Memproses...' : 'Checkout Sekarang'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}