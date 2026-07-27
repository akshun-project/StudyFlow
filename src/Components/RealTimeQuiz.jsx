 // src/Components/RealTimeQuiz.jsx
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../Supabase/supabaseClient";
import { useUser } from "@clerk/clerk-react";
import BoardTestResult from "./BoardTestResult";

/* ─── shuffle helper (PURE, SAFE — UNCHANGED) ─── */
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/* ─── Option label letters ─── */
const LABELS = ["A", "B", "C", "D"];

/* ─── Animated Progress Bar ─── */
function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ width: "100%", height: 3, background: "#EDE9FE", borderRadius: 99 }}>
      <div
        style={{
          height: "100%",
          borderRadius: 99,
          background: "#7C3AED",
          width: `${pct}%`,
          transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </div>
  );
}

/* ─── Dot Progress ─── */
function DotProgress({ current, total }) {
  const dots = Math.min(total, 12);
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 16 : 6,
            height: 6,
            borderRadius: 99,
            background: i < current ? "#7C3AED" : i === current ? "#7C3AED" : "#EDE9FE",
            transition: "all 0.3s ease",
            opacity: i < current ? 0.5 : 1,
          }}
        />
      ))}
      {total > 12 && (
        <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 2 }}>+{total - 12}</span>
      )}
    </div>
  );
}

/* ─── Focus Warning Overlay ─── */
function FocusWarning({ count, visible }) {
  if (!visible) return null;
  const isRepeat = count >= 2;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 80,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: isRepeat ? "#FEF2F2" : "#FFFBEB",
          border: `1.5px solid ${isRepeat ? "#FECACA" : "#FDE68A"}`,
          borderRadius: 16,
          padding: "14px 20px",
          maxWidth: 340,
          width: "90%",
          pointerEvents: "auto",
          animation: "sfSlideIn 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: isRepeat ? "#FEE2E2" : "#FEF3C7",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isRepeat ? "#DC2626" : "#D97706"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: isRepeat ? "#991B1B" : "#92400E", margin: "0 0 3px" }}>
              {isRepeat ? "Focus breach recorded" : "Focus session interrupted"}
            </p>
            <p style={{ fontSize: 12, color: isRepeat ? "#B91C1C" : "#B45309", margin: 0, lineHeight: 1.5 }}>
              {isRepeat
                ? `${count} interruptions logged. Your integrity score is being affected.`
                : "Tab switch detected. This session is being monitored."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function RealTimeQuiz({ quiz,   studentName, onExit }) {
  const { user } = useUser();

  /* ─── ALL ORIGINAL STATE (UNCHANGED) ─── */
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  /* ─── SHUFFLED QUESTIONS (UNCHANGED) ─── */
  const [shuffledQuestions] = useState(() => shuffleArray(quiz.questions));

  const timerRef = useRef(null);
  const savedRef = useRef(false);

  /* ─── NEW: answer reveal state ─── */
  const [revealed, setRevealed] = useState(false);

  const q = shuffledQuestions[index];
  const total = quiz.questions.length;

  /* ─── TIMER (UNCHANGED) ─── */
  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  /* ─── TAB SWITCH WARNING (UNCHANGED LOGIC) ─── */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabWarnings((w) => w + 1);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 6000);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  /* ─── OPTION CLICK (UNCHANGED LOGIC) ─── */
  const handleSelect = (optIndex) => {
    if (selected !== null) return;
    setSelected(optIndex);
    setRevealed(true);
    if (optIndex === q.correctIndex) setScore((s) => s + 1);
    setTimeout(() => {
      setIndex((prev) => prev + 1);
      setSelected(null);
      setRevealed(false);
    }, 900);
  };

  /* ─── SAVE RESULT (UNCHANGED) ─── */
  const saveResult = async () => {
  if (!user || savedRef.current) return;
  savedRef.current = true;

  const { data, error } = await supabase
    .from("board_results")
    .insert({
      user_id: user.id,
      student_name: studentName,
      class: quiz.class,
      test_id: quiz.id,
      test_name: quiz.title,
      total_questions: total,
      correct_answers: score,
      time_taken: seconds,
      accuracy: Math.round((score / total) * 100),
    });

  console.log("DATA:", data);
  console.log("ERROR:", error);
};

  /* ─── END TEST (UNCHANGED LOGIC) ─── */
  if (!q) {
    clearInterval(timerRef.current);
    saveResult();
    return (
      <BoardTestResult
        studentName={studentName}
        score={score}
        total={total}
        timeSeconds={seconds}
        onBack={onExit}
        onHome={() => (window.location.href = "/")}
        integrityPct={Math.max(0, Math.round(100 - tabWarnings * 12))}
      />
    );
  }

  /* ─── Timer format ─── */
  const mm = Math.floor(seconds / 60);
  const ss = (seconds % 60).toString().padStart(2, "0");
  const timerUrgent = seconds > total * 50;

  /* ─── Option state styling ─── */
  const getOptionStyle = (i) => {
    const base = {
      width: "100%",
      textAlign: "left",
      padding: "14px 16px",
      borderRadius: 14,
      border: "1.5px solid",
      fontSize: 14,
      fontWeight: 500,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      cursor: selected !== null ? "default" : "pointer",
      display: "flex",
      alignItems: "center",
      gap: 12,
      transition: "all 0.2s ease",
      outline: "none",
    };
    if (selected === null) {
      return {
        ...base,
        background: "#FAFAFA",
        borderColor: "#E5E7EB",
        color: "#111827",
      };
    }
    if (i === q.correctIndex) {
      return {
        ...base,
        background: "#ECFDF5",
        borderColor: "#6EE7B7",
        color: "#065F46",
      };
    }
    if (i === selected && i !== q.correctIndex) {
      return {
        ...base,
        background: "#FEF2F2",
        borderColor: "#FECACA",
        color: "#991B1B",
      };
    }
    return {
      ...base,
      background: "#FAFAFA",
      borderColor: "#F3F4F6",
      color: "#9CA3AF",
      opacity: 0.5,
    };
  };

  const getLabelStyle = (i) => {
    if (selected === null) {
      return {
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: "#EDE9FE", color: "#7C3AED",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700,
      };
    }
    if (i === q.correctIndex) {
      return {
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: "#6EE7B7", color: "#065F46",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700,
      };
    }
    if (i === selected) {
      return {
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: "#FECACA", color: "#991B1B",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700,
      };
    }
    return {
      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
      background: "#F3F4F6", color: "#9CA3AF",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 700,
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F7FF",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        userSelect: "none",
        paddingBottom: 40,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes sfSlideIn { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes sfFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .sf-option:hover:not(:disabled) {
          border-color: #C4B5FD !important;
          background: #F5F3FF !important;
          transform: translateY(-1px);
        }
        .sf-option:active:not(:disabled) { transform: scale(0.99) !important; }
      `}</style>

      {/* ── Focus Warning Overlay (UPGRADED — logic untouched) ── */}
      <FocusWarning count={tabWarnings} visible={showWarning} />

      {/* ── Sticky Top Bar ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(248,247,255,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #EDE9FE",
          padding: "0 16px",
        }}
      >
        {/* Progress bar — topmost */}
        <ProgressBar current={index} total={total} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0",
          }}
        >
          {/* Exit */}
          <button
            onClick={onExit}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10,
              background: "#fff", border: "1.5px solid #E5E7EB",
              fontSize: 13, fontWeight: 600, color: "#374151",
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.15s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#F9FAFB"}
            onMouseOut={e => e.currentTarget.style.background = "#fff"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Exit
          </button>

          {/* Question counter + integrity dots */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", margin: 0 }}>
              {index + 1} <span style={{ color: "#C4B5FD" }}>/ {total}</span>
            </p>
            <DotProgress current={index} total={total} />
          </div>

          {/* Timer */}
          <div
            style={{
              padding: "7px 14px",
              borderRadius: 10,
              background: timerUrgent ? "#FEF2F2" : "#F5F3FF",
              border: `1.5px solid ${timerUrgent ? "#FECACA" : "#EDE9FE"}`,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={timerUrgent ? "#DC2626" : "#7C3AED"} strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: timerUrgent ? "#DC2626" : "#7C3AED", fontVariantNumeric: "tabular-nums" }}>
              {mm}:{ss}
            </span>
            {tabWarnings > 0 && (
              <span
                style={{
                  marginLeft: 4, fontSize: 10, fontWeight: 700,
                  color: "#DC2626", background: "#FEE2E2",
                  borderRadius: 6, padding: "1px 6px",
                }}
              >
                {tabWarnings}⚠
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Question Area ── */}
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          padding: "20px 16px",
          animation: "sfFadeUp 0.35s ease",
        }}
        key={index}
      >

        {/* ── Passage / Scenario (if exists — UNCHANGED condition) ── */}
        {quiz.scenario && (
          <div
            style={{
              background: "#fff",
              border: "1.5px solid #EDE9FE",
              borderRadius: 16,
              padding: "16px",
              marginBottom: 16,
              borderLeft: "4px solid #7C3AED",
            }}
          >
            <p
              style={{
                fontSize: 10, fontWeight: 700, color: "#7C3AED",
                letterSpacing: "0.07em", textTransform: "uppercase",
                margin: "0 0 8px",
              }}
            >
              Passage
            </p>
            <p
              style={{
                fontSize: 13, color: "#374151", lineHeight: 1.7,
                margin: 0, whiteSpace: "pre-line",
              }}
            >
              {quiz.scenario}
            </p>
          </div>
        )}

        {/* ── Question Card ── */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #EDE9FE",
            borderRadius: 20,
            padding: "22px 18px 18px",
            marginBottom: 14,
            boxShadow: "0 2px 20px rgba(124,58,237,0.06)",
          }}
        >
          {/* Question label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div
              style={{
                padding: "3px 10px", borderRadius: 7,
                background: "#F5F3FF", border: "1px solid #DDD6FE",
                fontSize: 10, fontWeight: 700, color: "#7C3AED",
                letterSpacing: "0.05em",
              }}
            >
              Q{index + 1}
            </div>
            <div style={{ flex: 1, height: 1, background: "#F5F3FF" }} />
          </div>

          {/* Question text */}
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#111827",
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {q.question}
          </h2>
        </div>

        {/* ── Options ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              className="sf-option"
              disabled={selected !== null}
              onClick={() => handleSelect(i)}
              style={getOptionStyle(i)}
            >
              <div style={getLabelStyle(i)}>
                {revealed && i === q.correctIndex ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : revealed && i === selected && i !== q.correctIndex ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  LABELS[i]
                )}
              </div>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{opt}</span>
            </button>
          ))}
        </div>

        {/* ── Bottom meta strip ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
            padding: "0 4px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 8, height: 8, borderRadius: "50%",
                background: tabWarnings === 0 ? "#059669" : "#F59E0B",
              }}
            />
            <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>
              {tabWarnings === 0 ? "Focus active" : `${tabWarnings} focus breach${tabWarnings > 1 ? "es" : ""}`}
            </span>
          </div>
          <span style={{ fontSize: 11, color: "#C4B5FD", fontWeight: 600 }}>
            {total - index - 1} remaining
          </span>
        </div>
      </div>
    </div>
  );
}