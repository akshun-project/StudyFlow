 import { useEffect, useRef, useState } from "react";
import { User, ArrowRight, BookOpen, Check } from "lucide-react";

export default function StudentNameModal({
  open,
  onContinue,
}) {
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  if (!open) return null;

  const handleContinue = () => {
    const trimmed = name.trim();

    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }

    setError("");

    onContinue(trimmed, remember);

    setName("");
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-5 animate-in fade-in duration-200">

      <div className="w-full max-w-md rounded-3xl bg-white shadow-[0_25px_80px_rgba(0,0,0,0.35)] overflow-hidden border border-gray-200">

        {/* Top */}

        <div className="px-7 pt-7">

          <div className="flex items-center gap-4">

            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">

              <BookOpen className="h-6 w-6 text-white" />

            </div>

            <div>

              <p className="text-xs uppercase tracking-widest text-violet-600 font-bold">
                StudyFlow
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                Welcome 👋
              </h2>

            </div>

          </div>

          <p className="mt-5 text-gray-500 leading-relaxed text-[15px]">
            Before starting your board practice, tell us your name. 
           Your name will appear on your test report.
          </p>

        </div>

        {/* Body */}

        <div className="px-7 pt-7 pb-7">

          <label className="text-sm font-semibold text-gray-700">
            Your Name
          </label>

          <div className="mt-2 relative">

            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              ref={inputRef}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleContinue();
              }}
              placeholder="e.g. Rahul Sharma"
              className="w-full rounded-2xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-[15px] font-medium text-gray-900 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />

          </div>

          {error && (
            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Remember */}

          <button
            onClick={() => setRemember(!remember)}
            className="mt-5 flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 transition"
          >

             

          </button>

          {/* Button */}

          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="group mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-100 disabled:cursor-not-allowed disabled:opacity-50"
          >

            Start Board Test

            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />

          </button>

          {/* Footer */}

          <div className="mt-6 border-t pt-5">

            <p className="text-center text-xs leading-relaxed text-gray-500">
              Your name is only used to identify your test reports.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}