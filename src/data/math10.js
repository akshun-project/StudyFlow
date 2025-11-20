// src/data/math10.js

export const math10 = {
  id: "math10-full",
  class: "10",
  subject: "Mathematics",
  title: "Class 10 Mathematics – Full NCERT Test (40 MCQs)",
  questions: [

    // ---------- REAL NUMBERS ----------
    {
      id: 1,
      question: "The HCF of 42 and 70 using Euclid’s division lemma is:",
      options: ["2", "7", "14", "21"],
      correctIndex: 2,
    },
    {
      id: 2,
      question: "Which of the following is an irrational number?",
      options: ["0.12", "22/7", "√5", "1.25"],
      correctIndex: 2,
    },

    // ---------- POLYNOMIALS ----------
    {
      id: 3,
      question: "If α and β are roots of x² – 5x + 6 = 0, then α + β =",
      options: ["5", "6", "1", "–5"],
      correctIndex: 0,
    },
    {
      id: 4,
      question: "Degree of polynomial 5x³ – 4x² + 7 is:",
      options: ["1", "2", "3", "0"],
      correctIndex: 2,
    },

    // ---------- PAIR OF LINEAR EQUATIONS ----------
    {
      id: 5,
      question: "If two lines intersect at a point, the system is:",
      options: ["Inconsistent", "Consistent and dependent", "Consistent and independent", "None"],
      correctIndex: 2,
    },
    {
      id: 6,
      question: "The pair 2x + 3y = 5 and 4x + 6y = 10 has:",
      options: ["One solution", "Infinite solutions", "No solution", "Two solutions"],
      correctIndex: 1,
    },

    // ---------- QUADRATIC EQUATIONS ----------
    {
      id: 7,
      question: "Roots of x² – 4 = 0 are:",
      options: ["±4", "±2", "4, –1", "0, 4"],
      correctIndex: 1,
    },
    {
      id: 8,
      question: "A quadratic equation has equal roots when:",
      options: ["b² – 4ac > 0", "b² – 4ac = 0", "b² – 4ac < 0", "a = 0"],
      correctIndex: 1,
    },

    // ---------- ARITHMETIC PROGRESSIONS ----------
    {
      id: 9,
      question: "The nth term of the AP 3, 7, 11, 15,... is:",
      options: ["4n + 3", "4n – 1", "3n + 4", "7n – 3"],
      correctIndex: 1,
    },
    {
      id: 10,
      question: "Sum of first 10 terms of AP 2, 4, 6,... is:",
      options: ["50", "110", "60", "100"],
      correctIndex: 3,
    },

    // ---------- TRIANGLES ----------
    {
      id: 11,
      question: "Two triangles are similar if:",
      options: ["Only one angle is equal", "All sides unequal", "Their corresponding angles are equal", "None"],
      correctIndex: 2,
    },
    {
      id: 12,
      question: "In similar triangles, ratio of areas is equal to:",
      options: ["Ratio of sides", "Square of ratio of sides", "Cube of ratio", "Twice the ratio"],
      correctIndex: 1,
    },

    // ---------- CIRCLES ----------
    {
      id: 13,
      question: "A tangent to a circle intersects it at:",
      options: ["One point", "Two points", "Three points", "No point"],
      correctIndex: 0,
    },
    {
      id: 14,
      question: "Angle between radius and tangent is:",
      options: ["0°", "45°", "60°", "90°"],
      correctIndex: 3,
    },

    // ---------- COORDINATE GEOMETRY ----------
    {
      id: 15,
      question: "Distance between (3, 4) and (6, 8) is:",
      options: ["5", "4", "6", "3"],
      correctIndex: 0,
    },
    {
      id: 16,
      question: "Midpoint of (2, 3) and (6, 7) is:",
      options: ["(4,5)", "(3,4)", "(5,4)", "(4,4)"],
      correctIndex: 0,
    },

    // ---------- MENSURATION (AREAS) ----------
    {
      id: 17,
      question: "Area of triangle with base 10 cm and height 8 cm:",
      options: ["40 cm²", "80 cm²", "20 cm²", "60 cm²"],
      correctIndex: 0,
    },
    {
      id: 18,
      question: "Area of circle with radius 7 cm:",
      options: ["49π", "14π", "7π", "21π"],
      correctIndex: 0,
    },

    // ---------- SURFACE AREAS & VOLUMES ----------
    {
      id: 19,
      question: "Volume of a cuboid =",
      options: ["2lb + bh", "l × b × h", "lb + h", "l² + b² + h²"],
      correctIndex: 1,
    },
    {
      id: 20,
      question: "Volume of cylinder with radius r and height h:",
      options: ["πrh²", "πr²h", "2πrh", "πr²h²"],
      correctIndex: 1,
    },

    // ---------- TRIGONOMETRY ----------
    {
      id: 21,
      question: "tan 45° equals:",
      options: ["0", "1", "√3", "1/√3"],
      correctIndex: 1,
    },
    {
      id: 22,
      question: "sin²θ + cos²θ equals:",
      options: ["1", "0", "2", "sinθ"],
      correctIndex: 0,
    },
    {
      id: 23,
      question: "Value of sin 0° is:",
      options: ["1", "0", "1/2", "√3/2"],
      correctIndex: 1,
    },
    {
      id: 24,
      question: "In right triangle, tanθ =",
      options: ["Opp/Hyp", "Hyp/Opp", "Opp/Adj", "Adj/Opp"],
      correctIndex: 2,
    },

    // ---------- APPLICATIONS OF TRIGONOMETRY ----------
    {
      id: 25,
      question: "Height of a tree can be found using:",
      options: ["Algebra", "Mensuration", "Trigonometry", "AP only"],
      correctIndex: 2,
    },
    {
      id: 26,
      question: "Angle of elevation means:",
      options: ["Eye looking down", "Eye looking up", "Angle from ground", "None"],
      correctIndex: 1,
    },

    // ---------- STATISTICS ----------
    {
      id: 27,
      question: "Mean of 2, 4, 6, 8 is:",
      options: ["6", "4", "5", "10"],
      correctIndex: 1,
    },
    {
      id: 28,
      question: "Median of 3, 5, 7, 9, 11:",
      options: ["9", "5", "7", "6"],
      correctIndex: 2,
    },
    {
      id: 29,
      question: "Mode of 4, 2, 4, 5, 6, 4, 8 is:",
      options: ["4", "2", "5", "6"],
      correctIndex: 0,
    },
    {
      id: 30,
      question: "Which averages can be more than one?",
      options: ["Mean", "Median", "Mode", "None"],
      correctIndex: 2,
    },

    // ---------- PROBABILITY ----------
    {
      id: 31,
      question: "Probability of getting head when tossing a coin:",
      options: ["1/4", "1/2", "1/6", "2/3"],
      correctIndex: 1,
    },
    {
      id: 32,
      question: "Probability of getting 7 on a die:",
      options: ["1/6", "0", "1/7", "1"],
      correctIndex: 1,
    },
    {
      id: 33,
      question: "Probability always lies between:",
      options: ["0 and 10", "–1 and 1", "0 and 1", "1 and 2"],
      correctIndex: 2,
    },

    // ---------- IMPORTANT MIXED ----------
    {
      id: 34,
      question: "Sum of angles of triangle:",
      options: ["180°", "90°", "360°", "270°"],
      correctIndex: 0,
    },
    {
      id: 35,
      question: "Slope of a vertical line is:",
      options: ["0", "1", "Undefined", "∞"],
      correctIndex: 2,
    },
    {
      id: 36,
      question: "Roots of x² + 5x + 6 = 0 are:",
      options: ["–2, –3", "2, 3", "1, –6", "3, –2"],
      correctIndex: 0,
    },
    {
      id: 37,
      question: "In AP, if a = 5, d = 2, nth term is:",
      options: ["5 + 2n", "5 + (n – 1)2", "5n + 2", "n + 10"],
      correctIndex: 1,
    },
    {
      id: 38,
      question: "Area of sector =",
      options: ["θ/360 × πr²", "πr² × 360/θ", "2πrθ", "πrθ²"],
      correctIndex: 0,
    },
    {
      id: 39,
      question: "Which is a quadratic equation?",
      options: ["x + 5 = 0", "x² – 3x + 2 = 0", "3x = 7", "5x³ + 1 = 0"],
      correctIndex: 1,
    },
    {
      id: 40,
      question: "Volume of cone =",
      options: ["πr²h", "1/2 πr²h", "1/3 πr²h", "2πrh"],
      correctIndex: 2,
    },

  ],
};
