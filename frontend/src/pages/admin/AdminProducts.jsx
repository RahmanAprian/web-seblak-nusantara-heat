import { useEffect, useState } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: 'seblak',
  is_available: true,
  image: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    api
      .get('/products')
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category,
      is_available: product.is_available,
      image: product.image || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, form);
      } else {
        await api.post('/products', form);
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan produk.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Hapus menu "${product.name}"?`)) return;
    await api.delete(`/products/${product.id}`);
    loadProducts();
  };

  const quickStockUpdate = async (product, delta) => {
    const newStock = Math.max(0, product.stock + delta);
    await api.put(`/products/${product.id}`, { stock: newStock });
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p)));
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Menu Seblak</h2>
          <p className="text-muted mb-0">Kelola menu, harga, dan stok porsi yang tersedia.</p>
        </div>
        <button className="btn btn-spicy" onClick={openCreate}>
          <i className="bi bi-plus-lg"></i> Tambah Menu
        </button>
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
                  <th>Nama</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="fw-semibold">{product.name}</td>
                    <td className="text-capitalize small text-muted">{product.category}</td>
                    <td>Rp {Number(product.price).toLocaleString('id-ID')}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => quickStockUpdate(product, -1)}
                        >
                          -
                        </button>
                        <span className={product.stock <= 5 ? 'text-danger fw-bold' : ''}>
                          {product.stock}
                        </span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => quickStockUpdate(product, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${product.is_available ? 'bg-success' : 'bg-secondary'}`}>
                        {product.is_available ? 'Tersedia' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-spicy me-2"
                        onClick={() => openEdit(product)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(product)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="card-soft p-4 bg-white"
            style={{ width: 480, maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-3">{editing ? 'Edit Menu' : 'Tambah Menu Baru'}</h5>
            <form onSubmit={handleSave}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Nama Menu</label>
                <input
                  className="form-control form-control-spicy"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Deskripsi</label>
                <textarea
                  className="form-control form-control-spicy"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Harga (Rp)</label>
                  <input
                    type="number"
                    className="form-control form-control-spicy"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min={0}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Stok</label>
                  <input
                    type="number"
                    className="form-control form-control-spicy"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                    min={0}
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Kategori</label>
                <input
                  className="form-control form-control-spicy"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="seblak / minuman / dll"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold">URL Gambar (opsional)</label>
                <input
                  className="form-control form-control-spicy"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.is_available}
                  onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                  id="isAvailable"
                />
                <label className="form-check-label small" htmlFor="isAvailable">
                  Tersedia untuk dijual
                </label>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-50"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-spicy w-50" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
