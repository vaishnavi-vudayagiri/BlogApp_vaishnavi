import { NavLink } from "react-router";
import { useAuth } from "../stores/authStore";

function Header() {
  const isAuthenticated = useAuth(
    (state) => state.isAuthenticated
  );

  const user = useAuth(
    (state) => state.currentUser
  );

  const getProfilePath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";

      case "ADMIN":
        return "/admin-profile";

      default:
        return "/user-profile";
    }
  };

  return (
   <nav className="sticky top-0 z-50 bg-blue-300/70 backdrop-blur-xl border-b border-gray-800">
      
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-indigo-950">
          MyBlog
        </NavLink>

        {/* NAV LINKS */}
        <ul className="flex items-center gap-6 text-sm font-medium">

          {/* HOME */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-950 border-b-2 border-indigo-950 pb-1"
                  : "text-gray-600 hover:text-indigo-950 transition"
              }
            >
              Home
            </NavLink>
          </li>

          {/* NOT LOGGED IN */}
          {!isAuthenticated && (
            <>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? "text-purple-600 border-b-2 border-purple-600 pb-1"
                      : "text-gray-600 hover:text-purple-600 transition"
                  }
                >
                  Register
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className="px-5 py-2 rounded-full bg-linear-to-r from-indigo-900 to-indigo-950 text-white shadow-md hover:scale-105 hover:shadow-lg transition duration-300"
                >
                  Login
                </NavLink>
              </li>
            </>
          )}

          {/* LOGGED IN */}
          {isAuthenticated && (
            <li className="flex items-center gap-3">

              {/* Profile Image */}
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-300 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-800 to-indigo-600 text-white flex items-center justify-center font-semibold shadow-md">
                  {user?.firstName
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>
              )}

              {/* Profile Link */}
              <NavLink
                to={getProfilePath()}
                className="text-gray-700 hover:text-indigo-900 transition font-medium"
              >
                {user?.firstName || "Profile"}
              </NavLink>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
}

export default Header;