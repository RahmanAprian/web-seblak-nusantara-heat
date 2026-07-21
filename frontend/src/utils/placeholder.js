// Placeholder gambar berbasis SVG lokal (data URI), dipakai sebagai fallback
// kalau produk belum punya foto asli, atau kalau gambar dari URL gagal dimuat
// (misal karena koneksi internet). Ini dijamin selalu tampil karena tidak
// bergantung ke server luar sama sekali.

function svgToDataUri(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const FOOD_PLACEHOLDER = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#fdece9"/>
  <circle cx="200" cy="150" r="80" fill="#ffe3c2"/>
  <path d="M120 170 a80 55 0 0 0 160 0 z" fill="#b7131a"/>
  <circle cx="160" cy="140" r="10" fill="#fff8e1"/>
  <circle cx="220" cy="125" r="8" fill="#fff8e1"/>
  <circle cx="245" cy="155" r="9" fill="#fff8e1"/>
  <text x="200" y="250" font-family="sans-serif" font-size="16" fill="#8f0f15" text-anchor="middle">Seblak Pedas</text>
</svg>
`);

export const HERO_PLACEHOLDER = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500">
  <rect width="600" height="500" fill="#fdece9"/>
  <circle cx="300" cy="240" r="150" fill="#ffe3c2"/>
  <path d="M150 270 a150 100 0 0 0 300 0 z" fill="#b7131a"/>
  <circle cx="230" cy="220" r="16" fill="#fff8e1"/>
  <circle cx="340" cy="195" r="13" fill="#fff8e1"/>
  <circle cx="390" cy="245" r="15" fill="#fff8e1"/>
  <text x="300" y="420" font-family="sans-serif" font-size="24" fill="#8f0f15" text-anchor="middle">Seblak Pedas Gastronomy</text>
</svg>
`);
