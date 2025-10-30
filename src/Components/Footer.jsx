 import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-[#1B004D] to-[#2E0A6F] text-white px-6 md:px-16 lg:px-24 xl:px-32 pt-12">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-white/10 pb-10">
        
        {/* Logo + Text */}
        <div className="md:max-w-96">
          <h1 className="text-2xl font-bold tracking-wide">StudyFlow</h1>
          <p className="mt-5 text-sm text-white/80 leading-relaxed">
            StudyFlow helps students stay consistent with smart study plans,
            personalized quizzes, and real-time progress tracking.
          </p>
        </div>

        {/* Links */}
        <div className="flex-1 flex items-start md:justify-end gap-20">

          {/* Navigation */}
          <div>
            <h2 className="font-semibold mb-4 text-white">Navigate</h2>
            <ul className="text-sm space-y-2 text-white/80">
              <li><Link to="/planner" className="hover:text-white">Study Planner</Link></li>
              <li><Link to="/quiz" className="hover:text-white">Quiz Generator</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold mb-4 text-white">Get in touch</h2>
            <ul className="text-sm space-y-2 text-white/80">
              <li>Email: support@studyflow.com</li>
              <li>Instagram: @studyflow_ai</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <p className="pt-4 text-center text-xs md:text-sm pb-6 text-white/70">
        © 2025 StudyFlow. All rights reserved.
      </p>

    </footer>
  );
};

export default Footer;
