// src/data/math12_test1.js

export const math12Test1 = {
  id: "math12-test1",
  class: "12",
  subject: "Mathematics",
  title: "Class 12 Mathematics — Full Test (40 MCQs)",
  questions: [

    // ---------- RELATIONS, FUNCTIONS, MATRICES (1–10) ----------
    {
      id: 1,
      question:
        "Let R={(a,b): a=b−2, b>6}. The relation R is:",
      options: ["Reflexive", "Symmetric", "Transitive", "None of these"],
      correctIndex: 3,
    },
    {
      id: 2,
      question: "If f(x)=x²−1 and g(x)=2x+1, then (g∘f)(x) is:",
      options: ["4x²+4x", "2x²+1", "2x²−1", "4x²+1"],
      correctIndex: 2,
    },
    {
      id: 3,
      question: "If |adj(A)|=64 for a 3×3 matrix A, then |A| equals:",
      options: ["64", "±8", "16", "±8"],
      correctIndex: 1,
    },
    {
      id: 4,
      question: "If A = [[cosα, sinα], [−sinα, cosα]], then AᵀA equals:",
      options: [
        "[[0,1],[1,0]]",
        "[[1,1],[1,1]]",
        "I₂",
        "A²",
      ],
      correctIndex: 2,
    },
    {
      id: 5,
      question: "If A is nonsingular, then A⁻¹ equals:",
      options: [
        "(1/|A|) A",
        "(1/|A|) adj(A)",
        "|A| adj(A)",
        "adj(A)",
      ],
      correctIndex: 1,
    },
    {
      id: 6,
      question: "If A is a symmetric matrix, then Aᵀ equals:",
      options: ["2A", "-A", "A", "A⁻¹"],
      correctIndex: 2,
    },
    {
      id: 7,
      question: "If [[x,18],[2,x]] = [[6,18],[2,6]], then x equals:",
      options: ["6", "-6", "±36", "±6"],
      correctIndex: 3,
    },
    {
      id: 8,
      question: "Number of 3×3 matrices with entries 0 or 1 is:",
      options: ["3²", "2³", "9", "2⁹"],
      correctIndex: 3,
    },
    {
      id: 9,
      question: "Principal value of cos⁻¹(−1/2) is:",
      options: ["π/3", "−π/3", "2π/3", "3π/2"],
      correctIndex: 2,
    },
    {
      id: 10,
      question: "tan⁻¹(√3) − sec⁻¹(−2) equals:",
      options: ["π", "π/3", "−π/3", "3π"],
      correctIndex: 2,
    },

    // ---------- CALCULUS (11–25) ----------
    {
      id: 11,
      question: "If y=cos(logx), then dy/dx equals:",
      options: [
        "-sin(logx)/x",
        "sin(logx)",
        "x sin(logx)",
        "-x sin(logx)",
      ],
      correctIndex: 0,
    },
    {
      id: 12,
      question: "Maximum value of sinx·cosx is:",
      options: ["1", "√3/2", "1/2", "0"],
      correctIndex: 2,
    },
    {
      id: 13,
      question:
        "Function f(x)=2x³−3x²−12x+1 is increasing on:",
      options: [
        "(-∞, -1)",
        "(2, ∞)",
        "(-∞,-1) ∪ (2,∞)",
        "(-1,2)",
      ],
      correctIndex: 2,
    },
    {
      id: 14,
      question: "∫[sin(x−a)/sinx] dx equals:",
      options: [
        "x cos a + sin a ln|sin(x−a)| + C",
        "x sin a + cos a ln|sin(x−a)| + C",
        "x cos a + sin a log|sin(x−a)| + C",
        "x sin a − cos a ln|sin(x−a)| + C",
      ],
      correctIndex: 0,
    },
    {
      id: 15,
      question: "∫ eˣ(tanx + sec²x) dx equals:",
      options: [
        "eˣ sec²x + C",
        "eˣ tanx sec²x + C",
        "eˣ + C",
        "eˣ tanx + C",
      ],
      correctIndex: 3,
    },
    {
      id: 16,
      question: "Area between y=x² and y=4 equals:",
      options: ["3/8", "3/16", "3/32", "3/32"],
      correctIndex: 2,
    },
    {
      id: 17,
      question: "Degree of (d²y/dx²)³ + (dy/dx)² + sin(dy/dx) +1 = 0 is:",
      options: ["1", "2", "3", "Not defined"],
      correctIndex: 3,
    },
    {
      id: 18,
      question: "Order of x²(d²y/dx²)² − 2y = 0 is:",
      options: ["1", "2", "4", "2"],
      correctIndex: 1,
    },
    {
      id: 19,
      question: "∫₀^{2π} sin²x dx equals:",
      options: ["4π", "2π", "π", "4π"],
      correctIndex: 0,
    },
    {
      id: 20,
      question: "f(x)=|x−1| is:",
      options: [
        "Differentiable at x=1",
        "Continuous but not differentiable at x=1",
        "Neither continuous nor differentiable",
        "Continuous but not differentiable",
      ],
      correctIndex: 1,
    },
    {
      id: 21,
      question: "If y=log(tan(x/2)), dy/dx equals:",
      options: ["cotx", "tanx", "cscx", "secx"],
      correctIndex: 2,
    },
    {
      id: 22,
      question: "Slope of tangent to y=x³−x at x=2 is:",
      options: ["11", "10", "12", "11"],
      correctIndex: 0,
    },
    {
      id: 23,
      question: "∫ dx / √(9−25x²) equals:",
      options: [
        "(1/5) sin⁻¹(5x/3) + C",
        "(1/3) sin⁻¹(3x/5) + C",
        "(1/5) sin⁻¹(3x/5) + C",
        "sin⁻¹(3x/5) + C",
      ],
      correctIndex: 2,
    },
    {
      id: 24,
      question: "DE representing y = A x is:",
      options: [
        "y = x dy/dx",
        "x dy/dx − y = 0",
        "x dy/dx = y",
        "x dy/dx + y = 0",
      ],
      correctIndex: 2,
    },
    {
      id: 25,
      question: "Integrating factor of x dy/dx − y = 2x² is:",
      options: ["x", "1/x", "eˣ", "1/x"],
      correctIndex: 1,
    },

    // ---------- VECTORS, 3D, PROBABILITY (26–40) ----------
    {
      id: 26,
      question: "Projection of a = 2i − j + k on b = i +2j +2k is:",
      options: ["1/6", "3/2", "6/2", "3/2"],
      correctIndex: 1,
    },
    {
      id: 27,
      question:
        "Area of parallelogram with a = i + j and b = j + k:",
      options: ["√2", "1", "√3", "√3"],
      correctIndex: 2,
    },
    {
      id: 28,
      question:
        "Vectors 2i−3j+4k and ai+6j−8k are collinear. Value of a:",
      options: ["−2", "−4", "4", "2"],
      correctIndex: 1,
    },
    {
      id: 29,
      question:
        "Angle between a=i+j and b=i−j is:",
      options: ["0°", "30°", "60°", "90°"],
      correctIndex: 3,
    },
    {
      id: 30,
      question:
        "Distance of plane 2x−3y+4z−6=0 from origin:",
      options: ["6/√29", "√29/6", "6", "√29/6"],
      correctIndex: 3,
    },
    {
      id: 31,
      question: "Direction cosines of x-axis are:",
      options: ["(0,1,0)", "(1,1,1)", "(1,0,0)", "(0,0,1)"],
      correctIndex: 2,
    },
    {
      id: 32,
      question:
        "Angle between planes x+y+z=1 and 2x−y+z=3:",
      options: [
        "π/3",
        "cos⁻¹(√3/2)",
        "cos⁻¹(2/3)",
        "π/6",
      ],
      correctIndex: 1,
    },
    {
      id: 33,
      question: "Equation of plane parallel to XY-plane:",
      options: ["x=k", "y=k", "x+y=k", "z=k"],
      correctIndex: 3,
    },
    {
      id: 34,
      question: "If P(A)=0.8, P(B)=0.5, P(B|A)=0.4, then P(A∩B) is:",
      options: ["0.32", "0.2", "0.4", "0.32"],
      correctIndex: 0,
    },
    {
      id: 35,
      question:
        "If A,B independent, P(A)=0.3, P(B)=0.6, then P(A∪B):",
      options: ["0.9", "0.18", "0.72", "0.42"],
      correctIndex: 2,
    },
    {
      id: 36,
      question:
        "Die thrown: probability that number >4 given even number:",
      options: ["1/6", "1/3", "2/3", "1/3"],
      correctIndex: 1,
    },
    {
      id: 37,
      question: "Expectation E(X) equals:",
      options: ["ΣP(X)", "ΣX", "ΣX P(X)", "ΣX²P(X)"],
      correctIndex: 2,
    },
    {
      id: 38,
      question:
        "Region x+y≤2, x≥0, y≥0 represents:",
      options: ["First quadrant", "Bounded region", "Unbounded", "Line segment"],
      correctIndex: 1,
    },
    {
      id: 39,
      question:
        "Corners: (0,0), (5,0), (3,4), (0,5). Min of Z=3x−4y:",
      options: ["0", "15", "-16", "-20"],
      correctIndex: 3,
    },
    {
      id: 40,
      question:
        "Unit vector parallel to (2i+4j−5k)+(i+2j+3k):",
      options: [
        "(1/7)(3i+6j−2k)",
        "3i+6j−2k",
        "(1/7)(3i+6j−2k)",
        "3i−6j+2k",
      ],
      correctIndex: 0,
    },

  ],
};
