import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-3">
      <div className="container">
        <Link className="navbar-brand navbar-brand-custom" to="/">
          Seblak Pedas
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav me-auto ms-lg-4 gap-lg-3">
            <Link className="nav-link fw-semibold" to="/">
              Menu
            </Link>
            {user && !user.isAdmin && user.role !== 'admin' && (
              <Link className="nav-link fw-semibold" to="/riwayat-pesanan">
                Pesanan Saya
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link className="nav-link fw-semibold" to="/admin">
                Dashboard Admin
              </Link>
            )}
          </div>
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {user?.role !== 'admin' && (
              <Link to="/pesan" className="position-relative text-decoration-none text-dark">
                <i className="bi bi-cart3 fs-5"></i>
                <span className="ms-1 fw-semibold">Keranjang</span>
                {cart.totalItems > 0 && (
                  <span className="badge rounded-pill bg-spicy ms-1">{cart.totalItems}</span>
                )}
              </Link>
            )}
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span className="fw-semibold small text-truncate" style={{ maxWidth: 120 }}>
                  {user.name}
                </span>
                <button className="btn btn-sm btn-outline-spicy" onClick={handleLogout}>
                  Keluar
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline-spicy">
                  Masuk
                </Link>
                <Link to="/daftar" className="btn btn-sm btn-spicy">
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
