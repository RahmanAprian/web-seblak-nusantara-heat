import { FOOD_PLACEHOLDER } from '../utils/placeholder';

const FALLBACK_IMG = FOOD_PLACEHOLDER;

export default function ProductCard({ product, onAdd, requireLoginNotice }) {
  const isOut = product.stock <= 0 || !product.is_available;

  return (
    <div className="card card-soft h-100 overflow-hidden">
      <div style={{ position: 'relative' }}>
        <img
          src={product.image || FALLBACK_IMG}
          alt={product.name}
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
          style={{ width: '100%', height: 180, objectFit: 'cover' }}
        />
        {isOut && (
          <span className="position-absolute top-0 start-0 m-2 badge bg-secondary">
            Stok Habis
          </span>
        )}
        {onAdd && !isOut && (
          <button
            className="btn btn-spicy position-absolute d-flex align-items-center justify-content-center"
            style={{
              bottom: -18,
              right: 16,
              width: 42,
              height: 42,
              borderRadius: '50%',
              padding: 0,
            }}
            onClick={() => onAdd(product)}
            title="Tambah ke keranjang"
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        )}
      </div>
      <div className="card-body pt-4">
        <h6 className="fw-bold mb-1">{product.name}</h6>
        <p className="text-muted small mb-2" style={{ minHeight: 40 }}>
          {product.description}
        </p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold text-spicy fs-6">
            Rp {Number(product.price).toLocaleString('id-ID')}
          </span>
          {requireLoginNotice && (
            <small className="text-muted">
              <i className="bi bi-lock-fill"></i> Login untuk pesan
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
