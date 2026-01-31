import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin({ userData })); // <-- changed
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center w-full min-h-screen py-12 bg-gray-50 dark:bg-gray-900" // Added background & increased vertical padding
    >
      <div
        className={`mx-auto w-full max-w-sm md:max-w-lg bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700 transition-shadow duration-300 hover:shadow-xl`}
      >
        {/* Logo Section with better spacing */}
        <div className="mb-8 flex justify-center">
          <Logo
            width="100%"
            className="max-w-[120px]" // Slightly larger logo
          />
        </div>

        <h2 className="text-center text-2xl font-bold leading-normal text-gray-900 dark:text-white mb-4">
          Sign in to your account
        </h2>

        {error && (
          <p
            className="text-red-500 text-sm font-medium mb-6 text-center max-w-[250px] mx-auto" // Centered error with max-width
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(login)} className="space-y-6">
          {" "}
          {/* Increased form spacing */}
          {/* Email Input Group */}
          <div>
            <Input
              label="Email Address"
              placeholder="example@domain.com"
              type="email"
              className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800 p-3 rounded-lg" // Input styling
              {...register("email", {
                required: "Email is required",
                validate: {
                  matchPattern: (value) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                    "Invalid email address",
                },
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Password Input Group */}
          <div>
            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800 p-3 rounded-lg" // Same input styling as email
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* Submit Button with improved padding and transitions */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-300"
          >
            Sign in
          </Button>
        </form>

        {/* Signup Link with consistent spacing */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?&nbsp;
          <Link
            to="/signup"
            className="font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
