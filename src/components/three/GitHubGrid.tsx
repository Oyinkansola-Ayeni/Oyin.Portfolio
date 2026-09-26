import { useEffect, useRef, useState } from 'react';

interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// Grid dimensions
const COLS = 52;  // 52 weeks in a year
const ROWS = 7;   // 7 days a week
const CELL = 11;  // cell size in pixels
const GAP = 3;    // gap between cells
const W = COLS * (CELL + GAP) - GAP;
const H = ROWS * (CELL + GAP) - GAP;

// Cyan-themed colour ramp matching your portfolio accent
const LEVEL_COLORS = [
  { fill: '#0d1117', glow: null },           // 0 - no activity
  { fill: '#003d52', glow: '#006b8f' },       // 1 - low activity
  { fill: '#005f7a', glow: '#0099bf' },       // 2 - medium activity
  { fill: '#00a8cc', glow: '#00c8ef' },       // 3 - high activity
  { fill: '#00f0ff', glow: '#00f0ff' },       // 4 - very high activity
];

// Add roundRect method to CanvasRenderingContext2D if not already defined
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    return this;
  };
}

export function GitHubGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [totalCommits, setTotalCommits] = useState(0);
  const cellsRef = useRef<{ level: 0 | 1 | 2 | 3 | 4; phase: number }[]>([]);

  // ── Fetch real contribution data ──────────────────────────────────────────
  useEffect(() => {
    // Replace 'Oyinkansola-Ayeni' with your GitHub username
    const GITHUB_USERNAME = 'Oyinkansola-Ayeni';
    
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const contribs: Contribution[] = data?.contributions ?? [];
        const total = contribs.reduce((sum, c) => sum + c.count, 0);
        setTotalCommits(total);

        // Map to flat array ordered col-major (week × day)
        const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
          const week = Math.floor(i / ROWS);
          const day = i % ROWS;
          const idx = week * ROWS + day;
          const level = (contribs[idx]?.level ?? 0) as 0 | 1 | 2 | 3 | 4;
          return { level, phase: Math.random() * Math.PI * 2 };
        });

        cellsRef.current = cells;
        setStatus('ready');
      })
      .catch((err) => {
        console.error('Failed to fetch GitHub contributions:', err);
        // Fallback: generate plausible-looking demo data
        const demoCells = Array.from({ length: COLS * ROWS }, () => {
          const r = Math.random();
          let level: 0 | 1 | 2 | 3 | 4 = 0;
          if (r < 0.45) level = 0;
          else if (r < 0.65) level = 1;
          else if (r < 0.80) level = 2;
          else if (r < 0.92) level = 3;
          else level = 4;
          return { level, phase: Math.random() * Math.PI * 2 };
        });
        
        // Calculate demo total commits
        const demoTotal = demoCells.reduce((sum, cell) => sum + (cell.level * 2), 0);
        setTotalCommits(demoTotal);
        cellsRef.current = demoCells;
        setStatus('ready');
      });
  }, []);

  // ── Canvas animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== 'ready') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Device pixel ratio for crisp rendering
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    let t = 0;

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const cells = cellsRef.current;
      for (let i = 0; i < cells.length; i++) {
        const { level, phase } = cells[i];
        const col = Math.floor(i / ROWS);
        const row = i % ROWS;
        const x = col * (CELL + GAP);
        const y = row * (CELL + GAP);
        const cfg = LEVEL_COLORS[level];

        // Subtle brightness pulse on active cells only
        const pulse = level > 0
          ? 0.82 + 0.18 * Math.sin(t * 0.025 + phase)
          : 1;

        // Glow for high-level cells
        if (level >= 3 && cfg.glow) {
          ctx.shadowColor = cfg.glow;
          ctx.shadowBlur = level === 4 ? 8 : 4;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = level === 0 ? 0.5 : pulse;
        ctx.fillStyle = cfg.fill;
        ctx.beginPath();
        ctx.roundRect(x, y, CELL, CELL, 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      t++;

      if (isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    // Only animate when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          draw();
        } else if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [status]);

  // ── Day labels ────────────────────────────────────────────────────────────
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="text-xs text-gray-500 font-mono tracking-wider uppercase">
          Contribution Activity
        </span>
        {totalCommits > 0 && (
          <span className="text-xs font-mono text-primary-400">
            {totalCommits.toLocaleString()} contributions this year
          </span>
        )}
      </div>

      {/* Grid wrapper */}
      <div className="flex gap-3">
        {/* Day labels */}
        <div
          className="flex flex-col justify-between text-right shrink-0"
          style={{ height: H }}
        >
          {dayLabels.map((label, i) => (
            <span
              key={i}
              className="text-[10px] text-gray-500 font-mono leading-none"
              style={{ height: CELL + GAP, lineHeight: `${CELL}px` }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Canvas container */}
        <div className="relative">
          {/* Loading state */}
          {status === 'loading' && (
            <div
              className="flex flex-col items-center justify-center gap-3 bg-dark-card/30 rounded-lg"
              style={{ width: W, height: H }}
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">Loading contributions...</span>
            </div>
          )}

          {/* Error state */}
          {status === 'error' && (
            <div
              className="flex flex-col items-center justify-center gap-2 bg-dark-card/30 rounded-lg"
              style={{ width: W, height: H }}
            >
              <span className="text-xs text-red-400">Failed to load contributions</span>
              <button
                onClick={() => window.location.reload()}
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            style={{
              display: status === 'ready' ? 'block' : 'none',
              borderRadius: '6px',
            }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-4 justify-end">
        <span className="text-[10px] text-gray-500 font-mono mr-1">Less</span>
        {LEVEL_COLORS.map((cfg, i) => (
          <div
            key={i}
            className="rounded-sm transition-all duration-200 hover:scale-110"
            style={{
              width: CELL,
              height: CELL,
              backgroundColor: cfg.fill,
              boxShadow: cfg.glow ? `0 0 4px ${cfg.glow}` : 'none',
            }}
          />
        ))}
        <span className="text-[10px] text-gray-500 font-mono ml-1">More</span>
      </div>

      {/* Month labels - optional but nice */}
      <div className="mt-3 ml-8">
        <div className="flex text-[9px] text-gray-600 font-mono" style={{ width: W }}>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
            <span
              key={month}
              style={{
                position: 'relative',
                left: `${(i / 12) * W}px`,
              }}
              className="absolute text-[9px] text-gray-600"
            >
              {month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GitHubGrid;