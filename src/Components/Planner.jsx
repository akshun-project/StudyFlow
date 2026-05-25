 // src/Components/Planner.jsx
// ─────────────────────────────────────────────────────────────────────────────
// StudyFlow · Premium Smart Planner
// UPGRADED: PDF Export + Responsive Output + Mobile Polish
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import { useUser }      from "@clerk/clerk-react";
import { useNavigate }  from "react-router-dom";
import client           from "../geminiClient/gemini";
import { supabase }     from "../Supabase/supabaseClient";
import classData        from "./classData";

// ─── Style injection (idempotent) ─────────────────────────────────────────────
const PLANNER_STYLE_ID = "sf-planner-v2";
function injectPlannerStyles() {
  if (document.getElementById(PLANNER_STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = PLANNER_STYLE_ID;
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

    /* ── Root tokens ───────────────────────────────────────── */
    .planner-root {
      --canvas:   #faf9f7;
      --surface:  #ffffff;
      --border:   #e8e5df;
      --border-2: #d4cfc6;
      --ink-1:    #1a1917;
      --ink-2:    #4a4844;
      --ink-3:    #8a8680;
      --ink-4:    #bab6b0;
      --accent:   #d4850a;
      --accent-2: #f0a020;
      --accent-bg:#fff8ed;
      --green:    #16a34a;
      --green-bg: #f0fdf4;
      --red:      #dc2626;
      --red-bg:   #fef2f2;
      --radius-sm:  8px;
      --radius-md:  12px;
      --radius-lg:  18px;
      --radius-xl:  24px;
      --shadow-sm: 0 1px 3px rgba(26,25,23,.06), 0 1px 2px rgba(26,25,23,.04);
      --shadow-md: 0 4px 12px rgba(26,25,23,.08), 0 2px 4px rgba(26,25,23,.04);
      --shadow-lg: 0 12px 40px rgba(26,25,23,.1), 0 4px 12px rgba(26,25,23,.06);
      font-family: 'Geist', system-ui, sans-serif;
      background: var(--canvas);
      color: var(--ink-1);
    }
    .planner-root *, .planner-root *::before, .planner-root *::after { box-sizing: border-box; }
    .p-serif { font-family: 'Instrument Serif', Georgia, serif; }
    .p-mono  { font-family: 'Geist Mono', 'Courier New', monospace; }

    /* ── Keyframes ─────────────────────────────────────────── */
    @keyframes pFadeUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pFadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes pScaleIn   { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
    @keyframes pSlideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pShake     { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 60%{transform:translateX(4px)} 80%{transform:translateX(-3px)} }
    @keyframes pSpin      { to{transform:rotate(360deg)} }
    @keyframes pProgress  { 0%{width:0%} 15%{width:12%} 35%{width:38%} 55%{width:58%} 75%{width:76%} 90%{width:88%} 100%{width:96%} }
    @keyframes pDot       { 0%,80%,100%{transform:scale(.55);opacity:.35} 40%{transform:scale(1);opacity:1} }
    @keyframes pTipSlide  { from{opacity:0;transform:translateX(6px)} to{opacity:1;transform:translateX(0)} }
    @keyframes pPlanIn    { from{opacity:0;transform:translateY(20px) scale(.99)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes pCardIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pConfetti  { 0%{opacity:1;transform:translateY(0) rotate(0deg) scale(1)} 100%{opacity:0;transform:translateY(-60px) rotate(360deg) scale(.5)} }
    @keyframes pPing      { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.2);opacity:0} }
    @keyframes pGlowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(212,133,10,.3)} 50%{box-shadow:0 0 0 6px rgba(212,133,10,0)} }
    @keyframes pPdfSpin   { to{transform:rotate(360deg)} }

    /* ── Utility animations ────────────────────────────────── */
    .p-fade-up   { animation: pFadeUp  .4s cubic-bezier(.22,.68,0,1.15) both; }
    .p-fade-in   { animation: pFadeIn  .3s ease both; }
    .p-scale-in  { animation: pScaleIn .35s cubic-bezier(.22,.68,0,1.15) both; }
    .p-plan-in   { animation: pPlanIn  .55s cubic-bezier(.22,.68,0,1.1) both; }
    .p-shake     { animation: pShake   .4s ease; }
    .p-tip       { animation: pTipSlide .3s ease both; }

    .p-d1 { animation-delay:.05s }
    .p-d2 { animation-delay:.10s }
    .p-d3 { animation-delay:.15s }
    .p-d4 { animation-delay:.20s }
    .p-d5 { animation-delay:.25s }
    .p-d6 { animation-delay:.30s }

    /* ── Progress bar ──────────────────────────────────────── */
    .p-prog { animation: pProgress 12s cubic-bezier(.4,0,.6,1) forwards; width:0%; }

    /* ── Loader dots ───────────────────────────────────────── */
    .p-dot:nth-child(1) { animation: pDot 1.1s  .00s infinite; }
    .p-dot:nth-child(2) { animation: pDot 1.1s  .18s infinite; }
    .p-dot:nth-child(3) { animation: pDot 1.1s  .36s infinite; }

    /* ── Plan session cards ────────────────────────────────── */
    .p-card-in { animation: pCardIn .38s cubic-bezier(.22,.68,0,1.15) both; }

    /* ── Subject chip ──────────────────────────────────────── */
    .p-chip {
      transition: transform .14s cubic-bezier(.22,.68,0,1.2),
                  background .15s ease, border-color .15s ease,
                  color .15s ease, box-shadow .15s ease;
      -webkit-tap-highlight-color: transparent;
      cursor: pointer;
    }
    .p-chip:hover  { transform: translateY(-1px); }
    .p-chip:active { transform: scale(.96); }

    /* ── Input focus ───────────────────────────────────────── */
    .p-input {
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--ink-1);
      font-family: 'Geist', system-ui, sans-serif;
      font-size: 14px;
      outline: none;
      padding: 11px 14px;
      transition: border-color .2s ease, box-shadow .2s ease;
      width: 100%;
    }
    .p-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(212,133,10,.12);
    }
    .p-input::placeholder { color: var(--ink-4); }

    /* ── Select ────────────────────────────────────────────── */
    .p-select {
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8680' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px !important;
      cursor: pointer;
    }

    /* ── Primary button ────────────────────────────────────── */
    .p-btn-primary {
      background: var(--ink-1);
      color: #fff;
      border: none;
      border-radius: var(--radius-md);
      font-family: 'Geist', system-ui, sans-serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -.01em;
      cursor: pointer;
      transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
    }
    .p-btn-primary:hover:not(:disabled) {
      background: #2d2c29;
      box-shadow: 0 4px 16px rgba(26,25,23,.25);
      transform: translateY(-1px);
    }
    .p-btn-primary:active:not(:disabled) { transform: scale(.98); }
    .p-btn-primary:disabled { opacity:.45; cursor:not-allowed; }

    /* ── Ghost button ──────────────────────────────────────── */
    .p-btn-ghost {
      background: transparent;
      color: var(--ink-3);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-md);
      font-family: 'Geist', system-ui, sans-serif;
      font-size: 13px; font-weight: 500;
      cursor: pointer;
      transition: all .15s ease;
    }
    .p-btn-ghost:hover { background: var(--surface); color: var(--ink-1); border-color: var(--border-2); }

    /* ── PDF button ─────────────────────────────────────────── */
    .p-btn-pdf {
      background: linear-gradient(135deg, #d4850a 0%, #e8950e 100%);
      color: #fff;
      border: none;
      border-radius: var(--radius-md);
      font-family: 'Geist', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: -.01em;
      cursor: pointer;
      transition: transform .15s ease, box-shadow .15s ease, opacity .15s ease;
      display: flex;
      align-items: center;
      gap: 7px;
      white-space: nowrap;
    }
    .p-btn-pdf:hover:not(:disabled) {
      box-shadow: 0 4px 20px rgba(212,133,10,.4);
      transform: translateY(-1px);
    }
    .p-btn-pdf:active:not(:disabled) { transform: scale(.97); }
    .p-btn-pdf:disabled { opacity:.55; cursor:not-allowed; }

    .p-pdf-spinner {
      width: 13px; height: 13px;
      border: 2px solid rgba(255,255,255,.35);
      border-top-color: #fff;
      border-radius: 50%;
      animation: pPdfSpin .7s linear infinite;
      flex-shrink: 0;
    }

    /* ── Section card ──────────────────────────────────────── */
    .p-section {
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    /* ── Timeline connector ────────────────────────────────── */
    .p-timeline-line {
      position: absolute;
      left: 19px; top: 0; bottom: 0;
      width: 1px;
      background: linear-gradient(to bottom, var(--border), transparent);
    }

    /* ── Scrollbar ─────────────────────────────────────────── */
    .planner-root ::-webkit-scrollbar { width: 4px; height: 4px; }
    .planner-root ::-webkit-scrollbar-track { background: transparent; }
    .planner-root ::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 99px; }

    /* ── Grid bg for hero ──────────────────────────────────── */
    .p-grid-bg {
      background-image:
        linear-gradient(var(--border) 1px, transparent 1px),
        linear-gradient(90deg, var(--border) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    /* ── Glow on active step ───────────────────────────────── */
    .p-step-glow { animation: pGlowPulse 2s ease-in-out infinite; }

    /* ── Ping dot ──────────────────────────────────────────── */
    .p-ping::after {
      content:''; position:absolute; inset:0;
      border-radius:inherit;
      background: var(--accent);
      animation: pPing 1.5s ease-in-out infinite;
    }

    /* ── Responsive: Session card ──────────────────────────── */
    @media (max-width: 600px) {
      .p-session-card-inner {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 10px !important;
      }
      .p-session-time-badge {
        align-self: flex-start !important;
      }
      .p-plan-actions {
        flex-direction: column !important;
      }
      .p-plan-actions > button {
        width: 100% !important;
        flex: none !important;
      }
      .p-plan-stats {
        gap: 8px !important;
      }
      .p-plan-stats > div {
        flex: 1 1 calc(50% - 8px) !important;
        min-width: 0 !important;
      }
      .p-legend-row {
        gap: 6px !important;
      }
    }

    @media (max-width: 420px) {
      .p-plan-stats > div {
        flex: 1 1 100% !important;
      }
    }
  `;
  document.head.appendChild(el);
}

// ─── Constants ────────────────────────────────────────────────────────────────
const LOAD_MESSAGES = [
  { icon:"🔍", text:"Analyzing your selected subjects" },
  { icon:"🧩", text:"Mapping chapters to time blocks"  },
  { icon:"⚖️",  text:"Balancing focus sessions & breaks" },
  { icon:"✨", text:"Finalizing your personalised plan" },
];
const STEP_LABELS = [
  { n:1, title:"Class",    sub:"Pick your standard"      },
  { n:2, title:"Subjects", sub:"Up to 3 at once"         },
  { n:3, title:"Chapters", sub:"One per subject"         },
  { n:4, title:"Schedule", sub:"Time & start"            },
];

const SUBJECT_COLORS = [
  { bg:"#fff8ed", border:"#d4850a", text:"#92560a", dot:"#d4850a" },
  { bg:"#f0fdf4", border:"#16a34a", text:"#15803d", dot:"#16a34a" },
  { bg:"#eff6ff", border:"#3b82f6", text:"#1d4ed8", dot:"#3b82f6" },
  { bg:"#fdf4ff", border:"#a855f7", text:"#7e22ce", dot:"#a855f7" },
  { bg:"#fff1f2", border:"#f43f5e", text:"#be123c", dot:"#f43f5e" },
  { bg:"#f0fdfa", border:"#14b8a6", text:"#0f766e", dot:"#14b8a6" },
];

const isBreak = (item) =>
  item.subject?.toLowerCase().includes("break") ||
  item.activity?.toLowerCase().includes("break") ||
  item.subject?.toLowerCase() === "break";

// ─── PDF Export Utility ───────────────────────────────────────────────────────
async function exportPlanToPDF({ plan, studentClass, subjects, chapters, totalTime, startTime }) {
  // Dynamically load jsPDF + html2canvas
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js").then(() =>
      ({ default: window.jspdf?.jsPDF || window.jsPDF })
    ).catch(() => import("jspdf")),
    import("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js").then(() =>
      ({ default: window.html2canvas })
    ).catch(() => import("html2canvas")),
  ]);

  const COLORS = [
    { bg:"#FFF8ED", border:"#D4850A", text:"#92560A" },
    { bg:"#F0FDF4", border:"#16A34A", text:"#15803D" },
    { bg:"#EFF6FF", border:"#3B82F6", text:"#1D4ED8" },
    { bg:"#FDF4FF", border:"#A855F7", text:"#7E22CE" },
    { bg:"#FFF1F2", border:"#F43F5E", text:"#BE123C" },
    { bg:"#F0FDFA", border:"#14B8A6", text:"#0F766E" },
  ];

  const uniqueSubjects = [...new Set(plan.plan.filter(p => !isBreak(p)).map(p => p.subject))];
  const subjectColorMap = {};
  uniqueSubjects.forEach((s, i) => { subjectColorMap[s] = i; });

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 14;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  let y = 0;

  const formatDate = () => {
    const d = new Date();
    return d.toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  };

  // ── Helper: new page check ───────────────────────────────
  const checkPage = (needed = 20) => {
    if (y + needed > PAGE_H - 14) {
      doc.addPage();
      y = 14;
    }
  };

  // ── Page 1: Header ───────────────────────────────────────
  // Amber top bar
  doc.setFillColor(212, 133, 10);
  doc.rect(0, 0, PAGE_W, 2, "F");

  y = 14;

  // StudyFlow branding block
  doc.setFillColor(255, 248, 237);
  doc.roundedRect(MARGIN, y, CONTENT_W, 22, 4, 4, "F");
  doc.setDrawColor(212, 133, 10);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, CONTENT_W, 22, 4, 4, "S");

  // SF logo dot
  doc.setFillColor(212, 133, 10);
  doc.circle(MARGIN + 8, y + 11, 3.5, "F");
  doc.setFillColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("SF", MARGIN + 8, y + 11.8, { align: "center" });

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 25, 23);
  doc.text("StudyFlow", MARGIN + 16, y + 10);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(146, 86, 10);
  doc.text("AI Study Planner · Premium Export", MARGIN + 16, y + 16);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(138, 134, 128);
  doc.text(formatDate(), PAGE_W - MARGIN, y + 11, { align: "right" });

  y += 30;

  // ── Plan title ───────────────────────────────────────────
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 25, 23);
  doc.text("Your Study Plan", MARGIN, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(138, 134, 128);
  doc.text(`Class ${studentClass} · ${subjects.join(", ")} · ${totalTime}h session · Starts ${startTime || "9:00 AM"}`, MARGIN, y);
  y += 10;

  // Divider
  doc.setDrawColor(232, 229, 223);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 8;

  // ── Stats row ─────────────────────────────────────────────
  const sessions = plan.plan.filter(p => !isBreak(p)).length;
  const breaks = plan.plan.filter(p => isBreak(p)).length;
  const stats = [
    { val:`${sessions} sessions`, label:"Focus blocks" },
    { val:`${breaks} breaks`, label:"Rest time" },
    { val:`${totalTime}h`, label:"Total duration" }
  ];

  const statW = CONTENT_W / 3 - 2;
  stats.forEach((s, i) => {
    const sx = MARGIN + i * (statW + 3);
    doc.setFillColor(244, 243, 240);
    doc.roundedRect(sx, y, statW, 16, 3, 3, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 25, 23);
    doc.text(`${s.val}`, sx + statW / 2, y + 7, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(138, 134, 128);
    doc.text(s.label, sx + statW / 2, y + 13, { align: "center" });
  });
  y += 24;

  // ── Subject → chapter summary ─────────────────────────────
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(138, 134, 128);
  doc.text("SUBJECTS & CHAPTERS", MARGIN, y);
  y += 5;

  subjects.forEach((sub, i) => {
    const c = COLORS[i % COLORS.length];
    const [r, g, b] = c.bg.match(/\w\w/g).map(h => parseInt(h, 16));
    doc.setFillColor(r, g, b);
    doc.roundedRect(MARGIN, y, CONTENT_W, 10, 2, 2, "F");
    const [dr, dg, db] = c.border.match(/\w\w/g).map(h => parseInt(h, 16));
    doc.setDrawColor(dr, dg, db);
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGIN, y, CONTENT_W, 10, 2, 2, "S");

    // Subject tag
    doc.setFillColor(dr, dg, db);
    doc.roundedRect(MARGIN + 3, y + 2.5, 28, 5, 1.5, 1.5, "F");
    const [tr, tg, tb] = [255, 255, 255];
    doc.setTextColor(tr, tg, tb);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(sub, MARGIN + 17, y + 5.8, { align: "center" });

    doc.setTextColor(26, 25, 23);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(chapters[sub] || "—", MARGIN + 35, y + 6.2);
    y += 13;
  });

  y += 4;

  // Divider
  doc.setDrawColor(232, 229, 223);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 8;

  // ── Timeline Sessions ──────────────────────────────────────
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(138, 134, 128);
  doc.text("STUDY TIMELINE", MARGIN, y);
  y += 7;

  // Vertical timeline line x
  const LINE_X = MARGIN + 5;

  plan.plan.forEach((item, idx) => {
    const isB = isBreak(item);

    if (isB) {
      checkPage(12);
      // Break row
      doc.setFillColor(250, 249, 247);
      doc.roundedRect(MARGIN, y, CONTENT_W, 9, 2, 2, "F");
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(138, 134, 128);
      doc.text(`${item.time || "Break"} - Rest & Recharge`, MARGIN + CONTENT_W / 2, y + 5.8, { align: "center" });

      // Timeline dot
      doc.setFillColor(232, 229, 223);
      doc.circle(LINE_X, y + 4.5, 1.8, "F");
      y += 13;
      return;
    }

    const colorIdx = subjectColorMap[item.subject] ?? 0;
    const c = COLORS[colorIdx % COLORS.length];
    const cardH = 24;
    checkPage(cardH + 4);

    // Card background
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(232, 229, 223);
    doc.setLineWidth(0.4);
    doc.roundedRect(MARGIN + 10, y, CONTENT_W - 10, cardH, 3, 3, "FD");

    // Left accent strip
    const [ar, ag, ab] = c.border.match(/\w\w/g).map(h => parseInt(h, 16));
    doc.setFillColor(ar, ag, ab);
    doc.roundedRect(MARGIN + 10, y, 2.5, cardH, 1.5, 1.5, "F");

    // Timeline dot
    doc.setFillColor(ar, ag, ab);
    doc.circle(LINE_X, y + cardH / 2, 2.5, "F");

    // Timeline connector
    if (idx < plan.plan.length - 1) {
      doc.setDrawColor(232, 229, 223);
      doc.setLineWidth(0.5);
      doc.line(LINE_X, y + cardH, LINE_X, y + cardH + 8);
    }

    // Subject badge
    const [sbgR, sbgG, sbgB] = c.bg.match(/\w\w/g).map(h => parseInt(h, 16));
    doc.setFillColor(sbgR, sbgG, sbgB);
    doc.roundedRect(MARGIN + 15, y + 4, 30, 5, 1.5, 1.5, "F");
    const [stR, stG, stB] = c.text.match(/\w\w/g).map(h => parseInt(h, 16));
    doc.setTextColor(stR, stG, stB);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    const subLabel = item.subject.length > 14 ? item.subject.slice(0, 13) + "…" : item.subject;
    doc.text(subLabel, MARGIN + 30, y + 7.5, { align: "center" });

    // Time badge (right)
    doc.setFillColor(244, 243, 240);
    doc.roundedRect(MARGIN + CONTENT_W - 38, y + 3.5, 36, 6, 1.5, 1.5, "F");
    doc.setTextColor(74, 72, 68);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    const timeLabel = (item.time || "").length > 20 ? (item.time || "").slice(0, 18) + "…" : (item.time || "");
    doc.text(timeLabel, MARGIN + CONTENT_W - 20, y + 7.2, { align: "center" });

    // Chapter
    if (item.chapter) {
      doc.setTextColor(138, 134, 128);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      const chap = item.chapter.length > 30 ? item.chapter.slice(0, 28) + "…" : item.chapter;
      doc.text(chap, MARGIN + 48, y + 7.5);
    }

    // Activity
    doc.setTextColor(26, 25, 23);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    const activityLines = doc.splitTextToSize(item.activity || "", CONTENT_W - 22);
    const actText = activityLines.slice(0, 2).join("\n");
    doc.text(actText, MARGIN + 15, y + 16, { lineHeightFactor: 1.4 });

    y += cardH + 5;
  });

  

  // ── Footer on every page ─────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(212, 133, 10);
    doc.rect(0, PAGE_H - 1.5, PAGE_W, 1.5, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(186, 182, 176);
    doc.text("Generated by StudyFlow AI · studyflow.app", MARGIN, PAGE_H - 5);
    doc.text(`Page ${i} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 5, { align: "right" });
  }

  doc.save(`StudyFlow-Plan-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepStrip({ activeStep }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:28 }}>
      {STEP_LABELS.map((s, i) => {
        const done   = activeStep > s.n;
        const active = activeStep === s.n;
        return (
          <div key={s.n} style={{ display:"flex", alignItems:"center", flex: i < STEP_LABELS.length - 1 ? "1" : "0" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0 }}>
              <div style={{
                width:28, height:28, borderRadius:"50%",
                display:"flex", alignItems:"center", justifyContent:"center",
                background: done ? "#1a1917" : active ? "#fff8ed" : "#f4f3f0",
                border: `2px solid ${done ? "#1a1917" : active ? "#d4850a" : "#e8e5df"}`,
                fontSize:11, fontWeight:700,
                color: done ? "#fff" : active ? "#d4850a" : "#bab6b0",
                transition:"all .25s ease", position:"relative",
              }}>
                {done
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : s.n
                }
                {active && <div style={{ position:"absolute", inset:-2, borderRadius:"50%", border:"2px solid rgba(212,133,10,.3)" }} />}
              </div>
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:10, fontWeight:700, color: active ? "#1a1917" : "#8a8680", margin:0, letterSpacing:"-.01em" }}>{s.title}</p>
              </div>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{
                flex:1, height:2, margin:"0 6px 16px",
                background: done ? "#1a1917" : "#e8e5df",
                transition:"background .25s ease", borderRadius:99,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionHead({ step, title, sub }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
        <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, fontWeight:700, color:"#d4850a", letterSpacing:"0.12em" }}>STEP {step}</span>
        <div style={{ height:1, flex:1, background:"#f0ede8" }} />
      </div>
      <h3 style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, color:"#1a1917", margin:0, lineHeight:1.2, letterSpacing:"-.02em" }}>{title}</h3>
      {sub && <p style={{ fontSize:12, color:"#8a8680", margin:"3px 0 0", fontWeight:500 }}>{sub}</p>}
    </div>
  );
}

function SubjectChip({ label, active, onClick, colorIdx, disabled }) {
  const c = SUBJECT_COLORS[colorIdx % SUBJECT_COLORS.length];
  return (
    <button
      type="button"
      className="p-chip"
      onClick={onClick}
      disabled={disabled && !active}
      style={{
        padding:"9px 16px", borderRadius:99,
        border:`1.5px solid ${active ? c.border : "#e8e5df"}`,
        background: active ? c.bg : "#faf9f7",
        color: active ? c.text : "#4a4844",
        fontSize:13, fontWeight: active ? 700 : 500,
        display:"flex", alignItems:"center", gap:7,
        boxShadow: active ? `0 2px 10px ${c.border}25` : "none",
        opacity: disabled && !active ? .4 : 1,
        cursor: disabled && !active ? "not-allowed" : "pointer",
      }}
    >
      {active && <div style={{ width:7, height:7, borderRadius:"50%", background:c.dot, flexShrink:0 }} />}
      {label}
      {active && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.text} strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
    </button>
  );
}

function LoaderOverlay({ step }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:200,
      display:"flex", alignItems:"center", justifyContent:"center",
      background:"rgba(250,249,247,.85)",
      backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
    }}>
      <div className="p-scale-in" style={{
        background:"#ffffff", border:"1.5px solid #e8e5df",
        borderRadius:24, padding:"32px 28px",
        maxWidth:360, width:"92%",
        boxShadow:"0 24px 60px rgba(26,25,23,.12)",
        textAlign:"center",
      }}>
        <div style={{ height:3, background:"#f0ede8", borderRadius:99, overflow:"hidden", marginBottom:28 }}>
          <div className="p-prog" style={{ height:"100%", borderRadius:99, background:"#d4850a" }} />
        </div>
        <div style={{
          width:56, height:56, borderRadius:18,
          background:"#fff8ed", border:"1.5px solid #f0d0a0",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:26, margin:"0 auto 16px",
          boxShadow:"0 4px 16px rgba(212,133,10,.15)",
        }}>
          {LOAD_MESSAGES[step]?.icon ?? "✨"}
        </div>
        <p style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, color:"#1a1917", margin:"0 0 6px", letterSpacing:"-.02em" }}>
          {LOAD_MESSAGES[step]?.text ?? "Generating…"}
        </p>
        <p style={{ fontSize:12, color:"#8a8680", margin:"0 0 20px", fontWeight:500 }}>This takes just a few seconds</p>
        <div style={{ display:"flex", justifyContent:"center", gap:6 }}>
          {[0,1,2].map(i => <div key={i} className="p-dot" style={{ width:8, height:8, borderRadius:"50%", background:"#d4850a" }} />)}
        </div>
        <div style={{ marginTop:24, display:"flex", flexDirection:"column", gap:8 }}>
          {LOAD_MESSAGES.map((m, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, opacity: i > step + 1 ? .25 : 1, transition:"opacity .3s ease" }}>
              <div style={{
                width:20, height:20, borderRadius:"50%", flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                background: i < step ? "#f0fdf4" : i === step ? "#fff8ed" : "#f4f3f0",
                border: `1.5px solid ${i < step ? "#16a34a" : i === step ? "#d4850a" : "#e8e5df"}`,
              }}>
                {i < step
                  ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <span style={{ fontSize:8 }}>{m.icon}</span>
                }
              </div>
              <p style={{
                fontSize:12, fontWeight:500, margin:0, textAlign:"left",
                color: i < step ? "#16a34a" : i === step ? "#1a1917" : "#bab6b0",
                textDecoration: i < step ? "line-through" : "none",
              }}>{m.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Upgraded SessionCard with responsive layout ───────────────────────────────
function SessionCard({ item, idx, colorIdx }) {
  const isB = isBreak(item);
  const c   = SUBJECT_COLORS[colorIdx % SUBJECT_COLORS.length];

  if (isB) return (
    <div className="p-card-in" style={{
      animationDelay:`${idx * .06}s`,
      display:"flex", alignItems:"center", gap:10,
      padding:"10px 0",
    }}>
      <div style={{ width:8, height:8, borderRadius:"50%", background:"#e8e5df", flexShrink:0, marginLeft:8 }} />
      <div style={{
        flex:1, height:1,
        background:"repeating-linear-gradient(90deg,#e8e5df 0,#e8e5df 4px,transparent 4px,transparent 10px)",
        borderRadius:99,
      }} />
      <span style={{ fontSize:11, color:"#8a8680", fontWeight:600, letterSpacing:".02em", flexShrink:0 }}>
        ☕ {item.time} · Break
      </span>
      <div style={{
        flex:1, height:1,
        background:"repeating-linear-gradient(90deg,#e8e5df 0,#e8e5df 4px,transparent 4px,transparent 10px)",
        borderRadius:99,
      }} />
    </div>
  );

  return (
    <div className="p-card-in" style={{ animationDelay:`${idx * .06}s`, display:"flex", gap:12, alignItems:"flex-start" }}>
      {/* timeline dot */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
        <div style={{
          width:14, height:14, borderRadius:"50%",
          background:c.bg, border:`2px solid ${c.border}`,
          marginTop:16,
        }} />
      </div>

      {/* card */}
      <div
        style={{
          flex:1, minWidth:0,
          background:"#ffffff",
          border:"1.5px solid #e8e5df",
          borderRadius:14,
          padding:"clamp(12px, 3vw, 16px)",
          boxShadow:"0 2px 8px rgba(26,25,23,.04)",
          transition:"box-shadow .2s ease, transform .2s ease",
        }}
        onMouseOver={e => { e.currentTarget.style.boxShadow="0 6px 20px rgba(26,25,23,.09)"; e.currentTarget.style.transform="translateY(-1px)"; }}
        onMouseOut={e => { e.currentTarget.style.boxShadow="0 2px 8px rgba(26,25,23,.04)"; e.currentTarget.style.transform="translateY(0)"; }}
      >
        {/* top row: badges + time */}
        <div className="p-session-card-inner" style={{
          display:"flex", alignItems:"flex-start",
          justifyContent:"space-between", gap:10,
        }}>
          <div style={{ flex:1, minWidth:0 }}>
            {/* subject + chapter row */}
            <div style={{
              display:"flex", alignItems:"center",
              gap:7, marginBottom:7, flexWrap:"wrap",
            }}>
              <span style={{
                fontFamily:"'Geist Mono',monospace",
                fontSize:10, fontWeight:700,
                padding:"2px 8px", borderRadius:5,
                background:c.bg, color:c.text,
                border:`1px solid ${c.border}`,
                letterSpacing:".03em",
                whiteSpace:"nowrap",
                flexShrink:0,
              }}>{item.subject}</span>
              {item.chapter && (
                <span style={{
                  fontSize:11, color:"#8a8680", fontWeight:500,
                  overflow:"hidden", textOverflow:"ellipsis",
                  whiteSpace:"nowrap", maxWidth:"100%",
                }}>
                  {item.chapter}
                </span>
              )}
            </div>
            {/* activity */}
            <p style={{
              fontSize:"clamp(13px, 3.5vw, 14px)",
              fontWeight:600, color:"#1a1917",
              margin:0, lineHeight:1.5,
              wordBreak:"break-word",
            }}>{item.activity}</p>
          </div>

          {/* time badge */}
          <div className="p-session-time-badge" style={{
            padding:"6px 10px", borderRadius:8,
            background:"#f4f3f0",
            flexShrink:0, alignSelf:"flex-start",
          }}>
            <p style={{
              fontFamily:"'Geist Mono',monospace",
              fontSize:"clamp(10px, 2.5vw, 11px)",
              fontWeight:600, color:"#4a4844", margin:0,
              whiteSpace:"nowrap",
            }}>{item.time}</p>
          </div>
        </div>

        {/* goal tag (if present) */}
        {item.goal && (
          <div style={{
            marginTop:9,
            display:"flex", alignItems:"center", gap:6,
            padding:"5px 10px",
            background:"#f9f8f6", borderRadius:8,
            border:"1px solid #eceae5",
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8a8680" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize:11, color:"#8a8680", fontWeight:500 }}>{item.goal}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SuccessBanner({ onView }) {
  return (
    <div className="p-fade-in" style={{
      display:"flex", alignItems:"center",
      justifyContent:"space-between",
      gap:12, flexWrap:"wrap",
      background:"#f0fdf4",
      border:"1.5px solid #bbf7d0",
      borderRadius:14, padding:"14px 18px",
      marginBottom:16,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{
          width:32, height:32, borderRadius:10,
          background:"#dcfce7", border:"1.5px solid #86efac",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
        }}>✅</div>
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:"#15803d", margin:0 }}>Plan saved to your Dashboard</p>
          <p style={{ fontSize:11, color:"#4ade80", margin:0, fontWeight:500 }}>You can review it anytime</p>
        </div>
      </div>
      <button onClick={onView} style={{
        padding:"8px 16px", borderRadius:10,
        background:"#16a34a", color:"#fff",
        fontSize:12, fontWeight:700, border:"none",
        cursor:"pointer", fontFamily:"'Geist',system-ui,sans-serif",
        whiteSpace:"nowrap",
      }}>
        Open Dashboard →
      </button>
    </div>
  );
}

// ─── Main Planner component ───────────────────────────────────────────────────
export default function Planner() {
  const { user }   = useUser();
  const navigate   = useNavigate();

  const [studentClass,    setStudentClass]    = useState("");
  const [subjects,        setSubjects]        = useState([]);
  const [chapters,        setChapters]        = useState({});
  const [totalTime,       setTotalTime]       = useState("");
  const [startTime,       setStartTime]       = useState("");
  const [loading,         setLoading]         = useState(false);
  const [loadingStep,     setLoadingStep]      = useState(0);
  const [plan,            setPlan]            = useState("");
  const [error,           setError]           = useState("");
  const [showSaved,       setShowSaved]       = useState(false);
  const [subjectLimitHit, setSubjectLimitHit] = useState(false);
  const [highlightPlan,   setHighlightPlan]   = useState(false);
  // ── NEW: PDF export state ──
  const [pdfLoading,      setPdfLoading]      = useState(false);

  const planRef  = useRef(null);
  const shakeRef = useRef(null);

  useEffect(() => { injectPlannerStyles(); }, []);

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => setLoadingStep(p => (p + 1) % LOAD_MESSAGES.length), 3000);
    return () => clearInterval(iv);
  }, [loading]);

  useEffect(() => {
    if (plan?.plan && planRef.current) {
      setTimeout(() => planRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 120);
      setHighlightPlan(true);
      const t = setTimeout(() => setHighlightPlan(false), 2500);
      return () => clearTimeout(t);
    }
  }, [plan]);

  const handleDurationChange = (e) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) return setTotalTime("");
    value = Math.round(value * 2) / 2;
    if (value < 0.5) value = 0.5;
    if (value > 8) value = 8;
    setTotalTime(value);
  };

  const handleSubjectChange = useCallback((subject) => {
    if (subjects.includes(subject)) {
      setSubjects(s => s.filter(x => x !== subject));
      setChapters(c => { const n = {...c}; delete n[subject]; return n; });
      setSubjectLimitHit(false);
    } else if (subjects.length < 3) {
      setSubjects(s => [...s, subject]);
      setSubjectLimitHit(false);
    } else {
      setSubjectLimitHit(true);
      if (shakeRef.current) {
        shakeRef.current.classList.remove("p-shake");
        void shakeRef.current.offsetWidth;
        shakeRef.current.classList.add("p-shake");
      }
      setTimeout(() => setSubjectLimitHit(false), 1600);
    }
  }, [subjects]);

  const handleChapterChange = (subject, chapter) =>
    setChapters(c => ({ ...c, [subject]: chapter }));

  // ── NEW: PDF export handler ──────────────────────────────
  const handleDownloadPDF = async () => {
    if (!plan?.plan || pdfLoading) return;
    setPdfLoading(true);
    try {
      await exportPlanToPDF({ plan, studentClass, subjects, chapters, totalTime, startTime });
    } catch (err) {
      console.error("PDF export error:", err);
      alert("PDF export failed. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentClass || subjects.length === 0 || !totalTime) {
      alert("Looks like a few details are missing — please check again.");
      return;
    }
    for (const sub of subjects) {
      if (!chapters[sub]?.trim()) {
        alert(`Please select a chapter for ${sub}`);
        return;
      }
    }
    setLoading(true);
    setPlan("");
    setError("");
    setShowSaved(false);
    setLoadingStep(0);

    try {
      const prompt = `
You are StudyFlow — an elite AI academic mentor for CBSE students.

Your goal is NOT just to create a timetable.

Your goal is to help the student understand:
- WHAT to study
- HOW to study
- WHY that session matters
- WHICH concepts need focus
- WHAT outcome should be achieved in each session

Generate a HIGHLY PRACTICAL and REALISTIC study plan.

━━━━━━━━━━━━━━━
STUDENT DETAILS
━━━━━━━━━━━━━━━

Class: ${studentClass}

Subjects:
${subjects.join(", ")}

Selected Chapters:
${subjects.map((s) => `${s}: ${chapters[s]}`).join("\n")}

Total Study Time:
${totalTime} hours

Preferred Start Time:
${startTime || "9:00 AM"}

━━━━━━━━━━━━━━━
STRICT REQUIREMENTS
━━━━━━━━━━━━━━━

1. Divide time intelligently.
Difficult subjects should get slightly more focus.

2. Every study session MUST contain:
- clear learning goal
- topic focus
- outcome-oriented activity

3. Activities should feel HUMAN and REALISTIC.

BAD examples:
- "Study chapter"
- "Read notes"

GOOD examples:
- "Practice derivation questions from Numericals"
- "Revise important formulas and solve 5 MCQs"
- "Understand the causes of French Revolution with timeline mapping"
- "Solve previous year probability questions"

4. Add proper breaks naturally.

5. Sessions should feel productive, not robotic.

6. Keep the schedule realistic for students.

7. Include:
- revision
- recall practice
- MCQ solving
- concept review
- weak topic strengthening
when appropriate.

8. Output should feel like:
a real mentor designed it.

9. Make activities SHORT but HIGH VALUE.

10. Avoid generic repetitive wording.

━━━━━━━━━━━━━━━
IMPORTANT JSON FORMAT
━━━━━━━━━━━━━━━

Return ONLY valid JSON.

Use this exact structure:

{
  "plan": [
    {
      "time": "9:00 AM - 9:45 AM",
      "subject": "Mathematics",
      "chapter": "Polynomials",
      "activity": "Revise polynomial identities and solve 8 practice questions",
      "goal": "Strengthen formula application speed",
      "energy": "High"
    }
  ],
  
}

━━━━━━━━━━━━━━━
ENERGY RULES
━━━━━━━━━━━━━━━

Use:
- "High"
- "Medium"
- "Light"

High: deep focus/problem solving
Medium: revision/practice
Light: reading/recall/break

━━━━━━━━━━━━━━━
VERY IMPORTANT
━━━━━━━━━━━━━━━

- JSON only
- no markdown
- no explanation
- no extra text
`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
      });

      let text = response.response?.candidates?.[0]?.content?.parts?.[0]?.text
        || response?.text || "";
      text = text.replace(/```json|```/g, "").trim();

      let parsed;
      try { parsed = JSON.parse(text); }
      catch { setError("We couldn't format your plan properly. Please try again."); return; }

      if (!parsed.plan || !Array.isArray(parsed.plan)) {
        setError("Invalid response from AI. Try again later."); return;
      }

      setPlan(parsed);

      if (user) {
        await supabase.from("planner_data").insert([{
          user_id:    user.id,
          class:      studentClass,
          subjects,
          chapters,
          total_time: totalTime,
          schedule:   JSON.stringify(parsed.plan),
          created_at: new Date(),
        }]);
      }

      setTimeout(() => {
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 8000);
      }, 800);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError("Something went wrong while generating your plan. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const availableSubjects = studentClass ? classData[studentClass]?.subjects ?? [] : [];
  const activeStep =
    !studentClass ? 1 :
    subjects.length === 0 ? 2 :
    subjects.some(s => !chapters[s]) ? 3 : 4;

  const subjectColorMap = {};
  subjects.forEach((s, i) => { subjectColorMap[s] = i; });
  availableSubjects.forEach((s, i) => {
    if (subjectColorMap[s] === undefined) subjectColorMap[s] = i;
  });

  const planSessions = plan?.plan?.filter(p => !isBreak(p)).length ?? 0;
  const planBreaks   = plan?.plan?.filter(p => isBreak(p)).length ?? 0;
  const uniqueSubjectsInPlan = [...new Set(plan?.plan?.filter(p => !isBreak(p)).map(p => p.subject))];

  return (
    <div className="planner-root" style={{ minHeight:"100vh" }}>

      {loading && <LoaderOverlay step={loadingStep} />}

      <div className="p-grid-bg" style={{
        position:"fixed", inset:0, opacity:.4,
        pointerEvents:"none", zIndex:0,
      }} />

      <div style={{
        position:"relative", zIndex:1,
        maxWidth:720, margin:"0 auto",
        padding:"28px 16px 80px",
      }}>

        {/* ── Top nav ── */}
        <div className="p-fade-in" style={{
          display:"flex", alignItems:"center",
          justifyContent:"space-between", marginBottom:32,
        }}>
          <button onClick={() => navigate("/")} className="p-btn-ghost"
            style={{ padding:"8px 16px", display:"flex", alignItems:"center", gap:6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </button>
          <div style={{
            display:"flex", alignItems:"center", gap:8,
            padding:"6px 14px", borderRadius:99,
            background:"#fff", border:"1.5px solid #e8e5df",
            boxShadow:"0 1px 4px rgba(26,25,23,.06)",
          }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#d4850a", position:"relative" }} className="p-ping" />
            <span style={{ fontSize:12, fontWeight:700, color:"#4a4844", letterSpacing:"-.01em" }}>
              StudyFlow Planner
            </span>
          </div>
        </div>

        {/* ── Hero ── */}
        <div className="p-fade-up p-d1" style={{ marginBottom:36, textAlign:"left" }}>
          <p style={{
            fontFamily:"'Geist Mono',monospace",
            fontSize:10, fontWeight:700, color:"#d4850a",
            letterSpacing:".12em", textTransform:"uppercase", margin:"0 0 8px",
          }}>AI Study Planner</p>
          <h1 className="p-serif" style={{
            fontSize:"clamp(28px,5vw,40px)",
            color:"#1a1917", margin:"0 0 8px",
            lineHeight:1.15, letterSpacing:"-.03em",
          }}>
            Your perfect study day,<br />
            <span style={{ fontStyle:"italic", color:"#d4850a" }}>designed by AI.</span>
          </h1>
          <p style={{
            fontSize:14, color:"#8a8680", margin:0,
            maxWidth:420, lineHeight:1.6, fontWeight:500,
          }}>
            Tell us what you're studying. We'll build a realistic, balanced timetable tailored to your schedule.
          </p>
        </div>

        {/* ── Step strip ── */}
        <div className="p-fade-up p-d2">
          <StepStrip activeStep={activeStep} />
        </div>

        {/* ══════════════════════ FORM ══════════════════════ */}
        <form onSubmit={handleSubmit}>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* STEP 1 */}
            <div className="p-section p-fade-up p-d2" style={{ padding:"22px 22px" }}>
              <SectionHead step={1} title="Select your class" sub="Which standard are you in?" />
              <select className="p-input p-select" value={studentClass}
                onChange={e => { setStudentClass(e.target.value); setSubjects([]); setChapters({}); }}>
                <option value="">Choose class…</option>
                {Object.keys(classData).map(c => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </div>

            {/* STEP 2 */}
            {studentClass && (
              <div className="p-section p-fade-up" style={{ padding:"22px 22px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                  <SectionHead step={2} title="Pick subjects" sub="Choose up to 3 for one plan" />
                  <div ref={shakeRef} style={{
                    padding:"4px 12px", borderRadius:99,
                    background: subjectLimitHit ? "#fff1f2" : subjects.length === 3 ? "#fff8ed" : "#f4f3f0",
                    border: `1.5px solid ${subjectLimitHit ? "#fecaca" : subjects.length === 3 ? "#f0d0a0" : "#e8e5df"}`,
                    flexShrink:0,
                  }}>
                    <span style={{
                      fontFamily:"'Geist Mono',monospace",
                      fontSize:11, fontWeight:700,
                      color: subjectLimitHit ? "#dc2626" : subjects.length === 3 ? "#d4850a" : "#8a8680",
                    }}>{subjects.length}/3</span>
                  </div>
                </div>
                {subjectLimitHit && (
                  <div className="p-fade-in" style={{
                    padding:"10px 14px", borderRadius:10,
                    background:"#fff1f2", border:"1.5px solid #fecaca",
                    marginBottom:12, display:"flex", alignItems:"center", gap:8,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p style={{ fontSize:12, color:"#dc2626", fontWeight:600, margin:0 }}>
                      Maximum 3 subjects per plan — deselect one to change.
                    </p>
                  </div>
                )}
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {availableSubjects.map(sub => (
                    <SubjectChip key={sub} label={sub} active={subjects.includes(sub)}
                      onClick={() => handleSubjectChange(sub)}
                      colorIdx={subjectColorMap[sub] ?? 0}
                      disabled={subjects.length >= 3} />
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {subjects.length > 0 && (
              <div className="p-section p-fade-up" style={{ padding:"22px 22px" }}>
                <SectionHead step={3} title="Select chapters" sub="One chapter per subject for focused preparation" />
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {subjects.map((sub, i) => {
                    const c = SUBJECT_COLORS[subjectColorMap[sub] % SUBJECT_COLORS.length];
                    return (
                      <div key={sub}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
                          <label style={{ fontSize:13, fontWeight:700, color:"#1a1917", letterSpacing:"-.01em" }}>{sub}</label>
                          {chapters[sub] && (
                            <span style={{
                              fontFamily:"'Geist Mono',monospace",
                              fontSize:10, color:c.text,
                              background:c.bg, border:`1px solid ${c.border}`,
                              padding:"1px 7px", borderRadius:5, fontWeight:600,
                            }}>selected</span>
                          )}
                        </div>
                        <select className="p-input p-select"
                          value={chapters[sub] || ""}
                          onChange={e => handleChapterChange(sub, e.target.value)}>
                          <option value="">Choose chapter…</option>
                          {classData[studentClass]?.chapters?.[sub]?.map(ch => (
                            <option key={ch} value={ch}>{ch}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {subjects.length > 0 && (
              <div className="p-section p-fade-up" style={{ padding:"22px 22px" }}>
                <SectionHead step={4} title="Schedule your session" sub="How long and when do you want to start?" />
                <div style={{
                  display:"grid",
                  gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
                  gap:16,
                }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:700, color:"#4a4844", letterSpacing:"-.01em", display:"block", marginBottom:6 }}>
                      Total study time
                    </label>
                    <input type="number" min="0.5" step="0.5" className="p-input"
                      value={totalTime} onChange={handleDurationChange} placeholder="e.g. 2, 3.5, 5" />
                    <p style={{ fontSize:11, color:"#8a8680", margin:"6px 0 0", fontWeight:500 }}>
                      Max 8 hours · We recommend 2–4 hrs for deep focus
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:700, color:"#4a4844", letterSpacing:"-.01em", display:"block", marginBottom:6 }}>
                      Start time <span style={{ color:"#bab6b0", fontWeight:500 }}>(optional)</span>
                    </label>
                    <input type="time" className="p-input" value={startTime}
                      onChange={e => setStartTime(e.target.value)} />
                    <p style={{ fontSize:11, color:"#8a8680", margin:"6px 0 0", fontWeight:500 }}>
                      Defaults to <span style={{ fontFamily:"'Geist Mono',monospace" }}>9:00 AM</span> if empty
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Generate button */}
            {subjects.length > 0 && (
              <div className="p-fade-up" style={{
                display:"flex", flexDirection:"column", alignItems:"stretch", gap:10, marginTop:4,
              }}>
                <button type="submit"
                  disabled={loading || !totalTime || subjects.some(s => !chapters[s])}
                  className="p-btn-primary"
                  style={{ padding:"15px 24px", width:"100%", fontSize:15 }}>
                  {loading ? "AI is building your plan…" : "Generate My Study Plan →"}
                </button>
                {(!totalTime || subjects.some(s => !chapters[s])) && (
                  <p style={{ fontSize:11, color:"#8a8680", textAlign:"center", fontWeight:500, margin:0 }}>
                    Complete all steps above to unlock your plan
                  </p>
                )}
              </div>
            )}

          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="p-fade-in" style={{
            marginTop:20, padding:"14px 18px", borderRadius:14,
            background:"#fff1f2", border:"1.5px solid #fecaca",
            display:"flex", alignItems:"center", gap:10,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ fontSize:13, color:"#dc2626", fontWeight:600, margin:0 }}>{error}</p>
          </div>
        )}

        {/* ═══════════════ GENERATED PLAN ═══════════════ */}
        {plan?.plan && (
          <div
            ref={planRef}
            className="p-plan-in"
            style={{
              marginTop:36,
              outline: highlightPlan ? "2.5px solid #16a34a" : "2.5px solid transparent",
              outlineOffset:4,
              borderRadius:24,
              transition:"outline-color .4s ease",
            }}
          >
            {/* ── Plan header ── */}
            <div style={{
              background:"#ffffff",
              border:"1.5px solid #e8e5df",
              borderRadius:"20px 20px 0 0",
              padding:"clamp(18px, 4vw, 26px) clamp(16px, 4vw, 26px) clamp(16px, 4vw, 22px)",
              borderBottom:"none",
              boxShadow:"0 -2px 20px rgba(26,25,23,.04)",
            }}>
              {/* PLAN READY tag + PDF button row */}
              <div style={{
                display:"flex", alignItems:"center",
                justifyContent:"space-between",
                flexWrap:"wrap", gap:10,
                marginBottom:14,
              }}>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:6,
                  padding:"4px 12px", borderRadius:99,
                  background:"#f0fdf4", border:"1.5px solid #86efac",
                }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#16a34a" }} />
                  <span style={{
                    fontFamily:"'Geist Mono',monospace",
                    fontSize:10, fontWeight:700, color:"#15803d",
                    letterSpacing:".08em",
                  }}>PLAN READY</span>
                </div>

                {/* ── PDF Download button ── */}
                <button
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  className="p-btn-pdf"
                  style={{ padding:"8px 16px" }}
                >
                  {pdfLoading ? (
                    <>
                      <div className="p-pdf-spinner" />
                      Preparing PDF…
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download PDF
                    </>
                  )}
                </button>
              </div>

              <h2 className="p-serif" style={{
                fontSize:"clamp(20px,4vw,30px)",
                color:"#1a1917", margin:"0 0 6px",
                lineHeight:1.2, letterSpacing:"-.02em",
              }}>
                Your study plan is ready 🎯
              </h2>
              <p style={{
                fontSize:"clamp(12px,3vw,13px)",
                color:"#8a8680", margin:"0 0 18px", fontWeight:500,
                lineHeight:1.5,
              }}>
                Class {studentClass} · {subjects.join(", ")} · {totalTime}h session
              </p>

              {/* stat pills */}
              <div className="p-plan-stats" style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {[
                  { icon:"📚", val:`${planSessions} session${planSessions !== 1 ? "s" : ""}`, label:"Focus blocks" },
                  { icon:"☕", val:`${planBreaks} break${planBreaks !== 1 ? "s" : ""}`,         label:"Rest time" },
                  { icon:"⏱️", val:`${totalTime}h`,                                             label:"Total time" },
                ].map(s => (
                  <div key={s.label} style={{
                    padding:"8px 14px", borderRadius:10,
                    background:"#f4f3f0", border:"1.5px solid #e8e5df",
                    display:"flex", alignItems:"center", gap:7,
                    flex:"1 1 auto", minWidth:"fit-content",
                  }}>
                    <span style={{ fontSize:13 }}>{s.icon}</span>
                    <div>
                      <p style={{
                        fontFamily:"'Geist Mono',monospace",
                        fontSize:12, fontWeight:700, color:"#1a1917",
                        margin:0, lineHeight:1,
                      }}>{s.val}</p>
                      <p style={{ fontSize:10, color:"#8a8680", margin:"2px 0 0", fontWeight:500 }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Subject legend ── */}
            {uniqueSubjectsInPlan.length > 0 && (
              <div className="p-legend-row" style={{
                background:"#faf9f7",
                border:"1px solid #e8e5df",
                borderTop:"1.5px solid #e8e5df",
                padding:"12px clamp(14px, 4vw, 24px)",
                display:"flex", gap:8, flexWrap:"wrap", alignItems:"center",
              }}>
                <span style={{ fontSize:11, color:"#8a8680", fontWeight:600, letterSpacing:".02em", flexShrink:0 }}>Legend:</span>
                {uniqueSubjectsInPlan.map((sub, i) => {
                  const c = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
                  return (
                    <div key={sub} style={{
                      display:"flex", alignItems:"center", gap:5,
                      padding:"3px 10px", borderRadius:99,
                      background:c.bg, border:`1.5px solid ${c.border}`,
                    }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:c.dot }} />
                      <span style={{ fontSize:11, fontWeight:700, color:c.text }}>{sub}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Timeline ── */}
            <div style={{
              background:"#ffffff",
              border:"1.5px solid #e8e5df",
              borderTop:"1px solid #e8e5df",
              borderRadius:"0 0 20px 20px",
              padding:"clamp(16px, 4vw, 26px) clamp(12px, 4vw, 22px) clamp(20px, 4vw, 30px)",
              boxShadow:"0 8px 30px rgba(26,25,23,.06)",
            }}>
              {showSaved && <SuccessBanner onView={() => navigate("/dashboard")} />}

              <div style={{ position:"relative", paddingLeft:2 }}>
                {/* vertical guide */}
                <div style={{
                  position:"absolute", left:19, top:20, bottom:20, width:1,
                  background:"linear-gradient(to bottom,#e8e5df,transparent)",
                  pointerEvents:"none",
                }} />

                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {plan.plan.map((item, idx) => (
                    <SessionCard
                      key={idx}
                      item={item}
                      idx={idx}
                      colorIdx={uniqueSubjectsInPlan.indexOf(item.subject)}
                    />
                  ))}
                </div>
              </div>

              {/* Note */}
              {plan.note && (
                <div style={{
                  marginTop:24, padding:"14px 18px", borderRadius:14,
                  background:"#fff8ed", border:"1.5px solid #f0d0a0",
                  display:"flex", gap:10, alignItems:"flex-start",
                }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>💡</span>
                  <p style={{
                    fontSize:"clamp(12px, 3vw, 13px)",
                    color:"#92560a", fontWeight:500,
                    margin:0, lineHeight:1.65, fontStyle:"italic",
                  }}>{plan.note}</p>
                </div>
              )}

              {/* Bottom actions */}
              <div className="p-plan-actions" style={{ display:"flex", gap:10, marginTop:20, flexWrap:"wrap" }}>
                <button onClick={() => navigate("/dashboard")}
                  className="p-btn-primary"
                  style={{ padding:"12px 20px", flex:1, minWidth:130 }}>
                  View Dashboard →
                </button>

                {/* PDF button (secondary placement) */}
                <button
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  className="p-btn-pdf"
                  style={{ padding:"12px 20px", flex:1, minWidth:130, justifyContent:"center" }}
                >
                  {pdfLoading ? (
                    <><div className="p-pdf-spinner" /> Preparing…</>
                  ) : (
                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg> Download PDF</>
                  )}
                </button>

                <button onClick={() => { setPlan(""); setSubjects([]); setChapters({}); }}
                  className="p-btn-ghost"
                  style={{ padding:"12px 20px", flex:1, minWidth:130 }}>
                  New Plan
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}