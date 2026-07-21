import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import MainLayout from '../components/MainLayout';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Pesanan tidak ditemukan atau kamu tidak punya akses.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <MainLayout>
      <div className="container py-4" style={{ maxWidth: 700 }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-spicy" />
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="card-soft p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h4 className="fw-bold mb-1">Invoice Pesanan</h4>
                <p className="text-muted small mb-0">#{order.order_number}</p>
              </div>
              <span className={`status-pill status-${order.status}`}>{order.status}</span>
            </div>

            <div className="row mb-4 small">
              <div className="col-6">
                <div className="text-muted">Tanggal Pesan</div>
                <div className="fw-semibold">
                  {new Date(order.created_at).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
              </div>
              <div className="col-6">
                <div className="text-muted">Metode Pembayaran</div>
                <div className="fw-semibold text-uppercase">{order.payment_method}</div>
              </div>
              <div className="col-12 mt-3">
                <div className="text-muted">Alamat Pengiriman</div>
                <div className="fw-semibold">{order.delivery_address}</div>
              </div>
              <div className="col-12 mt-3">
                <div className="text-muted">Nomor HP</div>
                <div className="fw-semibold">{order.phone}</div>
              </div>
              {order.notes && (
                <div className="col-12 mt-3">
                  <div className="text-muted">Catatan</div>
                  <div className="fw-semibold">{order.notes}</div>
                </div>
              )}
            </div>

            <hr />

            <table className="table align-middle">
              <thead>
                <tr className="text-muted small">
                  <th>Item</th>
                  <th>Level</th>
                  <th>Qty</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.id}>
                    <td className="fw-semibold">{it.product_name}</td>
                    <td>Lvl {it.spice_level}</td>
                    <td>{it.quantity}</td>
                    <td className="text-end">Rp {Number(it.subtotal).toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center border-top pt-3">
              <span className="fw-bold fs-5">Total</span>
              <span className="fw-bold fs-5 text-spicy">
                Rp {Number(order.total_price).toLocaleString('id-ID')}
              </span>
            </div>

            <Link to="/riwayat-pesanan" className="btn btn-outline-spicy w-100 mt-4">
              Kembali ke Riwayat Pesanan
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
