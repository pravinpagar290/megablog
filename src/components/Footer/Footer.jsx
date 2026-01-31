import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-sm">
        {/* Left: small logo */}
        <div className="flex items-center gap-3">
          <Link to="/" aria-label="Home" className="inline-flex items-center">
            <div className="w-[90px]">
              <Logo width="90px" />
            </div>
          </Link>
        </div>

        {/* Center (mobile): copyright */}
        <div className="hidden sm:block text-gray-600 dark:text-gray-300">
          &copy; {new Date().getFullYear()} Megablog. All rights reserved.
        </div>

        {/* Right: minimal links */}
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Link
            to="/privacy"
            className="hover:text-gray-700 dark:hover:text-gray-200"
          >
            Privacy
          </Link>
          <span className="hidden sm:inline text-gray-300">|</span>
          <Link
            to="/terms"
            className="hover:text-gray-700 dark:hover:text-gray-200"
          >
            Terms
          </Link>
        </div>

        {/* Mobile visible copyright below (keeps footer compact on small screens) */}
        <div className="sm:hidden w-full mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Megablog
        </div>
      </div>
    </footer>
  );
}
