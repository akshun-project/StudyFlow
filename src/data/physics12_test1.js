// src/data/physics12_test1.js

export const physics12Test1 = {
  id: "phy12-test1",
  class: "12",
  subject: "Physics",
  title: "Class 12 Physics — Full Test (40 MCQs)",
  questions: [

    // -------- ELECTROSTATICS & CURRENT ELECTRICITY (1–10) --------
    {
      id: 1,
      question: "The electric potential due to a point charge q at a distance r is proportional to:",
      options: ["r", "r²", "1/r²", "1/r"],
      correctIndex: 3,
    },
    {
      id: 2,
      question: "Which law is based on the conservation of charge?",
      options: ["Kirchhoff’s Voltage Law", "Ohm's Law", "Kirchhoff’s Current Law", "Gauss's Law"],
      correctIndex: 2,
    },
    {
      id: 3,
      question: "If the distance between two charges is doubled, the electrostatic force between them:",
      options: ["Doubles", "Halves", "Becomes one-fourth", "Quadruples"],
      correctIndex: 2,
    },
    {
      id: 4,
      question: "A dielectric slab is introduced between the plates of a charged capacitor. The energy stored:",
      options: ["Increases", "Remains the same", "Decreases", "Becomes zero"],
      correctIndex: 2,
    },
    {
      id: 5,
      question: "Equivalent resistance of two resistors in parallel is:",
      options: [
        "Greater than both resistors",
        "Less than R1 but greater than R2",
        "Always less than the smaller resistance",
        "Equal to arithmetic mean",
      ],
      correctIndex: 2,
    },
    {
      id: 6,
      question: "The drift velocity of electrons in a conductor is independent of:",
      options: ["Current", "Relaxation time", "Electric field", "Number density of electrons"],
      correctIndex: 0,
    },
    {
      id: 7,
      question: "A potentiometer is preferred over a voltmeter because:",
      options: ["It is cheap", "It draws no current", "It has high resistance", "It has a long wire"],
      correctIndex: 1,
    },
    {
      id: 8,
      question: "The force per unit charge is known as:",
      options: ["Electric potential", "Electric flux", "Electric field intensity", "Dipole moment"],
      correctIndex: 2,
    },
    {
      id: 9,
      question: "The unit of electric flux is:",
      options: ["Volt/meter", "Joule/Coulomb", "Newton meter²/Coulomb", "Volt meter"],
      correctIndex: 2,
    },
    {
      id: 10,
      question: "An equipotential surface is one where:",
      options: [
        "Electric field is zero",
        "Charge is uniform",
        "No work is done in moving a test charge",
        "Charge is positive",
      ],
      correctIndex: 2,
    },

    // -------- MAGNETISM, EMI & AC (11–20) --------
    {
      id: 11,
      question: "Magnetic field at the center of a circular loop is proportional to:",
      options: ["R", "R²", "I/R", "I/R²"],
      correctIndex: 2,
    },
    {
      id: 12,
      question: "A charge enters a uniform magnetic field at 90°. Its path will be:",
      options: ["Straight line", "Ellipse", "Circle", "Helix"],
      correctIndex: 2,
    },
    {
      id: 13,
      question: "A transformer is used to change:",
      options: ["Power", "Frequency", "Voltage", "Resistance"],
      correctIndex: 2,
    },
    {
      id: 14,
      question: "Lenz's Law is a consequence of conservation of:",
      options: ["Momentum", "Charge", "Energy", "Mass"],
      correctIndex: 2,
    },
    {
      id: 15,
      question: "Self-inductance of a coil is independent of:",
      options: ["Number of turns", "Area", "Core material", "Current"],
      correctIndex: 3,
    },
    {
      id: 16,
      question: "Impedance in an LCR series circuit at resonance equals:",
      options: ["√(R² + (XL + XC)²)", "√(R² + (XL − XC)²)", "XL − XC", "R"],
      correctIndex: 3,
    },
    {
      id: 17,
      question: "Ratio of velocity of sound waves to EM waves in vacuum is:",
      options: ["Greater than 1", "Equal to 1", "Less than 1", "Zero"],
      correctIndex: 3,
    },
    {
      id: 18,
      question: "Magnetic field lines:",
      options: [
        "Do not exist inside a magnet",
        "Form closed loops",
        "Originate from South pole",
        "Cross each other",
      ],
      correctIndex: 1,
    },
    {
      id: 19,
      question: "A cyclotron is used to accelerate:",
      options: ["Electrons", "Neutrons", "Positive ions", "Neutral atoms"],
      correctIndex: 2,
    },
    {
      id: 20,
      question: "Average power consumed is zero if the circuit contains:",
      options: ["Only resistance", "Only inductance", "Only capacitance", "Only inductance or capacitance"],
      correctIndex: 3,
    },

    // -------- OPTICS & EM WAVES (21–30) --------
    {
      id: 21,
      question: "Wavelength in a medium (μ) is related to vacuum wavelength λ by:",
      options: ["λ/μ²", "λμ", "λμ²", "λ/μ"],
      correctIndex: 3,
    },
    {
      id: 22,
      question: "Which phenomenon proves EM waves are transverse?",
      options: ["Reflection", "Refraction", "Interference", "Polarization"],
      correctIndex: 3,
    },
    {
      id: 23,
      question: "A convex lens dipped in a liquid of identical refractive index acts as:",
      options: ["Converging lens", "Diverging lens", "Plane glass plate", "Prism"],
      correctIndex: 2,
    },
    {
      id: 24,
      question: "Magnifying power of a microscope is:",
      options: ["1 + f/D", "f/D", "1 + D/f", "1 + f/D"],
      correctIndex: 0,
    },
    {
      id: 25,
      question: "Angular fringe width in YDSE is independent of:",
      options: ["Wavelength", "Distance between slits", "Screen distance", "Medium's refractive index"],
      correctIndex: 2,
    },
    {
      id: 26,
      question: "Splitting of white light through a prism is due to:",
      options: ["Reflection", "Dispersion", "Scattering", "Diffraction"],
      correctIndex: 1,
    },
    {
      id: 27,
      question: "Ratio of E/B in an EM wave equals:",
      options: ["Frequency", "Wavelength", "Speed of light in vacuum", "Speed of light in medium"],
      correctIndex: 2,
    },
    {
      id: 28,
      question: "Images formed by a convex mirror are always:",
      options: ["Real & inverted", "Real & magnified", "Virtual & inverted", "Virtual & diminished"],
      correctIndex: 3,
    },
    {
      id: 29,
      question: "Phase difference between points on a wavefront is:",
      options: ["π", "2π", "π/2", "Zero"],
      correctIndex: 3,
    },
    {
      id: 30,
      question: "Resolving power increases with:",
      options: ["Decrease in wavelength", "Decrease in aperture", "Decrease in μ", "Decrease in λ and Increase in aperture"],
      correctIndex: 3,
    },

    // -------- MODERN PHYSICS & ELECTRONICS (31–40) --------
    {
      id: 31,
      question: "Binding energy per nucleon is a measure of:",
      options: ["Total energy", "Size", "Stability", "Radioactivity"],
      correctIndex: 2,
    },
    {
      id: 32,
      question: "Minimum energy needed to release an electron is called:",
      options: ["Ionisation energy", "Threshold frequency", "Stopping potential", "Work function"],
      correctIndex: 3,
    },
    {
      id: 33,
      question: "De Broglie wavelength is given by:",
      options: ["λ = ph", "λ = p/h", "λ = h/p²", "λ = h/p"],
      correctIndex: 3,
    },
    {
      id: 34,
      question: "Radius of the nth Bohr orbit is proportional to:",
      options: ["n", "1/n", "n²", "1/n²"],
      correctIndex: 2,
    },
    {
      id: 35,
      question: "Photoelectrons are emitted due to:",
      options: ["Interference", "Diffraction", "Photoelectric effect", "Compton effect"],
      correctIndex: 2,
    },
    {
      id: 36,
      question: "Output frequency of a full-wave rectifier with 50 Hz input is:",
      options: ["50 Hz", "75 Hz", "25 Hz", "100 Hz"],
      correctIndex: 3,
    },
    {
      id: 37,
      question: "Conductors differ from insulators due to:",
      options: [
        "Small band gap",
        "Overlapping conduction & valence bands",
        "Large band gap",
        "Wide valence band",
      ],
      correctIndex: 1,
    },
    {
      id: 38,
      question: "Adding impurity to an intrinsic semiconductor is called:",
      options: ["Rectification", "Amplification", "Doping", "Quenching"],
      correctIndex: 2,
    },
    {
      id: 39,
      question: "Fraction of radioactive sample remaining after 2T (two half-lives) is:",
      options: ["1/2", "1/8", "1/4", "3/4"],
      correctIndex: 2,
    },
    {
      id: 40,
      question: "Force that binds nucleons inside the nucleus is the:",
      options: ["Electromagnetic force", "Gravitational force", "Nuclear force", "Weak force"],
      correctIndex: 2,
    },

  ],
};
