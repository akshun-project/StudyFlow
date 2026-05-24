 // src/Components/BoardTestResult.jsx
import React, { useEffect, useState, useRef } from "react";

// ─── Rank System ────────────────────────────────────────────────────
const getRank = (pct) => {
  if (pct >= 90) return { label: "Elite", tier: 6, color: "#7C3AED", bg: "#F5F3FF", border: "#C4B5FD" };
  if (pct >= 78) return { label: "Master", tier: 5, color: "#0F766E", bg: "#F0FDFA", border: "#99F6E4" };
  if (pct >= 65) return { label: "Scholar", tier: 4, color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" };
  if (pct >= 50) return { label: "Consistent", tier: 3, color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" };
  if (pct >= 35) return { label: "Learner", tier: 2, color: "#0369A1", bg: "#F0F9FF", border: "#BAE6FD" };
  return { label: "Foundation", tier: 1, color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" };
};

// ─── XP Calculation ─────────────────────────────────────────────────
const calcXP = (score, total, timeSeconds, integrityPct) => {
  const baseXP = Math.round((score / total) * 100);
  const speedBonus = timeSeconds < total * 35 ? 30 : timeSeconds < total * 50 ? 15 : 0;
  const integrityBonus = integrityPct >= 90 ? 20 : integrityPct >= 75 ? 10 : 0;
  return baseXP + speedBonus + integrityBonus;
};

// ─── Percentile (deterministic mock based on score) ──────────────────
const getPercentile = (pct) => {
  if (pct >= 90) return 96;
  if (pct >= 80) return 87;
  if (pct >= 70) return 73;
  if (pct >= 60) return 58;
  if (pct >= 50) return 42;
  if (pct >= 40) return 28;
  return 14;
};

// ─── Progress Ring ───────────────────────────────────────────────────
function ProgressRing({ pct, size = 96, stroke = 7, color = "#7C3AED", label, sub }) {
  const [animPct, setAnimPct] = useState(0);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animPct / 100) * circ;

  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 900;
    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setAnimPct(Math.round(ease * pct));
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [pct]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{animPct}%</span>
        </div>
      </div>
      {label && <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0 }}>{label}</p>}
      {sub && <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{sub}</p>}
    </div>
  );
}

// ─── Animated Number ─────────────────────────────────────────────────
function AnimNum({ target, prefix = "", suffix = "", duration = 800 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * target));
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <>{prefix}{val}{suffix}</>;
}

// ─── Rank Track ──────────────────────────────────────────────────────
const RANKS = ["Foundation", "Learner", "Consistent", "Scholar", "Master", "Elite"];
function RankTrack({ currentTier }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%" }}>
      {RANKS.map((r, i) => {
        const tier = i + 1;
        const active = tier === currentTier;
        const done = tier < currentTier;
        return (
          <React.Fragment key={r}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: active ? "#7C3AED" : done ? "#DDD6FE" : "#F3F4F6",
                border: active ? "2.5px solid #7C3AED" : done ? "2px solid #DDD6FE" : "1.5px solid #E5E7EB",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", zIndex: 1,
              }}>
                {done && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {active && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff" }} />}
              </div>
              <span style={{
                fontSize: 9, fontWeight: active ? 700 : 500,
                color: active ? "#7C3AED" : done ? "#A78BFA" : "#9CA3AF",
                textAlign: "center", lineHeight: 1.2
              }}>{r}</span>
            </div>
            {i < RANKS.length - 1 && (
              <div style={{
                height: 2, flex: 1, marginBottom: 18,
                background: done ? "#DDD6FE" : "#F3F4F6",
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Integrity Badge ─────────────────────────────────────────────────
function IntegrityBadge({ score }) {
  const label = score >= 90
    ? "Focused Learner" : score >= 75
    ? "Mostly Focused" : score >= 60
    ? "Mild Distractions" : "Multiple Interruptions";
  const color = score >= 90 ? "#059669" : score >= 75 ? "#0369A1" : score >= 60 ? "#D97706" : "#DC2626";
  const bg = score >= 90 ? "#ECFDF5" : score >= 75 ? "#EFF6FF" : score >= 60 ? "#FFFBEB" : "#FEF2F2";
  const border = score >= 90 ? "#6EE7B7" : score >= 75 ? "#BFDBFE" : score >= 60 ? "#FDE68A" : "#FECACA";

  return (
    <div style={{
      background: bg, border: `1px solid ${border}`, borderRadius: 14,
      padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase" }}>Integrity Score</span>
        <span style={{ fontSize: 20, fontWeight: 800, color }}>
          <AnimNum target={score} suffix="%" duration={700} />
        </span>
      </div>
      <div style={{ height: 5, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: color,
          width: `${score}%`,
          transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
      <p style={{ fontSize: 12, color, fontWeight: 600, margin: 0 }}>{label}</p>
    </div>
  );
}

// ─── Stat Row ─────────────────────────────────────────────────────────
function StatRow({ icon, label, value, accent }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 0", borderBottom: "1px solid #F3F4F6",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, background: "#F5F3FF",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{label}</p>
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: accent || "#111827" }}>{value}</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function BoardTestResult({
  score,
  total,
  timeSeconds,
  onBack,
  onHome,
  // Optional new props (with safe defaults)
  integrityPct = 88,
  previousPct = null,
  subjectMastery = null,
}) {
  const percentage = Math.round((score / total) * 100);
  const rank = getRank(percentage);
  const xp = calcXP(score, total, timeSeconds, integrityPct);
  const percentile = getPercentile(percentage);
  const delta = previousPct !== null ? percentage - previousPct : null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  const speedLabel =
    timeSeconds < total * 30 ? "Fast" :
    timeSeconds < total * 45 ? "Moderate" : "Slow";

  const accuracyLabel =
    percentage >= 75 ? "High" : percentage >= 50 ? "Medium" : "Low";

  const conceptLabel = percentage >= 60 ? "Satisfactory" : "Needs Work";
  const readinessLabel = percentage >= 75 ? "Nearly Ready" : "Not Ready Yet";

  const anim = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#FAFAFA",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: "0 0 40px",
    }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        button:focus-visible { outline: 2px solid #7C3AED; outline-offset: 2px; }
      `}</style>

      {/* Header Bar */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #F3F4F6",
        padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10,
        ...anim(0),
      }}>
        <div>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 1px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>StudyFlow</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Board Practice Result</p>
        </div>
        <div style={{
          background: rank.bg, border: `1px solid ${rank.border}`,
          borderRadius: 8, padding: "4px 10px",
          fontSize: 12, fontWeight: 700, color: rank.color,
        }}>
          {rank.label}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Score Hero */}
        <div style={{
          background: "#fff", borderRadius: 20, border: "1px solid #F3F4F6",
          padding: "24px 20px", ...anim(60),
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px", fontWeight: 500 }}>Overall Score</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 52, fontWeight: 800, color: "#111827", lineHeight: 1 }}>
                  <AnimNum target={percentage} suffix="%" />
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
                {score} / {total} marks
              </p>
              {delta !== null && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8,
                  background: delta >= 0 ? "#ECFDF5" : "#FEF2F2",
                  borderRadius: 6, padding: "3px 8px",
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: delta >= 0 ? "#059669" : "#DC2626" }}>
                    {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% from last attempt
                  </span>
                </div>
              )}
            </div>
            <ProgressRing pct={percentage} size={92} stroke={7} color={rank.color} />
          </div>

          {/* XP Strip */}
          <div style={{
            background: "#F5F3FF", borderRadius: 12, padding: "10px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontSize: 11, color: "#7C3AED", fontWeight: 600, margin: "0 0 1px", letterSpacing: "0.04em" }}>XP EARNED</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#5B21B6", margin: 0 }}>
                +<AnimNum target={xp} duration={1000} />
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "#7C3AED", fontWeight: 600, margin: "0 0 1px" }}>PERCENTILE</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#5B21B6", margin: 0 }}>
                Top <AnimNum target={100 - percentile} suffix="%" duration={900} />
              </p>
            </div>
          </div>
        </div>

        {/* Rank Track */}
        <div style={{
          background: "#fff", borderRadius: 20, border: "1px solid #F3F4F6",
          padding: "18px 16px", ...anim(120),
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 14px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Your Rank</p>
          <RankTrack currentTier={rank.tier} />
          <p style={{ fontSize: 12, color: "#6B7280", margin: "12px 0 0", textAlign: "center" }}>
            {rank.tier < 6
              ? `Reach ${RANKS[rank.tier]} → score ${[35,50,65,78,90][rank.tier]}%+`
              : "🎯 You've reached the highest rank. Maintain it."}
          </p>
        </div>

        {/* Performance Analytics */}
        <div style={{
          background: "#fff", borderRadius: 20, border: "1px solid #F3F4F6",
          padding: "18px 20px", ...anim(180),
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 4px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Analytics</p>

          <StatRow icon="⚡" label="Speed Efficiency" value={speedLabel} accent={speedLabel === "Fast" ? "#059669" : "#6B7280"} />
          <StatRow icon="🎯" label="Accuracy Level" value={accuracyLabel} accent={accuracyLabel === "High" ? "#059669" : accuracyLabel === "Medium" ? "#D97706" : "#DC2626"} />
          <StatRow icon="🧠" label="Conceptual Strength" value={conceptLabel} accent={conceptLabel === "Satisfactory" ? "#0369A1" : "#D97706"} />
          <StatRow icon="📋" label="Exam Readiness" value={readinessLabel} accent={readinessLabel === "Nearly Ready" ? "#059669" : "#DC2626"} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>⏱ {formatTime(timeSeconds)}</span>
          </div>
        </div>

        {/* Percentile Card */}
        <div style={{
          background: "#fff", borderRadius: 20, border: "1px solid #F3F4F6",
          padding: "18px 20px", ...anim(230),
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 12px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Peer Comparison</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 6px" }}>
                You performed better than
              </p>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#111827", margin: 0 }}>
                <AnimNum target={percentile} suffix="%" duration={900} />
              </p>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "2px 0 0" }}>of students</p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <ProgressRing pct={percentile} size={80} stroke={6} color="#7C3AED" />
            </div>
          </div>
          {/* Bar */}
          <div style={{ marginTop: 16, height: 8, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #DDD6FE, #7C3AED)",
              width: `${percentile}%`, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
        </div>

        {/* Subject Mastery (optional) */}
        {subjectMastery && (
          <div style={{
            background: "#fff", borderRadius: 20, border: "1px solid #F3F4F6",
            padding: "18px 20px", ...anim(270),
          }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 14px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Subject Mastery</p>
            {Object.entries(subjectMastery).map(([sub, pct]) => (
              <div key={sub} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{sub}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: pct >= 70 ? "#059669" : pct >= 50 ? "#D97706" : "#DC2626" }}>{pct}%</span>
                </div>
                <div style={{ height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 99,
                    background: pct >= 70 ? "#059669" : pct >= 50 ? "#F59E0B" : "#EF4444",
                    width: `${pct}%`, transition: "width 1s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Integrity */}
        <div style={{ ...anim(310) }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 10px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Academic Integrity</p>
          <IntegrityBadge score={integrityPct} />
        </div>

        {/* Band Remark */}
        <div style={{
          background: rank.bg, border: `1px solid ${rank.border}`,
          borderRadius: 16, padding: "14px 16px", ...anim(350),
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: rank.color, margin: "0 0 4px" }}>{rank.label} Band</p>
          <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>
            {
              rank.tier === 6 ? "Outstanding performance. Your preparation is at the highest level. Keep this standard." :
              rank.tier === 5 ? "Excellent board readiness. Refine weak areas to reach Elite." :
              rank.tier === 4 ? "Good command of concepts. Improve accuracy for top band." :
              rank.tier === 3 ? "Steady progress. Consistent daily revision will push you higher." :
              rank.tier === 2 ? "Building momentum. Focus on understanding, not just attempting." :
              "Strong concept revision needed. Start topic-by-topic before full tests."
            }
          </p>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4, ...anim(400) }}>
          <button
            onClick={onBack}
            style={{
              width: "100%", padding: "15px 0", borderRadius: 14,
              background: "#7C3AED", color: "#fff",
              border: "none", fontSize: 15, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.01em",
              transition: "opacity 0.15s, transform 0.1s",
            }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.9"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Practice Another Test
          </button>
          <button
            onClick={onHome}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 14,
              background: "#fff", color: "#374151",
              border: "1.5px solid #E5E7EB", fontSize: 15, fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s, transform 0.1s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#F9FAFB"}
            onMouseOut={e => e.currentTarget.style.background = "#fff"}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Back to Home
          </button>
        </div>

        <p style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", margin: "8px 0 0", fontStyle: "italic" }}>
          Improvement comes from understanding, not just attempting.
        </p>
      </div>
    </div>
  );
}