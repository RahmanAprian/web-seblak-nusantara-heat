const LEVELS = [
  { level: 1, label: 'Original Manis', color: '#ffd54f' },
  { level: 2, label: 'Hangat Kuku', color: '#ffb74d' },
  { level: 3, label: 'Mulai Berkeringat', color: '#ff8f06' },
  { level: 4, label: 'Pedas Nagih', color: '#e53935' },
  { level: 5, label: 'Lidah Terbakar', color: '#8f0f15' },
];

export default function SpiceLevelPicker({ value, onChange, size = 'md' }) {
  const dotSize = size === 'sm' ? 26 : 34;

  return (
    <div>
      <div className="d-flex gap-2 mb-2">
        {LEVELS.map((lv) => (
          <button
            key={lv.level}
            type="button"
            className={`spice-dot ${value === lv.level ? 'active' : ''}`}
            style={{ backgroundColor: lv.color, width: dotSize, height: dotSize }}
            onClick={() => onChange(lv.level)}
            title={lv.label}
          >
            {value === lv.level ? lv.level : ''}
          </button>
        ))}
      </div>
      <small className="text-muted fw-semibold">
        Level {value}: {LEVELS.find((l) => l.level === value)?.label}
      </small>
    </div>
  );
}
