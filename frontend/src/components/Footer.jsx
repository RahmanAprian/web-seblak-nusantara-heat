export default function Footer() {
  return (
    <footer className="bg-white border-top py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="text-spicy fw-bold">Seblak Pedas</h5>
            <p className="text-muted small">
              Membawa tradisi Seblak Bandung ke era modern dengan kualitas premium dan rasa
              pedas yang bikin nagih.
            </p>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <h6 className="fw-bold">Jelajahi</h6>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2">Menu</li>
              <li className="mb-2">Cara Pemesanan</li>
              <li>Lokasi Cabang</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold">Bantuan</h6>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2">Kebijakan Privasi</li>
              <li className="mb-2">Syarat & Ketentuan</li>
              <li>Hubungi Kami</li>
            </ul>
          </div>
        </div>
        <hr />
        <p className="text-muted small mb-0">
          &copy; {new Date().getFullYear()} Seblak Pedas Gastronomy. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
