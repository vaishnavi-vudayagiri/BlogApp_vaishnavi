import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const onUserRegister = async (userObj) => {
    try {
      setLoading(true);
      setApiError(null);

      const formData = new FormData();

      formData.append("role", userObj.role);
      formData.append("firstName", userObj.firstName);
      formData.append("lastName", userObj.lastName || "");
      formData.append("email", userObj.email);
      formData.append("password", userObj.password);

      if (userObj.profileImageUrl?.[0]) {
        formData.append(
          "profileImageUrl",
          userObj.profileImageUrl[0]
        );
      }

      const BASE_URL =
        import.meta.env.VITE_API_URL ||
        "https://blogapp-vaishnavi.onrender.com";

      const res = await axios.post(
        `${BASE_URL}/auth/users`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (res.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.log("Registration error:", err);

      setApiError(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-blue-50 to-purple-100 flex items-center justify-center px-4 py-16">
      
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account ✨
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Join us and start your journey
        </p>

        {/* API ERROR */}
        {apiError && (
          <p className="text-red-500 text-sm text-center mb-4 bg-red-50 py-2 rounded-lg">
            {apiError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onUserRegister)}
          className="space-y-5"
        >

          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Register as
            </label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  value="USER"
                  className="accent-purple-600"
                  {...register("role", {
                    required: "Select role",
                  })}
                />
                User
              </label>

              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  value="AUTHOR"
                  className="accent-purple-600"
                  {...register("role", {
                    required: "Select role",
                  })}
                />
                Author
              </label>
            </div>

            {errors.role && (
              <p className="text-red-500 text-sm mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>

              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                {...register("firstName", {
                  required:
                    "First name required",
                })}
              />

              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>

              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                {...register("lastName")}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              {...register("email", {
                required:
                  "Email required",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              {...register("password", {
                required:
                  "Password required",
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* PROFILE IMAGE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>

            <input
              type="file"
              accept="image/png, image/jpeg"
              className="w-full text-sm border border-gray-200 rounded-xl p-3 bg-white/80"
              {...register(
                "profileImageUrl",
                {
                  validate: {
                    fileType: (
                      files
                    ) => {
                      if (
                        !files?.[0]
                      )
                        return true;

                      return [
                        "image/png",
                        "image/jpeg",
                      ].includes(
                        files[0].type
                      )
                        ? true
                        : "Only JPG/PNG allowed";
                    },

                    fileSize: (
                      files
                    ) => {
                      if (
                        !files?.[0]
                      )
                        return true;

                      return files[0]
                        .size <=
                        2 *
                          1024 *
                          1024
                        ? true
                        : "Max size 2MB";
                    },
                  },
                }
              )}
              onChange={(e) => {
                const file =
                  e.target.files[0];

                if (file) {
                  setPreview(
                    URL.createObjectURL(
                      file
                    )
                  );
                }
              }}
            />

            {errors.profileImageUrl && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors
                    .profileImageUrl
                    .message
                }
              </p>
            )}

            {preview && (
              <div className="mt-4 flex justify-center">
                <img
                  src={preview}
                  alt="preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow-md"
                />
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl transition duration-300"
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-purple-600 font-medium hover:text-blue-600"
          >
            Sign In
          </NavLink>
        </p>

      </div>
    </div>
  );
}

export default Register;