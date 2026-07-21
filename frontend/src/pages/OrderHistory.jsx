import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import MainLayout from '../components/MainLayout';

const ACTIVE_STATUSES = ['pending', 'diproses', 'diantar'];

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/my-orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const pastOrders = orders.filter((o) => !ACTIVE_STATUSES.includes(o.status));

  return (
    <MainLayout>
      <div className="container py-4">
        <h2 className="fw-bold mb-1">Riwayat Pesanan</h2>
        <p className="text-muted mb-4">Pantau seblak favoritmu dan pengiriman yang sedang berjalan.</p>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-spicy" />
          </div>
        ) : orders.length === 0 ? (
          <div className="card-soft p-5 text-center">
            <p className="text-muted mb-3">Kamu belum punya pesanan. Yuk pesan seblak pertamamu!</p>
            <Link to="/pesan" className="btn btn-spicy align-self-center">
              Pesan Sekarang
            </Link>
          </div>
        ) : (
          <>
            {activeOrders.length > 0 && (
              <>
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-fire text-spicy"></i> Pesanan Aktif
                </h5>
                <div className="row g-3 mb-5">
                  {activeOrders.map((order) => (
                    <div className="col-md-6" key={order.id}>
                      <OrderCard order={order} />
                    </div>
                  ))}
                </div>
              </>
            )}

            <h5 className="fw-bold mb-3">
              <i className="bi bi-clock-history"></i> Riwayat Pesanan
            </h5>
            <div className="table-responsive card-soft p-3">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="text-muted small">
                    <th>Order ID</th>
                    <th>Tanggal</th>
                    <th>Item</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pastOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-semibold">#{order.order_number}</td>
                      <td className="small text-muted">
                        {new Date(order.created_at).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="small">
                        {order.items.map((it) => it.product_name).join(', ')}
                      </td>
                      <td className="fw-semibold text-spicy">
                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                      </td>
                      <td>
                        <span className={`status-pill status-${order.status}`}>{order.status}</span>
                      </td>
                      <td>
                        <Link to={`/pesanan/${order.id}`} className="small fw-semibold text-spicy">
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {pastOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-3">
                        Belum ada riwayat pesanan selesai.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

function OrderCard({ order }) {
  return (
    <div className="card-soft p-3">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <div className="text-muted small">Order ID</div>
          <div className="fw-bold">#{order.order_number}</div>
        </div>
        <span className={`status-pill status-${order.status}`}>{order.status}</span>
      </div>
      <div className="small mb-2">
        {order.items.map((it) => (
          <div key={it.id}>
            {it.product_name} (x{it.quantity}) - Lvl {it.spice_level}
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span className="fw-bold text-spicy">
          Rp {Number(order.total_price).toLocaleString('id-ID')}
        </span>
        <Link to={`/pesanan/${order.id}`} className="btn btn-sm btn-outline-spicy">
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
