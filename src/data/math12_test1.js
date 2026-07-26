// src/data/math12_test1.js

export const math12Test1 = {
  id: "math12-test1",
  class: "12",
  subject: "Mathematics",
  title: "Class 12 Mathematics — Full Test (40 MCQs)",

  questions: [
        {
      id: 1,
      question: "The principal value of sin⁻¹(sin(2π/3)) is:",
      options: ["2π/3", "π/3", "-π/3", "4π/3"],
      correctIndex: 1,
    },

    {
      id: 2,
      question: "The range of the function cosec⁻¹x is:",
      options: [
        "[-π/2, π/2]",
        "[-π/2, π/2] − {0}",
        "(0, π)",
        "[0, π] − {π/2}",
      ],
      correctIndex: 1,
    },

    {
      id: 3,
      question: "The value of tan⁻¹(√3) − cot⁻¹(−√3) is:",
      options: ["π", "π/2", "-π/2", "π/3"],
      correctIndex: 2,
    },

    {
      id: 4,
      question: "The domain of cos⁻¹(2x − 1) is:",
      options: ["[0,1]", "[-1,1]", "(-1,1)", "[0,π]"],
      correctIndex: 0,
    },

    {
      id: 5,
      question: "The value of sin[π/3 − sin⁻¹(−1/2)] is:",
      options: ["1/2", "√3/2", "0", "1"],
      correctIndex: 3,
    },

    {
      id: 6,
      question:
        "If tan⁻¹x + tan⁻¹y = 4π/5, then cot⁻¹x + cot⁻¹y equals:",
      options: ["π/5", "2π/5", "3π/5", "π"],
      correctIndex: 0,
    },

    {
      id: 7,
      question:
        "The simplest form of tan⁻¹[(cos x)/(1 − sin x)] for −π/2 < x < π/2 is:",
      options: [
        "x/2",
        "π/4 − x/2",
        "π/4 + x/2",
        "π/4 − x",
      ],
      correctIndex: 2,
    },

    {
      id: 8,
      question: "If 3sin⁻¹x = π, then x is:",
      options: ["1/2", "√3/2", "1", "1/√2"],
      correctIndex: 1,
    },

    {
      id: 9,
      question: "The value of tan[(1/2)cos⁻¹(2/3)] is:",
      options: ["√5", "√5/5", "1/√5", "√(5/13)"],
      correctIndex: 2,
    },

    {
      id: 10,
      question: "The value of cos⁻¹(cos(7π/6)) is:",
      options: ["7π/6", "5π/6", "π/6", "-π/6"],
      correctIndex: 1,
    },

    {
      id: 11,
      question:
        "If f(x) = {kcosx/(π−2x), x ≠ π/2 and 3, x = π/2} is continuous at x = π/2, then k is:",
      options: ["3", "6", "12", "3/2"],
      correctIndex: 1,
    },

    {
      id: 12,
      question: "The derivative of log(sin x) with respect to x is:",
      options: ["tan x", "cot x", "sec x", "cosec x"],
      correctIndex: 1,
    },

    {
      id: 13,
      question: "The function f(x) = |x − 1| is:",
      options: [
        "Continuous and differentiable at x = 1",
        "Continuous but not differentiable at x = 1",
        "Neither continuous nor differentiable at x = 1",
        "Differentiable but not continuous at x = 1",
      ],
      correctIndex: 1,
    },

    {
      id: 14,
      question:
        "If x = a cosθ and y = b sinθ, then dy/dx is:",
      options: [
        "-(b/a)tanθ",
        "-(b/a)cotθ",
        "(b/a)cotθ",
        "(a/b)tanθ",
      ],
      correctIndex: 1,
    },

    {
      id: 15,
      question:
        "If y = tan⁻¹[(3x − x³)/(1 − 3x²)], then dy/dx is:",
      options: [
        "3/(1+x²)",
        "1/(1+x²)",
        "3/(1+9x²)",
        "3x²/(1+x²)",
      ],
      correctIndex: 0,
    },

    {
      id: 16,
      question: "If y = e^(x+y), then dy/dx is:",
      options: [
        "y/x",
        "1/(y−1)",
        "y/(1−y)",
        "e^(x+y)/(1−e^(x+y))",
      ],
      correctIndex: 3,
    },

    {
      id: 17,
      question: "The second derivative of x³ + tanx is:",
      options: [
        "6x + 2sec²x tanx",
        "3x² + sec²x",
        "6x + sec²x tanx",
        "6x + 2secx",
      ],
      correctIndex: 0,
    },

    {
      id: 18,
      question:
        "If x = at² and y = 2at, then d²y/dx² is:",
      options: [
        "-1/(2at²)",
        "1/(2at³)",
        "-1/(2at³)",
        "-1/t²",
      ],
      correctIndex: 2,
    },

    {
      id: 19,
      question:
        "For what value of λ is the function f(x) = {λ(x²−2x), x≤0 and 4x+1, x>0} continuous at x = 0?",
      options: [
        "0",
        "1",
        "Any real value",
        "No value of λ",
      ],
      correctIndex: 3,
    },

    {
      id: 20,
      question: "If y = log(log x), then dy/dx is:",
      options: [
        "1/x",
        "1/log x",
        "1/(x log x)",
        "x/log x",
      ],
      correctIndex: 2,
    },

    {
      id: 21,
      question: "If A is a 2×2 matrix such that A² = I, then A is called:",
      options: [
        "Singular matrix",
        "Idempotent matrix",
        "Involutory matrix",
        "Diagonal matrix",
      ],
      correctIndex: 2,
    },

    {
      id: 22,
      question:
        "Let A and B be 3×3 matrices such that |A| = 3 and |B| = -2. Find the value of |2A'B⁻¹|.",
      options: ["-12", "-3", "12", "-4"],
      correctIndex: 0,
    },

    {
      id: 23,
      question:
        "If the cofactor of element a₂₃ is denoted by A₂₃, then the value of a₁₁A₂₁ + a₁₂A₂₂ + a₁₃A₂₃ is:",
      options: ["|A|", "0", "-|A|", "2|A|"],
      correctIndex: 1,
    },

    {
      id: 24,
      question: "If A is a square matrix such that A' = -A, then A is called:",
      options: [
        "Symmetric matrix",
        "Identity matrix",
        "Skew-symmetric matrix",
        "Singular matrix",
      ],
      correctIndex: 2,
    },

    {
      id: 25,
      question: "If A is a square matrix and |A| ≠ 0, then A is called:",
      options: [
        "Singular matrix",
        "Non-singular matrix",
        "Skew-symmetric matrix",
        "Null matrix",
      ],
      correctIndex: 1,
    },

    {
      id: 26,
      question:
        "If all the elements of any row (or column) of a determinant are zero, then the determinant is:",
      options: ["1", "-1", "0", "Undefined"],
      correctIndex: 2,
    },

    {
      id: 27,
      question: "What is the principal value of sin⁻¹(sin(4π/3))?",
      options: ["4π/3", "π/3", "-π/3", "-2π/3"],
      correctIndex: 2,
    },

    {
      id: 28,
      question:
        "If the system of equations 2x + 3y = 5 and 4x + ky = 10 has infinitely many solutions, then k equals:",
      options: ["3", "6", "0", "9"],
      correctIndex: 1,
    },

    {
      id: 29,
      question: "If A = [3 1; -1 2], then A² − 5A + 7I equals:",
      options: ["I", "O", "A", "5I"],
      correctIndex: 1,
    },

    {
      id: 30,
      question: "If sin⁻¹ x + sin⁻¹ y = 2π/3, then cos⁻¹ x + cos⁻¹ y equals:",
      options: ["π/3", "2π/3", "π/6", "π"],
      correctIndex: 0,
    },

    {
      id: 31,
      question:
        "If A is a skew-symmetric matrix of order 3, then the determinant of A is always:",
      options: [
        "A perfect square",
        "A negative number",
        "Zero",
        "A positive non-zero number",
      ],
      correctIndex: 2,
    },

    {
      id: 32,
      question: "The value of cos⁻¹(cos(-π/4)) is:",
      options: ["-π/4", "π/4", "3π/4", "5π/4"],
      correctIndex: 1,
    },

    {
      id: 33,
      question: "If |A| = 0, then matrix A is called:",
      options: [
        "Identity matrix",
        "Singular matrix",
        "Diagonal matrix",
        "Scalar matrix",
      ],
      correctIndex: 1,
    },

    {
      id: 34,
      question:
        "If A is a non-singular matrix of order 3 such that A² = A, then |A| equals:",
      options: ["0", "1", "3", "9"],
      correctIndex: 1,
    },

    {
      id: 35,
      question: "The value of tan⁻¹(1/√3) + sin⁻¹(1/2) is:",
      options: ["π/6", "π/3", "π/2", "2π/3"],
      correctIndex: 1,
    },

    {
      id: 36,
      question:
        "If A and B are matrices such that AB = BA and A is invertible, then BA⁻¹ equals:",
      options: ["A⁻¹B", "AB⁻¹", "B⁻¹A", "I"],
      correctIndex: 0,
    },

    {
      id: 37,
      question: "If tan⁻¹ x = π/3, then the value of x is:",
      options: ["1/√3", "√3", "1", "2"],
      correctIndex: 1,
    },

    {
      id: 38,
      question: "For any square matrix A, the matrix AA' is always:",
      options: ["Skew-symmetric", "Symmetric", "Singular", "Diagonal"],
      correctIndex: 1,
    },

    {
      id: 39,
      question: "If sin⁻¹ x = π/4, then the value of x is:",
      options: ["1/2", "√3/2", "1/√2", "0"],
      correctIndex: 2,
    },

    {
      id: 40,
      question: "If det(A) = 5 and det(B) = 2, then det(AB) equals:",
      options: ["7", "10", "3", "25"],
      correctIndex: 1,
    },
  ],
};
