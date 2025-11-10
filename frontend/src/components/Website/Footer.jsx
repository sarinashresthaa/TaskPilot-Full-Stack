import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="relative mt-16 bg-[#661fff] text-white">
      <svg
        className="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16"
        preserveAspectRatio="none"
        viewBox="0 0 1440 54">
        <path
          fill="#661fff"
          d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
        />
      </svg>
      <div className="px-4 pt-12 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="flex justify-between gap-16 row-gap-10 mb-8">
          <div className="md:max-w-md lg:col-span-2">
            <Link
              to="/"
              aria-label="Go home"
              title="Company"
              className="inline-flex items-center text-xl font-bold">
              🚀
              <span className="ml-2  tracking-wide text-gray-100">
                TaskPilot
              </span>
            </Link>
            <div className="mt-4 lg:max-w-sm">
              <p className="text-sm text-deep-purple-50">
                TaskPilot helps you plan, track, and manage tasks effortlessly.
                Stay organized and boost your productivity every day.
              </p>
              <p className="mt-4 text-sm text-deep-purple-50">
                TaskPilot – your reliable task management companion. Turn goals
                into accomplishments with ease.
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="font-semibold text-bold tracking-wide text-teal-accent-400 border-b border-white">
             Important Links
            </p>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  to="/"
                  className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-accent-400">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-accent-400">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-accent-400">
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-accent-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-between pt-5 pb-10 border-t border-deep-purple-accent-200 sm:flex-row">
          <p className="text-sm text-gray-100">
            © Copyright 2025 TaskPilot. All rights reserved.
          </p>
          <div className="flex items-center mt-4 space-x-4 sm:mt-0">
            <Link
              to="https://www.instagram.com"
              target="_blank"
              className="transition-colors duration-300 text-deep-purple-100 hover:text-teal-accent-400">
              <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
                <circle cx="15" cy="15" r="4" />
                <path d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z" />
              </svg>
            </Link>
            <Link
              to="https://www.facebook.com"
              target="_blank"
              className="transition-colors duration-300 text-deep-purple-100 hover:text-teal-accent-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
