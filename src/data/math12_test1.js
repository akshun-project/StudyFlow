// src/data/math12_test1.js

export const math12Test1 = {
  id: "math12-test1",
  class: "12",
  subject: "Mathematics",
  title: "Class 12 Mathematics — Full Test (40 MCQs)",

  questions: [
    {
      id: 1,
      question:
        "If A is a square matrix of order 3 such that |A| = -5, then what is the value of |3A|?",
      options: ["-15", "-45", "-135", "135"],
      correctIndex: 2,
    },

    {
      id: 2,
      question: "What is the principal value of cos⁻¹(cos(7π/6))?",
      options: ["7π/6", "5π/6", "π/6", "-π/6"],
      correctIndex: 1,
    },

    {
      id: 3,
      question:
        "If A is a symmetric matrix and B is a skew-symmetric matrix of the same order, then the matrix AB - BA is always a:",
      options: [
        "Symmetric matrix",
        "Skew-symmetric matrix",
        "Identity matrix",
        "Zero matrix",
      ],
      correctIndex: 0,
    },

    {
      id: 4,
      question:
        "If A is a 2×2 matrix such that |A| = 3, then the value of |2A| is:",
      options: ["6", "9", "12", "24"],
      correctIndex: 2,
    },

    {
      id: 5,
      question:
        "If A is a 3×3 invertible matrix, then which of the following is equal to |adj A|?",
      options: ["|A|", "|A|²", "|A|³", "3|A|"],
      correctIndex: 1,
    },

    {
      id: 6,
      question: "Evaluate tan⁻¹(1) + cos⁻¹(-1/2) + sin⁻¹(-1/2).",
      options: ["π/4", "3π/4", "π/2", "11π/12"],
      correctIndex: 1,
    },

    {
      id: 7,
      question:
        "If a matrix A is both symmetric and skew-symmetric, then A must be a:",
      options: [
        "Diagonal matrix",
        "Zero matrix",
        "Identity matrix",
        "Scalar matrix",
      ],
      correctIndex: 1,
    },

    {
      id: 8,
      question:
        "Let A be a square matrix of order 3×3. If every element of A is multiplied by 2 to form matrix B, then how are the determinants |A| and |B| related?",
      options: ["|B| = 2|A|", "|B| = 4|A|", "|B| = 8|A|", "|B| = 6|A|"],
      correctIndex: 2,
    },

    {
      id: 9,
      question: "What is the value of tan(cos⁻¹(4/5) + tan⁻¹(2/3))?",
      options: ["6/17", "17/6", "7/12", "17/12"],
      correctIndex: 1,
    },

    {
      id: 10,
      question:
        "If A and B are square matrices of the same order such that AB = A and BA = B, then B² is equal to:",
      options: ["A", "B", "I", "O"],
      correctIndex: 1,
    },

    {
      id: 11,
      question:
        "If two rows of a determinant are identical, then the value of the determinant is:",
      options: ["1", "-1", "0", "Depends on matrix"],
      correctIndex: 2,
    },

    {
      id: 12,
      question:
        "If the area of a triangle with vertices (2, -6), (5, 4), and (k, 4) is 35 square units, then the value of k is:",
      options: ["12", "-2", "12 or -2", "12 or -4"],
      correctIndex: 2,
    },

    {
      id: 13,
      question: "What is the principal value of tan⁻¹(tan(5π/6))?",
      options: ["5π/6", "-π/6", "π/6", "-5π/6"],
      correctIndex: 1,
    },
    {
      id: 14,
      question:
        "If A = [aᵢⱼ] is a 2×2 matrix whose elements are given by aᵢⱼ = (i + 2j)² / 2, then the element a₁₂ is:",
      options: ["9/2", "25/2", "8", "18"],
      correctIndex: 1,
    },

    {
      id: 15,
      question:
        "If A is a singular matrix, then matrix A satisfies which of the following conditions?",
      options: ["|A| ≠ 0", "|A| = 0", "A⁻¹ exists", "A = A'"],
      correctIndex: 1,
    },
    {
      id: 16,
      question:
        "If A and B are invertible matrices of the same order, then which of the following statements is NOT correct?",
      options: [
        "|A⁻¹| = 1/|A|",
        "(AB)⁻¹ = B⁻¹A⁻¹",
        "(A + B)⁻¹ = A⁻¹ + B⁻¹",
        "(A')⁻¹ = (A⁻¹)'",
      ],
      correctIndex: 2,
    },

    {
      id: 17,
      question: "The principal value range of sin⁻¹ x is:",
      options: ["[-π/2, π/2]", "[0, π]", "[-π, π]", "[0, 2π]"],
      correctIndex: 0,
    },

    {
      id: 18,
      question:
        "If A is a square matrix of order 3 and |adj A| = 64, then the possible values of |A| are:",
      options: ["±4", "±8", "8", "64"],
      correctIndex: 1,
    },

    {
      id: 19,
      question:
        "If A = [cos α  -sin α; sin α  cos α], and A + A' = I, then the value of α in the first quadrant is:",
      options: ["π/6", "π/3", "π/4", "π/2"],
      correctIndex: 1,
    },

    {
      id: 20,
      question:
        "If A is a 3×3 matrix and |A| = 4, then the determinant of adj(A) is:",
      options: ["4", "16", "64", "2"],
      correctIndex: 1,
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
