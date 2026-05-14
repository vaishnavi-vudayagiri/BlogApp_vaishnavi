import { NavLink } from "react-router";

function Footer() {
  return (
    <footer className="mt-12 bg-white/70 backdrop-blur-xl border-t border-white/30 shadow-inner">
      
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">

        {/* LEFT */}
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MyBlog
          </span>
          . All rights reserved.
        </p>

        {/* RIGHT LINKS */}
        <div className="flex gap-6 text-sm font-medium">

          <NavLink
            to="/"
            className="text-gray-600 hover:text-purple-600 transition"
          >
            Home
          </NavLink>

          <NavLink
            to="/articles"
            className="text-gray-600 hover:text-purple-600 transition"
          >
            Articles
          </NavLink>

          <NavLink
            to="/authors"
            className="text-gray-600 hover:text-purple-600 transition"
          >
            Authors
          </NavLink>

        </div>
      </div>
    </footer>
  );
}

export default Footer;