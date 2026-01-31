import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice"; // Assuming 'login' is the slice name
import { Button, Input, Logo } from "./index.js";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");

  const create = async (data) => {
    setError("");
    try {
      const session = await authService.createAccount(data);
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
    <div className="flex items-center justify-center w-full min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-sm md:max-w-lg bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700 transition-shadow duration-300 hover:shadow-xl">
        {/* Logo Section */}
        <div className="mb-8 flex justify-center">
          <Logo
            width="100%"
            className="max-w-[120px] h-auto" // Maintain aspect ratio with max width
          />
        </div>

        {/* Page Heading */}
        <h2 className="text-center text-2xl font-extrabold leading-normal text-gray-900 dark:text-white mb-4">
          Create New Account
        </h2>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400"
          >
            Sign In
          </Link>
        </p>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm font-medium text-center max-w-[250px] mx-auto mb-6">
            {error}
          </p>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit(create)} className="space-y-6">
          {/* Full Name Input */}
          <div>
            <Input
              label="Full Name"
              type="text"
              className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800 p-3 rounded-lg w-full"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <Input
              label="Email"
              placeholder="Example@example.com"
              type="email"
              className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800 p-3 rounded-lg w-full"
              {...register("email", {
                required: "Email is required",
                validate: {
                  validEmail: (value) =>
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

          {/* Password Input */}
          <div>
            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800 p-3 rounded-lg w-full"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  hasSpecialChar: (value) =>
                    /[!@#$%^&*]/.test(value) ||
                    "Password needs at least one special character (!@#$%^&*)",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-lg transition-colors duration-300"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
