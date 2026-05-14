import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../stores/authStore";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    login,
    currentUser,
    loading,
    error,
    isAuthenticated,
  } = useAuth((state) => state);

  const onUserLogin = (userCredObj) => {
    login(userCredObj);
  };

  useEffect(() => {
    if (isAuthenticated === true) {
      if (currentUser.role === "USER") {
        navigate("/user-profile");
      }
      if (currentUser.role === "AUTHOR") {
        navigate("/author-profile");
      }
      if (currentUser.role === "ADMIN") {
        navigate("/admin-profile");
      }
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-slate-100 via-blue-50 to-purple-100">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-blue-50 to-purple-100 flex items-center justify-center px-4 py-16">
      
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Sign in to continue to your account
        </p>

        {/* API Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4 bg-red-50 py-2 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onUserLogin)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              {...register("email", {
                required: "Email is required",
                validate: (value) =>
                  value.trim().length > 0 ||
                  "Email cannot be empty",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              {...register("password", {
                required: "Password is required",
                validate: (value) =>
                  value.trim().length > 0 ||
                  "Password cannot be empty",
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-purple-600 hover:text-blue-600 transition"
            >
              Forgot password?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl transition duration-300"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <NavLink
            to="/register"
            className="text-purple-600 font-medium hover:text-blue-600"
          >
            Create one
          </NavLink>
        </p>

      </div>
    </div>
  );
}

export default Login;