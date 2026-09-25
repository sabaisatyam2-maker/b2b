// A simple node/network mark — represents vendors and buyers connecting.
// Not a stock icon; drawn to match the indigo/ink palette.
export default function Logo({ size = 26, light = false }) {
  const mainColor = light ? "#FFFFFF" : "#10142B";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <circle cx="10" cy="12" r="4" fill="#3A4CE0" />
        <circle cx="30" cy="12" r="4" fill={mainColor} />
        <circle cx="20" cy="30" r="4" fill="#FFB020" />
        <path d="M10 12L20 30M30 12L20 30M10 12L30 12" stroke={mainColor} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: mainColor }}>
        BizSphere
      </span>
    </div>
  );
}
