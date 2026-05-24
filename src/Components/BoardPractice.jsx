 // src/Components/BoardPractice.jsx
// ─────────────────────────────────────────────────────────────────────────────
// StudyFlow · Premium Board Practice  •  "Academic Dark Energy" aesthetic
// Mobile-first · CSS-only animations · No extra deps · All logic preserved
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from "react";

import { englishCase10 }           from "../data/caseEnglish10";
import { biology10Test1 }          from "../data/biology10_test1";
import { physics10Test1 }          from "../data/physics10_test1";
import { chemistry10Test1 }        from "../data/chemistry10_test1";
import { firstFlight10 }           from "../data/firstFlight10";
import { footprints10 }            from "../data/footprints10";
import { math10 }                  from "../data/math10";
import { history10Test1 }          from "../data/history10_test1";
import { geography10Test1 }        from "../data/geography10_test1";
import { politicalScience10Test1 } from "../data/political10_test1";
import { economics10Test1 }        from "../data/economics10_test1";
import { physics11Test1 }          from "../data/physics11_test1";
import { chemistry11Test1 }        from "../data/chemistry11_test1";
import { biology11Test1 }          from "../data/biology11_test1";
import { math11Test1 }             from "../data/math11_test1";
import { physics12Test1 }          from "../data/physics12_test1";
import { chemistry12Test1 }        from "../data/chemistry12_test1";
import { math12Test1 }             from "../data/math12_test1";
import { biology12Test1 }          from "../data/biology12_test1";
import { english12Test1 }          from "../data/english12_test1";
import RealTimeQuiz                from "./RealTimeQuiz";

// ─── CSS injection (single call, idempotent) ──────────────────────────────────
const SF_STYLE_ID = "sf-bp-v2";
function injectStyles() {
  if (document.getElementById(SF_STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = SF_STYLE_ID;
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

    /* ── Reset / root ─────────────────────────────────────── */
    .sfbp { font-family: 'Plus Jakarta Sans', sans-serif; }
    .sfbp *, .sfbp *::before, .sfbp *::after { box-sizing: border-box; }

    /* ── Keyframes ────────────────────────────────────────── */
    @keyframes sfSlideUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    @keyframes sfFadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes sfPopIn     { 0%{opacity:0;transform:scale(.88) translateY(14px)} 70%{transform:scale(1.03)} 100%{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes sfFloat     { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-10px) rotate(1deg)} }
    @keyframes sfPulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.4)} 50%{box-shadow:0 0 0 10px rgba(99,102,241,0)} }
    @keyframes sfShimmer   { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
    @keyframes sfProgress  { 0%{width:0%} 10%{width:8%} 25%{width:22%} 45%{width:48%} 65%{width:66%} 82%{width:81%} 94%{width:93%} 100%{width:97%} }
    @keyframes sfDotBounce { 0%,80%,100%{transform:scale(.5);opacity:.4} 40%{transform:scale(1);opacity:1} }
    @keyframes sfStepDone  { 0%{transform:scale(0) rotate(-45deg)} 60%{transform:scale(1.3) rotate(5deg)} 100%{transform:scale(1) rotate(0)} }
    @keyframes sfTipSlide  { 0%{opacity:0;transform:translateX(8px)} 12%{opacity:1;transform:translateX(0)} 85%{opacity:1;transform:translateX(0)} 100%{opacity:0;transform:translateX(-8px)} }
    @keyframes sfOrbit     { from{transform:rotate(0deg) translateX(28px) rotate(0deg)} to{transform:rotate(360deg) translateX(28px) rotate(-360deg)} }
    @keyframes sfBeam      { 0%,100%{opacity:.15} 50%{opacity:.45} }
    @keyframes sfCheckmark { 0%{stroke-dashoffset:20} 100%{stroke-dashoffset:0} }
    @keyframes sfTabSlide  { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
    @keyframes sfCardEnter { from{opacity:0;transform:translateY(16px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes sfPing      { 0%{transform:scale(1);opacity:1} 75%,100%{transform:scale(2.2);opacity:0} }
    @keyframes sfGradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    @keyframes sfCountUp   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

    /* ── Animation helpers ────────────────────────────────── */
    .sf-slide-up  { animation: sfSlideUp  .45s cubic-bezier(.22,.68,0,1.2) both }
    .sf-fade-in   { animation: sfFadeIn   .35s ease both }
    .sf-pop-in    { animation: sfPopIn    .42s cubic-bezier(.22,.68,0,1.2) both }
    .sf-float     { animation: sfFloat    4s ease-in-out infinite }
    .sf-tab-slide { animation: sfTabSlide .25s ease both }

    .sf-d1  { animation-delay:.04s }
    .sf-d2  { animation-delay:.08s }
    .sf-d3  { animation-delay:.12s }
    .sf-d4  { animation-delay:.16s }
    .sf-d5  { animation-delay:.20s }
    .sf-d6  { animation-delay:.24s }
    .sf-d7  { animation-delay:.28s }
    .sf-d8  { animation-delay:.32s }

    /* ── Card interaction ─────────────────────────────────── */
    .sf-card {
      transition: transform .16s cubic-bezier(.22,.68,0,1.2),
                  box-shadow .18s ease,
                  border-color .15s ease,
                  background .15s ease;
      -webkit-tap-highlight-color: transparent;
      cursor: pointer;
    }
    .sf-card:hover  { transform: translateY(-3px); }
    .sf-card:active { transform: scale(.95); }

    .sf-card-enter { animation: sfCardEnter .38s cubic-bezier(.22,.68,0,1.2) both; }

    /* ── Active glow ──────────────────────────────────────── */
    .sf-active-glow { animation: sfPulseGlow 2.2s ease-in-out infinite; }

    /* ── Shimmer bar ──────────────────────────────────────── */
    .sf-shimmer {
      background: linear-gradient(90deg,#1e2540 25%,#252c4a 50%,#1e2540 75%);
      background-size: 600px 100%;
      animation: sfShimmer 1.6s infinite linear;
    }

    /* ── Progress bar ─────────────────────────────────────── */
    .sf-prog { animation: sfProgress 9.5s cubic-bezier(.4,0,.6,1) forwards; width:0%; }

    /* ── Loader dots ──────────────────────────────────────── */
    .sf-dot:nth-child(1) { animation: sfDotBounce 1.1s  .0s infinite; }
    .sf-dot:nth-child(2) { animation: sfDotBounce 1.1s  .18s infinite; }
    .sf-dot:nth-child(3) { animation: sfDotBounce 1.1s  .36s infinite; }

    /* ── Step check ───────────────────────────────────────── */
    .sf-step-done-icon { animation: sfStepDone .4s cubic-bezier(.22,.68,0,1.2) both; }

    /* ── Tip text ─────────────────────────────────────────── */
    .sf-tip { animation: sfTipSlide 3.8s ease-in-out both; }

    /* ── Ping badge ───────────────────────────────────────── */
    .sf-ping { animation: sfPing 1.4s cubic-bezier(0,0,.2,1) infinite; }

    /* ── Animated gradient bg ─────────────────────────────── */
    .sf-grad-anim {
      background-size: 240% 240%;
      animation: sfGradShift 8s ease infinite;
    }

    /* ── Orbit dot ────────────────────────────────────────── */
    .sf-orbit { animation: sfOrbit 6s linear infinite; }

    /* ── Beam line ────────────────────────────────────────── */
    .sf-beam { animation: sfBeam 3s ease-in-out infinite; }

    /* ── Bottom bar blur ──────────────────────────────────── */
    .sf-bottom-blur {
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
    }

    /* ── Glass card ───────────────────────────────────────── */
    .sf-glass {
      background: rgba(255,255,255,.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    /* ── Scrollbar (webkit) ───────────────────────────────── */
    .sfbp ::-webkit-scrollbar { width:4px; height:4px; }
    .sfbp ::-webkit-scrollbar-track { background:transparent; }
    .sfbp ::-webkit-scrollbar-thumb { background:#3730a3; border-radius:99px; }

    /* ── Prevent layout shift on iOS rubber-band ──────────── */
    .sfbp { overscroll-behavior: none; }

    /* ── Mono font for MCQ badge ──────────────────────────── */
    .sf-mono { font-family: 'JetBrains Mono', monospace; }
  `;
  document.head.appendChild(el);
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CLASS10 = [
  { id:"case",   label:"English Passage",      emoji:"📘", desc:"Unique passage · comprehension MCQs",     badge:"10",  color:"violet"  },
  { id:"bio",    label:"Biology",              emoji:"🧬", desc:"Life Processes · Reproduction · Heredity", badge:"40",  color:"rose"    },
  { id:"phy",    label:"Physics",              emoji:"⚛️", desc:"Light · Electricity · Magnetism",          badge:"40",  color:"cyan"    },
  { id:"chem",   label:"Chemistry",            emoji:"🧪", desc:"Reactions · Metals · Carbon Compounds",    badge:"40",  color:"emerald" },
  { id:"math10", label:"Maths",                emoji:"🧮", desc:"Algebra · Geometry · Trigonometry",        badge:"40",  color:"amber"   },
  { id:"hist",   label:"History",              emoji:"🏛️", desc:"Nationalism · Industrialisation · Print",  badge:"40",  color:"orange"  },
  { id:"geo",    label:"Geography",            emoji:"🌍", desc:"Resources · Agriculture · Water",          badge:"40",  color:"teal"    },
  { id:"pol",    label:"Pol. Science",         emoji:"🗳️", desc:"Democracy · Parties · Outcomes",           badge:"40",  color:"fuchsia" },
  { id:"eco",    label:"Economics",            emoji:"📈", desc:"Development · Sectors · Money & Credit",   badge:"40",  color:"lime"    },
  { id:"ff",     label:"First Flight",         emoji:"📗", desc:"Prose + Poems · Full textbook",            badge:"40",  color:"sky"     },
  { id:"fp",     label:"Footprints",           emoji:"🐾", desc:"All supplementary stories",               badge:"40",  color:"stone"   },
];
const CLASS11 = [
  { id:"phy11",  label:"Physics",    emoji:"⚛️", desc:"Mechanics · Kinematics · Laws of Motion",      badge:"40", color:"cyan"    },
  { id:"chem11", label:"Chemistry",  emoji:"🧪", desc:"Organic · Inorganic · Physical",               badge:"40", color:"emerald" },
  { id:"math11", label:"Maths",      emoji:"🧮", desc:"Sets · Trigonometry · Limits",                 badge:"40", color:"amber"   },
  { id:"bio11",  label:"Biology",    emoji:"🧬", desc:"Cell · Biomolecules · Plant Physiology",       badge:"40", color:"rose"    },
];
const CLASS12 = [
  { id:"phy12",  label:"Physics",      emoji:"⚛️", desc:"Electrostatics · Optics · EMI",                badge:"40", color:"cyan"    },
  { id:"chem12", label:"Chemistry",    emoji:"🧪", desc:"Organic · Inorganic · Physical",               badge:"40", color:"emerald" },
  { id:"math12", label:"Maths",        emoji:"🧮", desc:"Calculus · Vectors · Probability",             badge:"40", color:"amber"   },
  { id:"bio12",  label:"Biology",      emoji:"🧬", desc:"Genetics · Evolution · Human Physiology",      badge:"40", color:"rose"    },
  { id:"eng12",  label:"English Core", emoji:"📘", desc:"Flamingo + Vistas · Full syllabus",            badge:"40", color:"violet"  },
];

// color → tailwind token maps (dark theme)
const COLOR = {
  violet:  { ring:"ring-violet-500",  text:"text-violet-400",  bg:"bg-violet-500/15",  dot:"bg-violet-400",  badge:"bg-violet-500/20 text-violet-300 border-violet-500/30"  },
  rose:    { ring:"ring-rose-500",    text:"text-rose-400",    bg:"bg-rose-500/15",    dot:"bg-rose-400",    badge:"bg-rose-500/20 text-rose-300 border-rose-500/30"          },
  cyan:    { ring:"ring-cyan-500",    text:"text-cyan-400",    bg:"bg-cyan-500/15",    dot:"bg-cyan-400",    badge:"bg-cyan-500/20 text-cyan-300 border-cyan-500/30"          },
  emerald: { ring:"ring-emerald-500", text:"text-emerald-400", bg:"bg-emerald-500/15", dot:"bg-emerald-400", badge:"bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  amber:   { ring:"ring-amber-500",   text:"text-amber-400",   bg:"bg-amber-500/15",   dot:"bg-amber-400",   badge:"bg-amber-500/20 text-amber-300 border-amber-500/30"       },
  orange:  { ring:"ring-orange-500",  text:"text-orange-400",  bg:"bg-orange-500/15",  dot:"bg-orange-400",  badge:"bg-orange-500/20 text-orange-300 border-orange-500/30"    },
  teal:    { ring:"ring-teal-500",    text:"text-teal-400",    bg:"bg-teal-500/15",    dot:"bg-teal-400",    badge:"bg-teal-500/20 text-teal-300 border-teal-500/30"          },
  fuchsia: { ring:"ring-fuchsia-500", text:"text-fuchsia-400", bg:"bg-fuchsia-500/15", dot:"bg-fuchsia-400", badge:"bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30" },
  lime:    { ring:"ring-lime-500",    text:"text-lime-400",    bg:"bg-lime-500/15",    dot:"bg-lime-400",    badge:"bg-lime-500/20 text-lime-300 border-lime-500/30"          },
  sky:     { ring:"ring-sky-500",     text:"text-sky-400",     bg:"bg-sky-500/15",     dot:"bg-sky-400",     badge:"bg-sky-500/20 text-sky-300 border-sky-500/30"            },
  stone:   { ring:"ring-stone-400",   text:"text-stone-400",   bg:"bg-stone-500/15",   dot:"bg-stone-400",   badge:"bg-stone-500/20 text-stone-300 border-stone-500/30"      },
};

// ─── Loader steps & tips ──────────────────────────────────────────────────────
const LOAD_STEPS = [
  { label:"Scanning NCERT chapters",         icon:"📖" },
  { label:"Mapping topic weightage",          icon:"📊" },
  { label:"Analyzing board exam patterns",    icon:"🎯" },
  { label:"Balancing difficulty curve",       icon:"⚖️"  },
  { label:"Generating exam-level questions",  icon:"✍️"  },
  { label:"Final quality assurance",          icon:"✅" },
];
const TIPS = [
  "⏱️ Aim for ~90 sec per question on real boards",
  "🧠 Eliminate 2 wrong options first, then decide",
  "📌 No negative marking — attempt every question",
  "💡 Conceptual questions > formula-based ones",
  "🎯 NCERT lines often appear verbatim in boards",
  "🔥 Consistency beats last-minute cramming",
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Decorative animated background for the hero */
function HeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* gradient mesh */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="absolute -bottom-12 -right-10 w-56 h-56 rounded-full bg-violet-600/25 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-blue-500/15 blur-2xl" />
      {/* grid lines */}
      <div className="absolute inset-0 opacity-[.07]"
        style={{backgroundImage:"linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",backgroundSize:"32px 32px"}} />
      {/* floating orbs */}
      <div className="sf-beam absolute top-4 right-8 w-1 h-16 bg-gradient-to-b from-transparent via-indigo-400 to-transparent rotate-12 rounded-full opacity-30" />
      <div className="sf-beam absolute bottom-6 left-12 w-1 h-10 bg-gradient-to-b from-transparent via-violet-400 to-transparent -rotate-12 rounded-full opacity-20" style={{animationDelay:"1.5s"}} />
    </div>
  );
}

/** Hero section */
function Hero({ cls }) {
  const config = {
    10: { tag:"Class 10 · CBSE",  headline:"Board Practice",  sub:"NCERT-aligned · 40 MCQs per test",  accent:"⚡", badge:"Most Popular" },
    11: { tag:"Class 11 · CBSE",  headline:"Board Practice",  sub:"Foundation tests for JEE / NEET",   accent:"🚀", badge:"Foundation" },
    12: { tag:"Class 12 · CBSE",  headline:"Board Practice",  sub:"Exam-ready · Real board patterns",   accent:"🏆", badge:"🔥 Live Now" },
  }[cls];

  return (
    <div className="relative rounded-3xl overflow-hidden mb-5 bg-gradient-to-br from-[#0f1535] via-[#151d45] to-[#0d1130] border border-white/[.07] shadow-2xl shadow-indigo-950/60">
      <HeroBg />
      <div className="relative px-5 pt-6 pb-5">
        {/* top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {/* badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 sf-ping inline-block" />
                AI Generated
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide px-3 py-1 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-500/30">
                {config.badge}
              </span>
            </div>
            {/* headline */}
            <p className="text-white/50 text-[11px] font-semibold tracking-widest uppercase mb-1">{config.tag}</p>
            <h1 className="text-[28px] font-black text-white leading-none tracking-tight">
              {config.accent} {config.headline}
            </h1>
            <p className="text-white/45 text-xs mt-1.5 font-medium">{config.sub}</p>
          </div>

          {/* floating deco */}
          <div className="sf-float flex-shrink-0 mt-1">
            <div className="w-[62px] h-[62px] rounded-2xl bg-white/8 border border-white/12 flex items-center justify-center text-[30px] shadow-xl shadow-indigo-900/40">
              📝
            </div>
          </div>
        </div>

        {/* stat pills */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { v:"40",    l:"MCQs/Test"   },
            { v:"NCERT", l:"Aligned"     },
            { v:"Free",  l:"Always"      },
          ].map(s => (
            <div key={s.l} className="rounded-xl bg-white/[.06] border border-white/[.07] py-2.5 text-center">
              <p className="sf-mono text-sm font-bold text-white">{s.v}</p>
              <p className="text-white/40 text-[10px] font-medium mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Animated class tab switcher */
function ClassTabs({ selected, onChange }) {
  const tabsRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  const updatePill = useCallback(() => {
    if (!tabsRef.current) return;
    const idx = [10, 11, 12].indexOf(selected);
    const btns = tabsRef.current.querySelectorAll(".sf-tab-btn");
    if (btns[idx]) {
      const b = btns[idx];
      setPill({ left: b.offsetLeft, width: b.offsetWidth });
    }
  }, [selected]);

  useEffect(() => {
    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [updatePill]);

  return (
    <div className="mb-5">
      <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-2">Step 1 · Select Class</p>
      <div ref={tabsRef} className="relative flex bg-[#111827] rounded-2xl p-1.5 gap-1 border border-white/[.06] shadow-inner">
        {/* sliding pill */}
        <div
          className="absolute top-1.5 bottom-1.5 rounded-[10px] bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-900/60 transition-all duration-300 ease-out pointer-events-none"
          style={{ left: pill.left, width: pill.width }}
        />
        {[10, 11, 12].map(cls => {
          const active = selected === cls;
          return (
            <button
              key={cls}
              onClick={() => onChange(cls)}
              className={`sf-tab-btn relative z-10 flex-1 py-2.5 rounded-[10px] text-sm font-bold transition-colors duration-200 -webkit-tap-highlight-color-transparent
                ${active ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              Class {cls}
              {cls === 12 && !active && (
                <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
      {selected === 12 && (
        <p className="mt-2 text-[11px] text-amber-400 font-semibold">
          🔥 Class 12 is now live — full syllabus available
        </p>
      )}
    </div>
  );
}

/** Subject card */
function SubjectCard({ item, isActive, onClick, animDelay = 0 }) {
  const c = COLOR[item.color] || COLOR.violet;
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${animDelay}ms` }}
      className={`sf-card sf-card-enter w-full text-left rounded-2xl border-2 p-3.5 relative overflow-hidden
        ${isActive
          ? `${c.ring} border-2 ${c.bg} shadow-xl sf-active-glow`
          : "border-white/[.07] bg-[#111827] hover:border-white/20 shadow-md hover:shadow-lg"
        }`}
    >
      {/* active checkmark */}
      {isActive && (
        <div className="sf-step-done-icon absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 5 4.5 8.5 11 1" />
          </svg>
        </div>
      )}

      {/* emoji icon */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-[22px] mb-3
        ${isActive ? "bg-white/15" : "bg-white/[.05]"}`}>
        {item.emoji}
      </div>

      {/* label + badge */}
      <div className="flex items-start justify-between gap-1 mb-1">
        <p className={`text-sm font-bold leading-tight ${isActive ? "text-white" : "text-slate-200"}`}>
          {item.label}
        </p>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug mb-2.5 line-clamp-2">{item.desc}</p>

      {/* badges row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`sf-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badge}`}>
          {item.badge} MCQs
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[.06] text-slate-400 border border-white/[.07]">
          Board Level
        </span>
      </div>
    </button>
  );
}

/** Pagination dots */
function Pagination({ page, total, onPrev, onNext, onDot }) {
  if (total <= 1) return null;
  return (
    <div className="mt-5 flex items-center justify-center gap-3">
      <button
        onClick={onPrev}
        disabled={page === 0}
        className={`sf-card px-4 py-2 rounded-xl text-xs font-bold border transition
          ${page === 0
            ? "border-white/[.05] text-slate-700 bg-transparent cursor-not-allowed"
            : "border-white/[.1] text-slate-300 bg-[#111827] hover:bg-white/[.07]"}`}
      >
        ← Prev
      </button>
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onDot(i)}
            className={`rounded-full transition-all duration-250 ${i === page ? "w-6 h-2.5 bg-indigo-500" : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={page === total - 1}
        className={`sf-card px-4 py-2 rounded-xl text-xs font-bold border transition
          ${page === total - 1
            ? "border-white/[.05] text-slate-700 bg-transparent cursor-not-allowed"
            : "border-white/[.1] text-slate-300 bg-[#111827] hover:bg-white/[.07]"}`}
      >
        Next →
      </button>
    </div>
  );
}

/** Loader */
function Loader() {
  const [step, setStep]   = useState(0);
  const [tipIdx, setTip]  = useState(0);
  const [tipKey, setTipKey] = useState(0);

  useEffect(() => {
    const si = setInterval(() => setStep(s => Math.min(s + 1, LOAD_STEPS.length - 1)), 1550);
    const ti = setInterval(() => { setTipIdx(t => (t + 1) % TIPS.length); setTipKey(k => k + 1); }, 3800);
    return () => { clearInterval(si); clearInterval(ti); };
  }, []);

  return (
    <div className="sf-fade-in mt-5 rounded-3xl overflow-hidden border border-white/[.07] shadow-2xl shadow-indigo-950/60 bg-[#0f1535]">
      {/* accent bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

      <div className="p-5">
        {/* header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative w-11 h-11 flex-shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-xl shadow-lg shadow-indigo-900/50">
              🤖
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0f1535] animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">StudyFlow AI</p>
            <p className="text-[11px] text-slate-400 font-medium">Crafting your personalised board test…</p>
          </div>
          <div className="flex gap-1">
            <div className="sf-dot w-2 h-2 rounded-full bg-indigo-400" />
            <div className="sf-dot w-2 h-2 rounded-full bg-violet-400" />
            <div className="sf-dot w-2 h-2 rounded-full bg-fuchsia-400" />
          </div>
        </div>

        {/* progress */}
        <div className="mb-5">
          <div className="flex justify-between text-[10px] font-semibold mb-2">
            <span className="text-slate-400">Generating questions</span>
            <span className="text-indigo-400">AI Processing</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/[.08] overflow-hidden">
            <div className="sf-prog h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 shadow-sm shadow-indigo-500/40" />
          </div>
        </div>

        {/* steps */}
        <div className="space-y-2.5 mb-5">
          {LOAD_STEPS.map((s, i) => {
            const done   = i < step;
            const active = i === step;
            return (
              <div key={i} className={`flex items-center gap-3 transition-opacity duration-400 ${i > step + 1 ? "opacity-25" : "opacity-100"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm transition-all duration-300
                  ${done ? "bg-emerald-500/20" : active ? "bg-indigo-500/20 animate-pulse" : "bg-white/[.05]"}`}>
                  {done
                    ? <svg className="sf-step-done-icon w-3.5 h-3.5 text-emerald-400" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 5 4.5 8.5 11 1" /></svg>
                    : <span className={active ? "" : "opacity-30"}>{s.icon}</span>
                  }
                </div>
                <p className={`text-xs font-medium transition-all duration-300 flex-1
                  ${done ? "text-emerald-400/70 line-through decoration-emerald-400/40" : active ? "text-indigo-300" : "text-slate-600"}`}>
                  {s.label}
                </p>
                {active && (
                  <div className="flex gap-0.5 flex-shrink-0">
                    {[0,1,2].map(d => <div key={d} className="sf-dot w-1.5 h-1.5 rounded-full bg-indigo-500" />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* tip card */}
        <div className="rounded-2xl bg-amber-500/[.08] border border-amber-500/20 px-4 py-3 min-h-[62px]">
          <p className="text-[10px] font-bold text-amber-400/70 uppercase tracking-widest mb-1">Board Tip</p>
          <p key={tipKey} className="sf-tip text-xs text-amber-200/80 font-medium leading-relaxed">{TIPS[tipIdx]}</p>
        </div>
      </div>
    </div>
  );
}

/** Sticky bottom CTA */
function BottomCTA({ subject, onStart }) {
  const c = COLOR[subject?.color] || COLOR.violet;
  return (
    <div className="sf-slide-up fixed bottom-0 inset-x-0 z-50 sf-bottom-blur bg-[#080e22]/80 border-t border-white/[.08]">
      {/* top gradient accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* subject chip */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${c.bg} border border-white/[.08]`}>
            {subject?.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{subject?.label ?? "Selected Test"}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`sf-mono text-[10px] font-bold ${c.text}`}>{subject?.badge ?? "40"} MCQs</span>
              <span className="text-slate-600 text-[10px]">·</span>
              <span className="text-[10px] text-slate-500 font-medium">Board Level</span>
            </div>
          </div>

          <button
            onClick={onStart}
            className="sf-card flex-shrink-0 px-5 py-3 rounded-2xl font-bold text-sm text-white
              bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-900/50
              hover:from-indigo-500 hover:to-violet-500 active:scale-95 whitespace-nowrap"
          >
            Start Test →
          </button>
        </div>

        {/* social proof */}
        <p className="text-center text-[10px] text-slate-600 mt-2 font-medium">
          🔥 Attempted by 10,000+ students this week
        </p>

        {/* iOS safe area */}
        <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function BoardPractice() {
  const [selectedClass, setSelectedClass] = useState(10);
  const [category,      setCategory]      = useState(null);
  const [selectedQuiz,  setSelectedQuiz]  = useState(null);
  const [isLoading,     setIsLoading]     = useState(false);
  const [page,          setPage]          = useState(0);
  const [gridKey,       setGridKey]       = useState(0); // re-trigger card animations

  useEffect(() => { injectStyles(); }, []);

  // ── quiz logic (unchanged) ──────────────────────────────────────────────────
  const getUniqueCaseStudy = () => {
    const lastId   = localStorage.getItem("last_case_eng10");
    const available = englishCase10.filter(cs => cs.id !== lastId);
    const chosen   = available[Math.floor(Math.random() * available.length)] || englishCase10[0];
    localStorage.setItem("last_case_eng10", chosen.id);
    return chosen;
  };

  const startTest = () => {
    if (!category || !selectedClass) return;
    setIsLoading(true);
    setTimeout(() => {
      let quiz = null;
      if (selectedClass === 10) {
        const MAP = {
          case: getUniqueCaseStudy(), bio: biology10Test1,     phy: physics10Test1,
          chem: chemistry10Test1,    ff:  firstFlight10,       fp:  footprints10,
          math10: math10,            hist: history10Test1,     geo: geography10Test1,
          pol:  politicalScience10Test1,                       eco: economics10Test1,
        };
        quiz = MAP[category] ?? null;
      }
      if (selectedClass === 11) {
        const MAP = { phy11: physics11Test1, chem11: chemistry11Test1, math11: math11Test1, bio11: biology11Test1 };
        quiz = MAP[category] ?? null;
      }
      if (selectedClass === 12) {
        const MAP = { phy12: physics12Test1, chem12: chemistry12Test1, math12: math12Test1, bio12: biology12Test1, eng12: english12Test1 };
        quiz = MAP[category] ?? null;
      }
      setSelectedQuiz(quiz);
      setIsLoading(false);
    }, 9500);
  };

  const handleBack = () => {
    if (category) { setCategory(null); return; }
    window.location.href = "/";
  };

  // ── route to quiz ───────────────────────────────────────────────────────────
  if (selectedQuiz) {
    return (
      <RealTimeQuiz
        quiz={selectedQuiz}
        onExit={() => { setSelectedQuiz(null); setCategory(null); }}
      />
    );
  }

  // ── subjects for current class ──────────────────────────────────────────────
  const allSubjects  = selectedClass === 10 ? CLASS10 : selectedClass === 11 ? CLASS11 : CLASS12;
  const selectedSub  = allSubjects.find(s => s.id === category);
  const PAGE_SIZE    = 6;
  const pageCount    = Math.ceil(allSubjects.length / PAGE_SIZE);
  const safePage     = Math.min(page, pageCount - 1);
  const pageSubjects = allSubjects.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const handleClassChange = cls => {
    setSelectedClass(cls);
    setCategory(null);
    setPage(0);
    setGridKey(k => k + 1);
  };

  const DELAY_MAP = ["sf-d1","sf-d2","sf-d3","sf-d4","sf-d5","sf-d6","sf-d7","sf-d8"];

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="sfbp min-h-screen w-full bg-[#080e22]">
      <div className="max-w-lg mx-auto px-4 pt-4 pb-36">

        {/* ── top nav ── */}
        <nav className="sf-slide-up flex items-center justify-between mb-5">
          <button
            onClick={handleBack}
            className="sf-card inline-flex items-center gap-2 rounded-full border border-white/[.1] bg-white/[.04] px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[.08] active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/[.08] bg-white/[.04] px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-300 tracking-wide">StudyFlow</span>
          </div>
        </nav>

        {/* ── hero ── */}
        <div className="sf-slide-up sf-d1">
          <Hero cls={selectedClass} />
        </div>

        {/* ── class tabs ── */}
        <div className="sf-slide-up sf-d2">
          <ClassTabs selected={selectedClass} onChange={handleClassChange} />
        </div>

        {/* ── subject grid ── */}
        {!isLoading && (
          <div className="sf-slide-up sf-d3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Step 2 · Choose Subject</p>
              {pageCount > 1 && (
                <p className="sf-mono text-[10px] text-slate-600">{safePage + 1}/{pageCount}</p>
              )}
            </div>

            <div key={gridKey} className="grid grid-cols-2 gap-3">
              {pageSubjects.map((item, i) => (
                <div key={item.id} className={DELAY_MAP[i] || ""}>
                  <SubjectCard
                    item={item}
                    isActive={category === item.id}
                    onClick={() => setCategory(prev => prev === item.id ? null : item.id)}
                    animDelay={0}
                  />
                </div>
              ))}
            </div>

            <Pagination
              page={safePage}
              total={pageCount}
              onPrev={() => setPage(p => Math.max(0, p - 1))}
              onNext={() => setPage(p => Math.min(pageCount - 1, p + 1))}
              onDot={i => setPage(i)}
            />
          </div>
        )}

        {/* ── loader ── */}
        {isLoading && <Loader />}

        {/* ── empty state nudge ── */}
        {!isLoading && !category && (
          <p className="sf-fade-in mt-5 text-center text-[11px] text-slate-700 font-medium">
            👆 Tap a subject above to get started
          </p>
        )}
      </div>

      {/* ── sticky bottom CTA ── */}
      {category && !isLoading && (
        <BottomCTA subject={selectedSub} onStart={startTest} />
      )}
    </div>
  );
}