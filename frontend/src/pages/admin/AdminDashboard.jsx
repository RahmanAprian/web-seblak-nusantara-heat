import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/dashboard/summary'), api.get('/orders')])
      .then(([summaryRes, ordersRes]) => {
        setSummary(summaryRes.data);
        setOrders(ordersRes.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-5">
          <div className="spinner-border text-spicy" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h2 className="fw-bold mb-1">Selamat Datang, Admin</h2>
      <p className="text-muted mb-4">Berikut ringkasan performa Seblak Pedas hari ini.</p>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card-soft p-4 d-flex flex-row justify-content-between align-items-center">
            <div>
              <div className="text-muted small">Total Pesanan Hari Ini</div>
              <div className="fs-3 fw-bold">{summary.today_orders}</div>
              <small className="text-muted">{summary.pending_orders} menunggu diproses</small>
            </div>
            <div
              className="rounded-3 d-flex align-items-center justify-content-center"
              style={{ width: 48, height: 48, backgroundColor: 'rgba(255,143,6,0.15)' }}
            >
              <i className="bi bi-cart3 text-spicy fs-4"></i>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-soft p-4 d-flex flex-row justify-content-between align-items-center">
            <div>
              <div className="text-muted small">Pendapatan Hari Ini</div>
              <div className="fs-3 fw-bold">
                Rp {Number(summary.today_revenue).toLocaleString('id-ID')}
              </div>
            </div>
            <div
              className="rounded-3 d-flex align-items-center justify-content-center"
              style={{ width: 48, height: 48, backgroundColor: 'rgba(255,143,6,0.15)' }}
            >
              <i className="bi bi-graph-up-arrow text-spicy fs-4"></i>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card-soft p-4 d-flex flex-row justify-content-between align-items-center"
            style={{ borderLeft: '4px solid var(--danger)' }}
          >
            <div>
              <div className="text-muted small">Bahan Baku Menipis</div>
              <div className="fs-3 fw-bold text-danger">{summary.low_stock_ingredients.length}</div>
              <small className="text-muted">
                {summary.low_stock_ingredients.map((i) => i.name).join(', ') || 'Aman semua'}
              </small>
            </div>
            <div
              className="rounded-3 d-flex align-items-center justify-content-center"
              style={{ width: 48, height: 48, backgroundColor: 'rgba(186,26,26,0.12)' }}
            >
              <i className="bi bi-exclamation-triangle-fill text-danger fs-4"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="card-soft p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Pesanan Terbaru</h6>
              <Link to="/admin/pesanan" className="small fw-semibold text-spicy">
                Lihat Semua
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="text-muted small">
                    <th>Pelanggan</th>
                    <th>Item</th>
                    <th>Status</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <div className="fw-semibold small">{order.user?.name}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>
                          #{order.order_number}
                        </div>
                      </td>
                      <td className="small">
                        {order.items.map((it) => it.product_name).join(', ')}
                      </td>
                      <td>
                        <span className={`status-pill status-${order.status}`}>{order.status}</span>
                      </td>
                      <td className="text-end fw-semibold">
                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-3">
                        Belum ada pesanan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card-soft p-4">
            <h6 className="fw-bold mb-3">Stok Menu Menipis</h6>
            {summary.low_stock_products.length === 0 ? (
              <p className="text-muted small mb-0">Semua stok menu masih aman.</p>
            ) : (
              summary.low_stock_products.map((p) => (
                <div key={p.id} className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-semibold">{p.name}</span>
                    <span className="text-danger fw-semibold">{p.stock} tersisa</span>
                  </div>
                  <div className="progress" style={{ height: 6 }}>
                    <div
                      className="progress-bar progress-bar-spicy"
                      style={{ width: `${Math.min(100, (p.stock / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
            <Link to="/admin/bahan-baku" className="btn btn-outline-spicy w-100 mt-2">
              Kelola Stok Bahan Baku
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
