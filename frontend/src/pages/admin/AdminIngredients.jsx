import { useEffect, useState } from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const EMPTY_FORM = { name: '', unit: 'kg', stock_quantity: '', min_threshold: '' };

export default function AdminIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadIngredients = () => {
    setLoading(true);
    api
      .get('/ingredients')
      .then((res) => setIngredients(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (ingredient) => {
    setEditing(ingredient);
    setForm({
      name: ingredient.name,
      unit: ingredient.unit,
      stock_quantity: ingredient.stock_quantity,
      min_threshold: ingredient.min_threshold,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/ingredients/${editing.id}`, form);
      } else {
        await api.post('/ingredients', form);
      }
      setShowModal(false);
      loadIngredients();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan bahan baku.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ingredient) => {
    if (!confirm(`Hapus bahan baku "${ingredient.name}"?`)) return;
    await api.delete(`/ingredients/${ingredient.id}`);
    loadIngredients();
  };

  const quickAdjust = async (ingredient, delta) => {
    const newQty = Math.max(0, Number(ingredient.stock_quantity) + delta);
    await api.put(`/ingredients/${ingredient.id}`, { stock_quantity: newQty });
    setIngredients((prev) =>
      prev.map((i) => (i.id === ingredient.id ? { ...i, stock_quantity: newQty } : i))
    );
  };

  const statusOf = (ingredient) => {
    const ratio = ingredient.stock_quantity / (ingredient.min_threshold || 1);
    if (ingredient.stock_quantity <= ingredient.min_threshold) return { label: 'Menipis', color: 'danger' };
    if (ratio <= 1.5) return { label: 'Waspada', color: 'warning' };
    return { label: 'Aman', color: 'success' };
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Stok Bahan Baku</h2>
          <p className="text-muted mb-0">Pantau ketersediaan bahan baku dapur.</p>
        </div>
        <button className="btn btn-spicy" onClick={openCreate}>
          <i className="bi bi-plus-lg"></i> Tambah Bahan
        </button>
      </div>

      <div className="row g-3">
        {loading ? (
          <div className="text-center py-5 col-12">
            <div className="spinner-border text-spicy" />
          </div>
        ) : (
          ingredients.map((ingredient) => {
            const status = statusOf(ingredient);
            return (
              <div className="col-md-6 col-lg-4" key={ingredient.id}>
                <div className="card-soft p-3 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{ingredient.name}</h6>
                    <span className={`badge bg-${status.color}`}>{status.label}</span>
                  </div>
                  <p className="text-muted small mb-2">
                    {Number(ingredient.stock_quantity).toLocaleString('id-ID')} {ingredient.unit} / min{' '}
                    {Number(ingredient.min_threshold).toLocaleString('id-ID')} {ingredient.unit}
                  </p>
                  <div className="progress mb-3" style={{ height: 8 }}>
                    <div
                      className={`progress-bar bg-${status.color}`}
                      style={{
                        width: `${Math.min(100, (ingredient.stock_quantity / (ingredient.min_threshold * 3 || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => quickAdjust(ingredient, -1)}>
                        -1
                      </button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => quickAdjust(ingredient, 1)}>
                        +1
                      </button>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline-spicy me-2" onClick={() => openEdit(ingredient)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ingredient)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
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
            style={{ width: 420, maxWidth: '92vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-3">{editing ? 'Edit Bahan Baku' : 'Tambah Bahan Baku'}</h5>
            <form onSubmit={handleSave}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Nama Bahan</label>
                <input
                  className="form-control form-control-spicy"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Satuan</label>
                <input
                  className="form-control form-control-spicy"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="kg / gram / pcs / butir"
                  required
                />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Stok Saat Ini</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control form-control-spicy"
                    value={form.stock_quantity}
                    onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                    required
                    min={0}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Batas Minimum</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control form-control-spicy"
                    value={form.min_threshold}
                    onChange={(e) => setForm({ ...form, min_threshold: e.target.value })}
                    required
                    min={0}
                  />
                </div>
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
