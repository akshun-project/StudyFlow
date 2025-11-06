import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import client from "../geminiClient/gemini";
import { supabase } from "../Supabase/supabaseClient";

export default function Planner() {
  const { user } = useUser();
  const [studentClass, setStudentClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState({});
  const [totalTime, setTotalTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [coins, setCoins] = useState(0);

  // Messages that appear while Gemini thinks
  const messages = [
    "Analyzing your selected subjects...",
    "Designing a balanced time schedule...",
    "Optimizing focus sessions and breaks...",
    "Finalizing your personalized plan...",
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % messages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleDurationChange = (e) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) return setTotalTime("");
    value = Math.round(value * 2) / 2;
    if (value < 0.5) value = 0.5;
    if (value > 8) value = 8;
    setTotalTime(value);
  };

  const handleSubjectChange = (subject) => {
    if (subjects.includes(subject)) {
      const updated = subjects.filter((s) => s !== subject);
      const newChapters = { ...chapters };
      delete newChapters[subject];
      setSubjects(updated);
      setChapters(newChapters);
    } else if (subjects.length < 3) {
      setSubjects([...subjects, subject]);
    }
  };

  const handleChapterChange = (subject, chapter) => {
    setChapters({ ...chapters, [subject]: chapter });
  };

  // ✅ Generate & Save Study Plan — Optimized for Gemini 2.5 Flash
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentClass || subjects.length === 0 || !totalTime) {
      alert("Looks like a few details are missing — mind checking again?");
      return;
    }

    for (const subject of subjects) {
      if (!chapters[subject] || chapters[subject].trim() === "") {
        alert(`Please select a chapter for ${subject}`);
        return;
      }
    }

    setLoading(true);
    setPlan("");
    setError("");

    try {
      const prompt = `
You are StudyFlow — an expert study planner for students.
Generate a personalized, clear study plan ONLY in valid JSON format.

Details:
- Class: ${studentClass}
- Subjects: ${subjects.join(", ")}
- Chapters: ${subjects
        .map((s) => `${s}: ${chapters[s] || "all chapters"}`)
        .join(", ")}
- Total Study Time: ${totalTime} hours
- Start Time: ${startTime || "9:00 AM"}

Guidelines:
- Divide total time evenly across subjects.
- Each session lasts 30–60 minutes.
- Include small 5–10 minute breaks.
- Focus on a mix of understanding, revision, and practice.
- Keep it motivating but concise.

Respond strictly as JSON:
{
  "plan": [
    { "time": "9:00 AM - 9:45 AM", "subject": "Math", "chapter": "Polynomials", "activity": "Understand formulas" }
  ],
  "note": "Stay consistent and take small breaks between topics."
}`;

      // ✅ Gemini call (JSON Mode if available)
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json", // Gemini auto-formats output as JSON
        },
      });

      let text =
        response.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        response?.text ||
        "";

      // ✅ Backup cleanup in case model returns markdown or text
      text = text.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        console.warn("JSON parse error — using fallback handler");
        setError("We couldn’t format your plan properly. Please try again.");
        return;
      }

      if (!parsed.plan || !Array.isArray(parsed.plan)) {
        setError("Invalid response from AI. Try again in a moment.");
        return;
      }

      setPlan(parsed);

      // ✅ Save to Supabase
      if (user) {
        const { error: dbError } = await supabase.from("planner_data").insert([
          {
            user_id: user.id,
            class: studentClass,
            subjects,
            chapters,
            total_time: totalTime,
            schedule: JSON.stringify(parsed.plan),
            created_at: new Date(),
          },
        ]);

        if (dbError) console.error("Supabase insert error:", dbError);
      }

      // ✅ Smooth "saved" feedback (new UX moment)
      setTimeout(() => {
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 8000); // stays for 10 seconds
      }, 800);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError(
        "Something went wrong while generating your plan. Please retry."
      );
    } finally {
      setLoading(false);
    }
  };

  // Example class data (you can plug back your full data here)
  const classData = {
    10: {
      subjects: [
        "Math",
        "Physics",
        "Chemistry",
        "Biology",
        "English",
        "History",
        "Geography",
        "PoliticalScience",
        "Economics",
      ],
      chapters: {
        Math: [
          "Chapter 1: Real Numbers",
          "Chapter 2: Polynomials",
          "Chapter 3: Pair Of Linear Equations In Two Variables",
          "Chapter 4: Quadratic Equations",
          "Chapter 5: Arithmetic Progressions",
          "Chapter 6: Triangles",
          "Chapter 7: Coordinate Geometry",
          "Chapter 8: Introduction To Trigonometry",
          "Chapter 9: Some Applications Of Trigonometry",
          "Chapter 10: Circles",
          "Chapter 11: Areas Related To Circles",
          "Chapter 12: Surface Areas And Volumes",
          "Chapter 13: Statistics",
          "Chapter 14: Probability",
        ],
        Physics: [
          "CHAPTER 1: Light-Reflection and Refraction",
          "CHAPTER 2:The Human Eye And The Colourful World",
          "CHAPTER 3:Electricity",
          "CHAPTER 4: Magnetic Effects Of Electric Current",
          "CHAPTER 5: Sources Of Energy",
          "CHAPTER 6: Our Environment",
        ],
        Chemistry: [
          "Chapter 1: Chemical Reactions and Equations",
          "Chapter 2: Acids, Bases and Salts",
          "Chapter 3: Metals and Non-metals",
          "Chapter 4: Carbon and its Compounds",
        ],
        Biology: [
          "Chapter 1: Life Process",
          "Chapter 2: Control and Coordination",
          "Chapter 3: Reproduction",
          "Chapter 4: Heredity",
          "Chapter 5: Our Environment",
        ],

        English: [
          "A Letter to God",
          "Nelson Mandela: Long Walk to Freedom",
          "From the Diary of Anne Frank",
          "The Hundred Dresses – I & II",
          "Mijbil the Otter",
          "Madam Rides the Bus",
          "The Sermon at Benares",
          "The Proposal",
          "Dust of Snow",
          "Fire and Ice",
          "A Tiger in the Zoo",
          "How to Tell Wild Animals",
          "The Ball Poem",
          "A Triumph of Surgery",
          "The Midnight Visitor",
          "The Thief’s Story",
          "Bholi",
        ],

        History: [
          "The Rise of Nationalism in Europe",
          "Nationalism in India",
          "The Making of a Global World",
          "The Age of Industrialization",
          "Print Culture and the Modern World",
        ],

        Geography: [
          "Resources and Development",
          "Forest and Wildlife Resources",
          "Water Resources",
          "Agriculture",
          "Minerals and Energy Resources",
          "Manufacturing Industries",
          "Lifelines of National Economy",
        ],

        PoliticalScience: [
          "Power Sharing",
          "Federalism",
          "Gender, Religion and Caste",
          "Political Parties",
          "Outcomes of Democracy",
        ],

        Economics: [
          "Development",
          "Sectors of the Indian Economy",
          "Money and Credit",
          "Globalisation and the Indian Economy",
          "Consumer Rights",
        ],
      },
    },
    11: {
      subjects: [
        "Math",
        "Physics",
        "Chemistry",
        "Botany",
        "Zoology",
        "Genetics",
        "Economics",
      ],
      chapters: {
        Math: [
          "Sets",
          "Relations and Functions",
          "Trigonometric Functions",
          "Complex Numbers",
          "Linear Inequalities",
          "Permutations and Combinations",
          "Binomial Theorem",
          "Sequence and Series",
          "Straight Lines",
          "Conic Sections",
          "Introduction to Three Dimensional Geometry",
          "Limits and Derivatives",
          "Statistics",
          "Probability",
        ],

        Physics: [
          "Physical World",
          "Units and Measurements",
          "Motion in a Straight Line",
          "Motion in a Plane",
          "Laws of Motion",
          "Work, Energy and Power",
          "System of Particles and Rotational Motion",
          "Gravitation",
          "Mechanical Properties of Solids",
          "Mechanical Properties of Fluids",
          "Thermal Properties of Matter",
          "Thermodynamics",
          "Kinetic Theory",
          "Oscillations",
          "Waves",
        ],

        Chemistry: [
          "Some Basic Concepts of Chemistry",
          "Structure of Atom",
          "Classification of Elements",
          "Chemical Bonding",
          "Thermodynamics",
          "Equilibrium",
          "Redox Reactions",
          "General organic chemistry (GOC)",
          "Hydrocarbons",
        ],
        Botany: [
          "The Living World",
          "Biological Classification",
          "Plant Kingdom",
          "Morphology of Flowering Plants",
          "Anatomy of Flowering Plants",
          "Transport in Plants",
          "Mineral Nutrition",
          "Photosynthesis in Higher Plants",
          "Respiration in Plants",
          "Plant Growth and Development",
        ],

        Zoology: [
          "Animal Kingdom",
          "Structural Organisation in Animals",
          "Digestion and Absorption",
          "Breathing and Exchange of Gases",
          "Body Fluids and Circulation",
          "Excretory Products and Their Elimination",
          "Locomotion and Movement",
          "Neural Control and Coordination",
          "Chemical Coordination and Integration",
        ],

        Genetics: [
          // --- Cell Biology and Biomolecules ---
          "Cell: The Unit of Life",
          "Biomolecules",
          "Cell Cycle and Cell Division",
        ],
        Economics: [
          "Introduction to Microeconomics",
          "Consumer's Equilibrium and Demand",
          "Producer Behaviour and Supply",
          "Forms of Market and Price Determination under Perfect Competition with Simple Applications",
          "Introduction to Statistics for Economics",
          "Collection, Organisation and Presentation of Data",
          "Statistical Tools and Interpretation",
        ],
      },
    },
    12: {
      subjects: [
        "Math",
        "Physics",
        "Chemistry",
        "Botany",
        "Zoology",
        "GeneticsAndEvolution",
        "English",
      ],
      chapters: {
        Math: [
          "Relations and Functions",
          "Inverse Trigonometric Functions",
          "Matrices",
          "Determinants",
          "Continuity and Differentiability",
          "Application of Derivatives",
          "Integration",
          "Application of Integral",
          "Differential Equations",
          "Vector Algebra",
          "Three Dimensional Geometry",
          "Linear Programming",
          "Probability",
        ],
        Physics: [
          // --- Electrostatics & Current Electricity ---
          "Electrostatics",
          "Electric Potential and Capacitance",
          "Current Electricity",
          "Moving Charges and Magnetism",
          "Magnetism and Matter",
          "Electromagnetic Induction",
          "Alternating Currents",
          "Ray Optics",
          "Wave Optics",
          "Dual Nature of Matter and Radiation",
          "Atoms",
          "Nuclei",
          "Semiconductor",
        ],

        Chemistry: [
          "Solutions",
          "Electrochemistry",
          "Chemical Kinetics",
          "The d-Block Elements",
          "The Organic Chemistry - Some Basic Principles",
          "Hydrocarbons",
          "Alcohols, Phenols and Ethers",
          "The Chemistry of Aldehydes, Ketones and Carboxylic Acids",
          "Amines",
          "Biomolecules",
        ],
        Botany: [
          "Reproduction in Plants",
          "Plant Growth and Development",
          "Photosynthesis",
          "Respiration in Plants",
          "Transport in Plants",
          "Mineral Nutrition",
          "Plant Hormones",
        ],

        Zoology: [
          "Human Reproduction",
          "Reproductive Health",
          "Human Development",
          "Blood and Circulation",
          "Excretory Products and Their Elimination",
          "Muscle and Movement",
          "Neural Control and Coordination",
          "Chemical Coordination and Integration",
          "Locomotion and Movement",
          "Respiration in Humans",
          "Digestion and Absorption",
          "Breathing and Exchange of Gases",
        ],

        GeneticsAndEvolution: [
          "DNA Replication and Recombination",
          "Structure of Gene and Chromosomes",
          "Mendelian Inheritance",
          "Molecular Genetics",
          "Evolution",
          "Human Genetics and Biotechnology",
          "Biotechnology Principles and Processes",
          "Biotechnology and Its Applications",
        ],
        English: [
          "The Last Lesson",
          "Lost Spring",
          "Deep Water",
          "The Rattrap",
          "Indigo",
          "Poets and Pancakes",
          "The Interview",
          "Going Places",
          "My Mother at Sixty-Six",
          "An Elementary School Classroom in a Slum",
          "Keeping Quiet",
          "A Thing of Beauty",
          "A Roadside Stand",
          "Aunt Jennifer's Tigers",
          "The Third Level",
          "The Tiger King",
          "Journey to the End of the Earth",
          "The Enemy",
          "Should Wizard Hit Mommy?",
          "On the Face of It",
          "Evans Tries an O-Level",
        ],
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-50 via-white to-white flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-indigo-700">
        📘 Smart Study Planner
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Create your personalized study plan now.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border border-indigo-100 p-8 rounded-2xl shadow-md flex flex-col gap-6"
      >
        {/* Select Class */}
        <div>
          <label className="font-medium mb-2 block text-gray-700">
            Select Class
          </label>
          <select
            className="border border-gray-300 focus:border-indigo-500 outline-none p-2 rounded-md w-full"
            value={studentClass}
            onChange={(e) => {
              setStudentClass(e.target.value);
              setSubjects([]);
              setChapters({});
            }}
          >
            <option value="">Choose your class</option>
            {Object.keys(classData).map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Selection */}
        {studentClass && (
          <div>
            <label className="font-medium mb-2 block text-gray-700">
              Select up to 3 Subjects
            </label>
            <div className="flex flex-wrap gap-2">
              {classData[studentClass].subjects.map((subject) => (
                <button
                  type="button"
                  key={subject}
                  onClick={() => handleSubjectChange(subject)}
                  className={`px-4 py-2 rounded-md border transition-all duration-300 ${
                    subjects.includes(subject)
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow"
                      : "bg-white text-gray-700 hover:bg-indigo-50"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chapter Selection */}
        {subjects.map((subject) => (
          <div key={subject}>
            <label className="font-semibold text-gray-700">
              {subject} Chapter
            </label>
            <select
              className="border border-gray-300 focus:border-indigo-500 outline-none p-2 rounded-md w-full mt-1"
              value={chapters[subject] || ""}
              onChange={(e) => handleChapterChange(subject, e.target.value)}
            >
              <option value="">Select Chapter</option>
              {classData[studentClass].chapters[subject].map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Time Inputs */}
        {subjects.length > 0 && (
          <>
            <div>
              <label className="font-medium mb-2 block text-gray-700">
                Total Study Time (max 8 hrs)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={totalTime}
                onChange={handleDurationChange}
                placeholder="Enter total hours"
                className="border border-gray-300 focus:border-indigo-500 outline-none p-2 rounded-md w-full"
              />
            </div>

            <div>
              <label className="font-medium mb-2 block text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border border-gray-300 focus:border-indigo-500 outline-none p-2 rounded-md w-full"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Preparing..." : "Generate Study Plan"}
        </button>
      </form>

      {/* Loading UI */}
      {loading && (
        <div className="mt-10 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-14 h-14 border-[3px] border-indigo-100 border-t-indigo-500 rounded-full animate-spin-slow"></div>
          <p className="text-indigo-700 font-medium tracking-tight animate-fade">
            {messages[loadingStep]}
          </p>
          <p className="text-gray-500 text-sm">
            This usually takes around 5–10 seconds.
          </p>
        </div>
      )}

      {/* Error */}
      {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}

      {/* Saved Confirmation */}
      {showSaved && (
        <div className="mt-8 animate-fadeIn bg-green-50 border border-green-200 text-green-800 px-5 py-3 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            ✅ Your study plan has been saved to your{" "}
            <span className="font-semibold text-green-700">Dashboard</span>.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="text-sm font-medium text-green-700 hover:underline"
          >
            View Dashboard →
          </button>
        </div>
      )}

      {/* Plan Output */}
      {plan && plan.plan && (
        <div className="animate-fadeIn mt-10 bg-white/90 backdrop-blur-md border border-indigo-100 p-6 rounded-2xl shadow-lg w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-indigo-700 flex items-center gap-2">
            🎯 Your Study Plan is Ready!
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Here’s a personalized schedule crafted just for you.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-indigo-50/40">
                  <th className="p-3 border">Time</th>
                  <th className="p-3 border">Subject</th>
                  <th className="p-3 border">Chapter</th>
                  <th className="p-3 border">Activity</th>
                </tr>
              </thead>
              <tbody>
                {plan.plan.map((p, idx) => (
                  <tr
                    key={idx}
                    className="odd:bg-white even:bg-indigo-50/20 hover:bg-indigo-50 transition"
                  >
                    <td className="p-3 border">{p.time}</td>
                    <td className="p-3 border font-medium text-indigo-700">
                      {p.subject}
                    </td>
                    <td className="p-3 border">{p.chapter}</td>
                    <td className="p-3 border">{p.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-gray-600 text-sm text-center">{plan.note}</p>
        </div>
      )}
    </div>
  );
}
