
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
function ProgressRing({ pct, size = 110, stroke = 8, color = "#7C3AED" }) {
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
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 4,
      }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{animPct}%</span>
        <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Score</span>
      </div>
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
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
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
                textAlign: "center", lineHeight: 1.2,
              }}>{r}</span>
            </div>
            {i < RANKS.length - 1 && <div style={{ height: 2, flex: 1, marginBottom: 18, background: done ? "#DDD6FE" : "#F3F4F6" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function MetricCard({ label, value, hint, accent }) {
  return (
    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: "12px 14px" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 800, color: accent || "#0F172A", margin: 0 }}>{value}</p>
      {hint ? <p style={{ fontSize: 12, color: "#64748B", margin: "4px 0 0" }}>{hint}</p> : null}
    </div>
  );
}

function SectionCard({ title, subtitle, children, accent }) {
  return (
    <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #EEF2FF", boxShadow: "0 14px 40px rgba(15, 23, 42, 0.04)", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 10 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase", color: accent || "#334155" }}>{title}</p>
          {subtitle ? <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function BoardTestResult({
  studentName,
  score,
  total,
  timeSeconds,
  onBack,
  onHome,
  onReviewAnswers = null,
  integrityPct = 88,
  previousPct = null,
  subjectMastery = null,
}) {
   const navigate = useNavigate();
  const percentage = Math.round((score / total) * 100);
  const rank = getRank(percentage);
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

  const formatDate = (date = new Date()) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const speedLabel = timeSeconds < total * 30 ? "Fast" : timeSeconds < total * 45 ? "Moderate" : "Slow";
  const accuracyLabel = percentage >= 75 ? "High" : percentage >= 50 ? "Medium" : "Low";
  const conceptLabel = percentage >= 60 ? "Satisfactory" : "Needs Work";
  const readinessLabel = percentage >= 75 ? "Nearly Ready" : "Not Ready Yet";

 
  const subject = "Board Practice";
  const chapter = "Mixed Topics";
  const attemptNumber = 1;
  const completionDate = formatDate();

  const masteryData = subjectMastery && Object.keys(subjectMastery).length
    ? Object.entries(subjectMastery)
    : [
        ["Core Concepts", Math.max(40, Math.min(95, percentage + 8))],
        ["Application", Math.max(38, Math.min(95, percentage - 4))],
        ["Problem Solving", Math.max(40, Math.min(95, percentage + 3))],
      ];

  const suggestions =
    percentage >= 80
      ? [
          "Keep the current pace and review the few missed concepts for full mastery.",
          "Use one short recap session to lock in precision before the next test.",
        ]
      : percentage >= 60
      ? [
          "Focus on the most error-prone questions and explain each answer aloud.",
          "Add a 10-minute recap block after every test to reinforce weak areas.",
        ]
      : [
          "Start with foundational topics and work one chapter at a time.",
          "Try a slower first pass, then revisit mistakes with a fresh explanation.",
        ];

  const nextRank = rank.tier < 6 ? RANKS[rank.tier] : "Elite";
  const nextThreshold = rank.tier < 6 ? [35, 50, 65, 78, 90][rank.tier] : null;

  const anim = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
  });

  return (
    <div className="result-shell" style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F8F7FF 0%, #F8FAFC 100%)", color: "#111827" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        button { font: inherit; }
        button:focus-visible { outline: 2px solid #7C3AED; outline-offset: 2px; }
        .result-shell { font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .result-shell .card-surface { background: #fff; border-radius: 24px; border: 1px solid #EEF2FF; box-shadow: 0 14px 40px rgba(15, 23, 42, 0.04); }
        .result-shell .soft-text { color: #64748B; }
        .result-shell .mono { letter-spacing: 0.08em; text-transform: uppercase; font-size: 11px; font-weight: 700; }
        .result-shell .action-btn { border: none; border-radius: 14px; padding: 13px 16px; font-weight: 700; cursor: pointer; transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease; }
        .result-shell .action-btn:hover { transform: translateY(-1px); }
        .result-shell .action-btn:active { transform: translateY(0); }
        @media (max-width: 920px) {
          .result-shell .hero-grid { grid-template-columns: 1fr !important; }
          .result-shell .main-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .result-shell .stat-grid { grid-template-columns: 1fr !important; }
          .result-shell .hero-meta { flex-direction: column; align-items: flex-start !important; }
          .result-shell .header-row { flex-direction: column; align-items: flex-start !important; }
          .result-shell .action-row { flex-direction: column; align-items: stretch !important; }
        }
      `}</style>

      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid #EEF2FF" }}>
        <div className="header-row" style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, ...anim(0) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={onBack} className="action-btn" style={{ background: "#F8FAFC", color: "#334155", border: "1px solid #E2E8F0", padding: "8px 10px" }}>
              ← Back
            </button>
            <div>         
              <p style={{ fontSize: 11, color: "#94A3B8", margin: "0 0 2px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>StudyFlow</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: 0 }}>Board Practice Result</p>
            </div>
          </div>
          <div style={{ background: rank.bg, border: `1px solid ${rank.border}`, borderRadius: 999, padding: "7px 12px", fontSize: 12, fontWeight: 700, color: rank.color }}>
            {rank.label} Band
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 16px 48px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 18 }}>
          <div className="card-surface" style={{ padding: "24px", ...anim(60) }}>
            <div className="hero-meta" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <p className="mono" style={{ color: "#7C3AED", margin: "0 0 6px" }}>Performance snapshot</p>
                <h1 style={{ fontSize: "clamp(1.5rem, 2.1vw, 2.2rem)", fontWeight: 800, margin: 0, lineHeight: 1.1 }}>Great work, {studentName}</h1>
                <p style={{ fontSize: 14, color: "#64748B", margin: "8px 0 0", maxWidth: 560, lineHeight: 1.6 }}>
                  Your board practice is complete. Review your performance and improve for the next attempt. 
                </p>
              </div>
              <div style={{ background: rank.bg, border: `1px solid ${rank.border}`, borderRadius: 999, padding: "8px 12px", color: rank.color, fontWeight: 700, fontSize: 13 }}>
                {rank.label}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 999, padding: "7px 10px", fontSize: 12, color: "#475569", fontWeight: 600 }}>
                Student • {studentName}
              </div>
              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 999, padding: "7px 10px", fontSize: 12, color: "#475569", fontWeight: 600 }}>
                Subject • {subject}
              </div>
              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 999, padding: "7px 10px", fontSize: 12, color: "#475569", fontWeight: 600 }}>
                Chapter • {chapter}
              </div>
            </div>

            <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginTop: 18 }}>
              <MetricCard label="Overall score" value={`${percentage}%`} hint={`${score} / ${total} marks`} accent="#111827" />
              <MetricCard label="Time taken" value={formatTime(timeSeconds)} hint="Session duration" accent="#0F766E" />
              <MetricCard label="Attempt" value={`#${attemptNumber}`} hint="Current run" accent="#2563EB" />
              <MetricCard label="Completed" value={completionDate} hint="Performance recorded" accent="#7C3AED" />
            </div>
          </div>

          <div
  className={`card-surface rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-lg transition-all duration-300 ${anim(120)}`}
>
  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
        Current Rank
      </p>

      <h2 className="mt-2 text-3xl font-bold text-slate-900">
        {rank.label}
      </h2>
    </div>

    <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
      {percentage}%
    </div>
  </div>

  {/* Ring */}
  <div className="my-8 flex justify-center">
    <ProgressRing
      pct={percentage}
      size={135}
      stroke={8}
      color="#6366F1"
    />
  </div>

  {/* Message */}
  <div className="text-center">
    <h3 className="text-lg font-semibold text-slate-900">
      {percentage >= 90
        ? "Outstanding Performance 🎉"
        : percentage >= 75
        ? "Excellent Work 🚀"
        : percentage >= 60
        ? "Good Progress 👍"
        : "Keep Practicing 💪"}
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-500">
      {rank.tier < 6
        ? `Reach ${nextThreshold}% to unlock ${nextRank}.`
        : "You've reached the highest available rank."}
    </p>
  </div>

  {/* Divider */}
  <div className="my-6 h-px bg-slate-200" />

  {/* Stats */}
  <div className="grid grid-cols-2 gap-4">
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        Score
      </p>

      <h3 className="mt-2 text-2xl font-bold text-slate-900">
        {score}/{total}
      </h3>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        Accuracy
      </p>

      <h3 className="mt-2 text-2xl font-bold text-slate-900">
        {percentage}%
      </h3>
    </div>
  </div>
</div>
        </div>

        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <SectionCard title="Performance summary" subtitle="A concise view of execution, clarity, and readiness" accent="#7C3AED">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                <MetricCard label="Speed" value={speedLabel} hint="Pacing" accent={speedLabel === "Fast" ? "#059669" : "#6B7280"} />
                <MetricCard label="Accuracy" value={accuracyLabel} hint="Answer confidence" accent={accuracyLabel === "High" ? "#059669" : accuracyLabel === "Medium" ? "#D97706" : "#DC2626"} />
                <MetricCard label="Concepts" value={conceptLabel} hint="Understanding" accent={conceptLabel === "Satisfactory" ? "#0369A1" : "#D97706"} />
                <MetricCard label="Readiness" value={readinessLabel} hint="Exam fit" accent={readinessLabel === "Nearly Ready" ? "#059669" : "#DC2626"} />
              </div>
              {delta !== null && (
                <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 14, background: delta >= 0 ? "#ECFDF5" : "#FEF2F2", color: delta >= 0 ? "#047857" : "#DC2626", fontWeight: 700, fontSize: 14 }}>
                  {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% change from your previous attempt.
                </div>
              )}
            </SectionCard>

            <SectionCard title="Learning analytics" subtitle="A practical read on how the session performed" accent="#0F766E">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Speed efficiency", value: Math.min(100, percentage + 8), color: "#7C3AED" },
                  { label: "Accuracy control", value: Math.min(100, percentage + 4), color: "#2563EB" },
                  { label: "Concept retention", value: Math.min(100, percentage + 2), color: "#0F766E" },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}%</span>
                    </div>
                    <div style={{ height: 8, background: "#E2E8F0", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${item.value}%`, borderRadius: 999, background: item.color, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Subject mastery" subtitle="Performance by focus area" accent="#2563EB">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {masteryData.map(([sub, pct]) => (
                  <div key={sub}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>{sub}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: pct >= 70 ? "#059669" : pct >= 50 ? "#D97706" : "#DC2626" }}>{pct}%</span>
                    </div>
                    <div style={{ height: 8, background: "#E2E8F0", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999, background: pct >= 70 ? "#059669" : pct >= 50 ? "#F59E0B" : "#EF4444", transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <SectionCard title="Improvement suggestions" subtitle="Targeted next steps" accent="#DC2626">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {suggestions.map((item, index) => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderTop: index === 0 ? "none" : "1px solid #F1F5F9" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F5F3FF", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>{index + 1}</div>
                    <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Exam details" subtitle="Context for this attempt" accent="#334155">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ color: "#64748B", fontSize: 13 }}>Student</span>
                  <span style={{ fontWeight: 700, color: "#111827", fontSize: 13 }}>{studentName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ color: "#64748B", fontSize: 13 }}>Subject</span>
                  <span style={{ fontWeight: 700, color: "#111827", fontSize: 13 }}>{subject}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ color: "#64748B", fontSize: 13 }}>Chapter</span>
                  <span style={{ fontWeight: 700, color: "#111827", fontSize: 13 }}>{chapter}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ color: "#64748B", fontSize: 13 }}>Attempt</span>
                  <span style={{ fontWeight: 700, color: "#111827", fontSize: 13 }}>#{attemptNumber}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B", fontSize: 13 }}>Completed</span>
                  <span style={{ fontWeight: 700, color: "#111827", fontSize: 13 }}>{completionDate}</span>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="action-row" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6 }}>
          <button onClick={onBack} className="action-btn" style={{ flex: 1, minWidth: 180, background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)", color: "#fff", boxShadow: "0 10px 24px rgba(124, 58, 237, 0.18)" }}>
            Practice Again
          </button>
          
          <button
  onClick={() => navigate("/dashboard")}
  className="action-btn"
  style={{
    flex: 1,
    minWidth: 180,
    background: "#F8FAFC",
    color: "#334155",
    border: "1px solid #E2E8F0",
  }}
>
  Dashboard
</button>
        </div>
      </div>
    </div>
  );
}
 
