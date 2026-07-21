import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menu = [
  { to: '/admin', icon: 'bi-grid-1x2-fill', label: 'Dashboard', end: true },
  { to: '/admin/pesanan', icon: 'bi-receipt', label: 'Pesanan' },
  { to: '/admin/produk', icon: 'bi-egg-fried', label: 'Menu Seblak' },
  { to: '/admin/bahan-baku', icon: 'bi-box-seam', label: 'Bahan Baku' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <aside className="sidebar-admin d-none d-lg-flex flex-column p-3" style={{ width: 260 }}>
        <div className="mb-4 px-2">
          <h5 className="fw-bold mb-0">
            <span className="text-spicy">Admin</span> Panel
          </h5>
          <small className="text-muted">Kelola Stok & Pesanan</small>
        </div>
        <nav className="flex-grow-1">
          {menu.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.end}
              className={({ isActive }) => `sidebar-link text-decoration-none ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${m.icon}`}></i> {m.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-top pt-3">
          <div className="d-flex align-items-center gap-2 mb-3 px-2">
            <div
              className="rounded-circle bg-spicy text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 36, height: 36 }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="fw-semibold small">{user?.name}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>
                ADMIN
              </div>
            </div>
          </div>
          <button className="btn btn-spicy w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Keluar
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="d-lg-none position-fixed top-0 start-0 end-0 bg-white shadow-sm p-3 d-flex justify-content-between align-items-center" style={{ zIndex: 1030 }}>
        <h6 className="fw-bold mb-0">Admin Panel</h6>
        <button className="btn btn-sm btn-outline-spicy" onClick={handleLogout}>
          Keluar
        </button>
      </div>

      <div className="flex-grow-1 bg-body-tertiary" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="container-fluid p-3 p-lg-4" style={{ marginTop: 60 }}>
          <div className="d-lg-none mb-3 d-flex gap-2 overflow-auto">
            {menu.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                end={m.end}
                className={({ isActive }) => `badge-spice ${isActive ? 'active' : ''}`}
              >
                {m.label}
              </NavLink>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
