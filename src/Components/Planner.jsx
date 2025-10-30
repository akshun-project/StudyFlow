 import { useState } from "react";
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
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");

  // Data for each class
  const classData = {
    10: {
      subjects: ["Math", "Physics", "Chemistry", "Biology", "English" , "History" , "Geography" , "PoliticalScience" , "Economics"],
      chapters: {
        Math: [
          "Real Numbers",
          "Polynomials",
          "Pair of Linear Equations",
          "Quadratic Equations",
          "Arithmetic Progressions",
          "Triangles",
          "Coordinate Geometry",
          "Introduction to Trigonometry",
          "Circles",
          "Areas Related to Circles",
          "Surface Areas and Volumes",
          "Statistics",
          "Probability",
        ],
        Physics: [
          "Light - Reflection and Refraction",
          "Human Eye and the Colourful World",
          "Electricity",
          "Magnetic Effects of Electric Current",
          "Sources of Energy",
          "Environment",
        ],
        Chemistry: [
          "Chemical Reactions and Equations",
          "Acids, Bases and Salts",
          "Metals and Non-metals",
          "Carbon and Its Compounds",
        ],
        Biology: [
          "Life Process",
          "Control and Coordination",
          "Reproduction",
          "Heredity",
          "Our Environment",
        ],
             English: [   "A Letter to God",
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
  "Bholi"
],

   History: [
    "The Rise of Nationalism in Europe",
    "Nationalism in India",
    "The Making of a Global World",
    "The Age of Industrialization",
    "Print Culture and the Modern World"
  ],

  Geography: [
    "Resources and Development",
    "Forest and Wildlife Resources",
    "Water Resources",
    "Agriculture",
    "Minerals and Energy Resources",
    "Manufacturing Industries",
    "Lifelines of National Economy"
  ],

    PoliticalScience: [
    "Power Sharing",
    "Federalism",
    "Gender, Religion and Caste",
    "Political Parties",
    "Outcomes of Democracy"
  ],

  
  Economics: [
    "Development",
    "Sectors of the Indian Economy",
    "Money and Credit",
    "Globalisation and the Indian Economy",
    "Consumer Rights"
  ]
      },
    },
    11: {
      subjects: ["Math", "Physics", "Chemistry", "Botany", "Zoology" , "Genetics" , "Economics"],
      chapters: {
         Math: [   "Sets",
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
    "Probability"],
        
        Physics: [ "Physical World",
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
    "Waves"],
       
            Chemistry: [  "Some Basic Concepts of Chemistry",
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
    "Plant Growth and Development"
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
    "Chemical Coordination and Integration"
  ],

  
  Genetics: [
    // --- Cell Biology and Biomolecules ---
    "Cell: The Unit of Life",
    "Biomolecules",
    "Cell Cycle and Cell Division"
  ] , 
        Economics: [
    "Introduction to Microeconomics",
    "Consumer's Equilibrium and Demand",
    "Producer Behaviour and Supply",
    "Forms of Market and Price Determination under Perfect Competition with Simple Applications",
    "Introduction to Statistics for Economics",
    "Collection, Organisation and Presentation of Data",
    "Statistical Tools and Interpretation"
]

      },
    },
    12: {
      subjects: ["Math", "Physics", "Chemistry", "Botany", "Zoology" , " GeneticsAndEvolution" ,  "English" ],
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
    "Probability"
  ] , 
        Physics: [
    // --- Electrostatics & Current Electricity ---
    "Electrostatics",
    "Electric Potential and Capacitance",
    "Current Electricity",
    "Moving Charges and Magnetism",
    "Magnetism and Matter",
    "Electromagnetic Induction",
    "Alternating Currents",
    "Ray Optics" , 
    "Wave Optics",
    "Dual Nature of Matter and Radiation",
    "Atoms",
    "Nuclei",
    "Semiconductor"
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
    "Biomolecules"
  ],
        Botany: [
    "Reproduction in Plants",
    "Plant Growth and Development",
    "Photosynthesis",
    "Respiration in Plants",
    "Transport in Plants",
    "Mineral Nutrition",
    "Plant Hormones"
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
    "Breathing and Exchange of Gases"
  ],

   GeneticsAndEvolution: [
    "DNA Replication and Recombination",
    "Structure of Gene and Chromosomes",
    "Mendelian Inheritance",
    "Molecular Genetics",
    "Evolution",
    "Human Genetics and Biotechnology",
    "Biotechnology Principles and Processes",
    "Biotechnology and Its Applications"
  ],
        English: ["The Last Lesson",
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
  "Evans Tries an O-Level"],
      },
    },
  };

  // Subject toggle
  const handleSubjectChange = (subject) => {
    if (subjects.includes(subject)) {
      setSubjects(subjects.filter((s) => s !== subject));
      const newChapters = { ...chapters };
      delete newChapters[subject];
      setChapters(newChapters);
    } else if (subjects.length < 3) {
      setSubjects([...subjects, subject]);
    }
  };

  const handleChapterChange = (subject, chapter) => {
    setChapters({ ...chapters, [subject]: chapter });
  };

  // Generate & Save Study Plan
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentClass || subjects.length === 0 || !totalTime) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    setPlan("");
    setError("");

    try {
      const prompt = `
You are a helpful study planner assistant.
Create a **well-structured, visually clear study plan** for a Class ${studentClass} student.

Subjects: ${subjects.join(", ")}.
Chapters: ${subjects
        .map((s) => `${s}: ${chapters[s] || "all chapters"}`)
        .join(", ")}.
Total study time: ${totalTime} hours.
Start time: ${startTime || "9:00 AM"}.

Output format:
Return as JSON:
{
  "plan": [
    { "time": "9:00 AM - 9:45 AM", "subject": "Math", "chapter": "Polynomials", "activity": "Understand formulas 🔢" },
    { "time": "9:45 AM - 10:30 AM", "subject": "Physics", "chapter": "Electricity", "activity": "Solve examples ⚡" }
  ],
  "note": "Keep short breaks between sessions 🍎"
}`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let text =
        response.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        response?.text ||
        "";

      if (!text.trim()) throw new Error("Empty response from Gemini");

      text = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      setPlan(parsed);

      // ✅ Save to Supabase
      if (user && parsed.plan) {
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
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">📘 Smart Study Planner</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md flex flex-col gap-6"
      >
        {/* Class select */}
        <div>
          <label className="font-medium mb-2 block">Select Class</label>
          <select
            className="border p-2 rounded-md w-full"
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

        {/* Subjects */}
        {studentClass && (
          <div>
            <label className="font-medium mb-2 block">Select up to 3 Subjects</label>
            <div className="flex flex-wrap gap-2">
              {classData[studentClass].subjects.map((subject) => (
                <button
                  type="button"
                  key={subject}
                  onClick={() => handleSubjectChange(subject)}
                  className={`px-4 py-2 rounded-md border transition ${subjects.includes(subject)
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-800"
                    }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chapters */}
        {subjects.map((subject) => (
          <div key={subject}>
            <label className="font-semibold">{subject} Chapter</label>
            <select
              className="border p-2 rounded-md w-full mt-1"
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

        {/* Time input */}
        {subjects.length > 0 && (
          <>
            <div>
              <label className="font-medium mb-2 block">Total Study Time (hours)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={totalTime}
                onChange={(e) => setTotalTime(e.target.value)}
                placeholder="Enter total hours"
                className="border p-2 rounded-md w-full"
              />
            </div>

            <div>
              <label className="font-medium mb-2 block">Start Time (optional)</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border p-2 rounded-md w-full"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Study Plan"}
        </button>
      </form>

      {/* Output */}
      {loading && <p className="mt-4 text-indigo-600 animate-pulse">🧠 Creating your plan...</p>}
      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      {plan && plan.plan && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">📅 Your Study Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="p-3 border">Time</th>
                  <th className="p-3 border">Subject</th>
                  <th className="p-3 border">Chapter</th>
                  <th className="p-3 border">Activity</th>
                </tr>
              </thead>
              <tbody>
                {plan.plan.map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 border">{p.time}</td>
                    <td className="p-3 border">{p.subject}</td>
                    <td className="p-3 border">{p.chapter}</td>
                    <td className="p-3 border">{p.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-gray-600">{plan.note}</p>
        </div>
      )}
    </div>
   
  );
}
