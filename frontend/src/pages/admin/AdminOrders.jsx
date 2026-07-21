import { useEffect, useState } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const STATUS_OPTIONS = ['pending', 'diproses', 'diantar', 'selesai', 'dibatalkan'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    api
      .get('/orders', { params: { status: filter } })
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleStatusChange = async (order, status) => {
    setUpdatingId(order.id);
    try {
      await api.patch(`/orders/${order.id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    } catch (e) {
      alert('Gagal memperbarui status pesanan.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Kelola Pesanan</h2>
          <p className="text-muted mb-0">Pantau dan ubah status pesanan pelanggan.</p>
        </div>
        <select
          className="form-select form-control-spicy w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Semua Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="card-soft p-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-spicy" />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-muted small">
                  <th>Order</th>
                  <th>Pelanggan</th>
                  <th>Item</th>
                  <th>Alamat</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="fw-semibold small">#{order.order_number}</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>
                        {new Date(order.created_at).toLocaleString('id-ID', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold small">{order.user?.name}</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>
                        {order.phone}
                      </div>
                    </td>
                    <td className="small" style={{ maxWidth: 220 }}>
                      {order.items.map((it) => `${it.product_name} (x${it.quantity}, Lvl ${it.spice_level})`).join(', ')}
                    </td>
                    <td className="small text-muted" style={{ maxWidth: 180 }}>
                      {order.delivery_address}
                    </td>
                    <td className="fw-semibold">
                      Rp {Number(order.total_price).toLocaleString('id-ID')}
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm form-control-spicy"
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      Tidak ada pesanan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
