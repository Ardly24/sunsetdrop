
"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    // Authentication.
    console.log("Login details:", { email, password });

    setError("Authentication required.");
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <span className="inline-flex rounded-full bg-sunset/15 px-4 py-2 text-sm font-semibold text-[#9A5B13]">
          Welcome back
        </span>

        <h1 className="mt-5 text-3xl font-bold text-forest">
          Log in to SunsetDrop
        </h1>

        <p className="mt-3 text-muted">
          Your favourite food. Better prices.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-forest/10 bg-white p-6 shadow-sm sm:p-8"
      >
        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal">
            Email Address
          </label>

          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-charcoal">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-forest hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-20 outline-none focus:border-forest"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted hover:text-forest"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-forest px-6 py-3.5 font-semibold text-white transition hover:bg-[#245747]"
        >
          Log In
        </button>

        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-forest hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
