'use client';

export default function CRTScreen({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-lg"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        }}
      />
      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-lg"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      {children}
    </div>
  );
}
