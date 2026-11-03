
"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    // Password reset functionality will be connected later.
    setSubmitted(true);
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <span className="inline-flex rounded-full bg-sunset/15 px-4 py-2 text-sm font-semibold text-[#9A5B13]">
          Account recovery
        </span>

        <h1 className="mt-5 text-3xl font-bold text-forest">
          Forgot your password?
        </h1>

        <p className="mt-3 text-muted">
          Don&apos;t worry. Enter your email address and we&apos;ll help you
          regain access to your account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-forest/10 bg-white p-6 shadow-sm sm:p-8"
      >
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
              setSubmitted(false);
            }}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
          />
        </div>

        {submitted && (
          <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            A link to reset your password has been sent to {email}. Please check your inbox and follow the instructions to reset your password.
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-forest px-6 py-3.5 font-semibold text-white transition hover:bg-[#245747]"
        >
          Send Reset Instructions
        </button>

        <p className="text-center text-sm text-muted">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-forest hover:underline"
          >
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
}
