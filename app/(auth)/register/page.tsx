"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";
import { RegistrationForm } from "@/types";
import { BusinessType, UserRole } from "@/app/generated/prisma/enums";
import { useRouter } from "next/navigation";


const initialForm: RegistrationForm = {
  role: "CUSTOMER",
  fullName: "",
  organisationName: "",
  email: "",
  password: "",
  confirmPassword: "",
  address: "",
  city: "",
  country: "South Africa",
  phone: "",
  suburb: "",
  website: "",
  description: "",
  businessType: "",
};


export default function RegisterPage() {
  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  function handleChange(field: keyof RegistrationForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess(false);
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess(true);

      // Clear the form after successful registration
      setForm({
        ...initialForm,
      });
      router.push(
          `/login?registered=true&email=${encodeURIComponent(form.email.trim())}`
      );
    } catch {
      setError("Unable to connect to the server. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-xl">
      <div className="mb-8 text-center">
        <span className="inline-flex rounded-full bg-sunset/15 px-4 py-2 text-sm font-semibold text-[#9A5B13]">
          Join SunsetDrop
        </span>

        <h1 className="mt-5 text-3xl font-bold text-forest">
          Create your account
        </h1>

        <p className="mt-3 text-muted">Your favourite food. Better prices.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-forest/10 bg-white p-6 shadow-sm sm:p-8"
      >
        {/* Account type */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-charcoal">
            I want to join SunsetDrop as a:
          </label>

          <div className="grid grid-cols-3 gap-2">
            {Object.values(UserRole)
              .filter((role) => role !== UserRole.ADMIN)
              .map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleChange("role", role)}
                  className={`rounded-xl border px-2 py-3 text-sm font-semibold transition ${
                    form.role === role
                      ? "border-forest bg-forest text-white"
                      : "border-gray-200 text-muted hover:border-forest"
                  }`}
                >
                  <span className="capitalize">{role.toLowerCase()}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Full name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal">
            {form.role === "CUSTOMER" ? "Full Name" : "Contact Person's Name"}
          </label>

          <input
            required
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
          />
        </div>

        {/* Organisation name */}
        {form.role !== "CUSTOMER" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              {form.role === "BUSINESS" ? "Business Name" : "Organisation Name"}
            </label>

            <input
              required
              autoComplete="organization"
              value={form.organisationName}
              onChange={(e) => handleChange("organisationName", e.target.value)}
              placeholder={
                form.role === "BUSINESS"
                  ? "e.g. Sunrise Bakery"
                  : "e.g. Hope Foundation"
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
            />
          </div>
        )}

        {form.role === "BUSINESS" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              Business Type
            </label>
            <select
              required
              value={form.businessType}
              onChange={(e) => handleChange("businessType", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
            >
              <option value="">Select a business type</option>
              {Object.values(BusinessType).map((type) => {
                const label = type.toLowerCase().replace(/_/g, " ");
                return (
                  <option key={type} value={type} className="capitalize">
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              {form.role === "CHARITY"
                ? "Organisation Email"
                : form.role === "BUSINESS"
                  ? "Business Email"
                  : "Email Address"}
            </label>

            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              Phone Number
            </label>

            <input
              required
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="e.g. +27 123 456 7890"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
            />
          </div>
        </div>

        {form.role !== "CUSTOMER" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              {form.role === "BUSINESS"
                ? "Business Website"
                : "Organisation Website"}
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://www.example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
            />
          </div>
        )}

        {form.role !== "CUSTOMER" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              {form.role === "BUSINESS"
                ? "Business Description"
                : "Organisation Description"}
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Tell us about your business or organisation"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
            />
          </div>
        )}

        {/* Location */}
        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal">
            Street Address
          </label>

          <input
            required={["BUSINESS", "CHARITY"].includes(form.role)}
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Street address"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              Suburb
            </label>
            <input
              value={form.suburb}
              onChange={(e) => handleChange("suburb", e.target.value)}
              placeholder="e.g. Sandton"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              City
            </label>
            <input
              required={["BUSINESS", "CHARITY"].includes(form.role)}
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="e.g. Johannesburg"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-charcoal">
            Country
          </label>
          <div>
            <input
              value="South Africa"
              disabled
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-muted"
            />
          </div>
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              Password
            </label>

            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
            />
          </div>

          {/* Confirm password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              Confirm Password
            </label>

            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="Enter your password again"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Registration successful!
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-forest px-6 py-3.5 font-semibold text-white transition hover:bg-[#245747]"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-forest hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        By creating an account, you agree to our Terms of Service and Privacy
        Policy.
      </p>
    </div>
  );
}
