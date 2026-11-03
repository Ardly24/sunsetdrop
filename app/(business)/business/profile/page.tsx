
"use client";

import { useState, type SyntheticEvent } from "react";

type BusinessType =
  | "RESTAURANT"
  | "BAKERY"
  | "SUPERMARKET"
  | "GROCERY_STORE"
  | "OTHER";

interface BusinessProfile {
  name: string;
  type: BusinessType;
  email: string;
  phone: string;
  description: string;
  website: string;
}

const initialProfile: BusinessProfile = {
  name: "",
  type: "RESTAURANT",
  email: "",
  phone: "",
  description: "",
  website: "",
};

export default function BusinessProfilePage() {
  const [profile, setProfile] =
    useState<BusinessProfile>(initialProfile);

  const [saved, setSaved] = useState(false);

  function handleChange(
    field: keyof BusinessProfile,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Business profile:", profile);

    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-forest">
          Business Profile
        </h1>
        <p className="mt-2 text-muted">
          Add your business information so customers know who
          they&apos;re buying from.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic information */}
        <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div>
            <h2 className="text-lg font-semibold text-forest">
              Basic Information
            </h2>
            <p className="mt-1 text-sm text-muted">
              Tell us about your business.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Business Name *
              </label>
              <input
                required
                value={profile.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                placeholder="e.g. Sunrise Bakery"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Business Type *
              </label>
              <select
                required
                value={profile.type}
                onChange={(e) =>
                  handleChange("type", e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-forest"
              >
                <option value="RESTAURANT">Restaurant</option>
                <option value="BAKERY">Bakery</option>
                <option value="SUPERMARKET">Supermarket</option>
                <option value="GROCERY_STORE">Grocery Store</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Website
              </label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) =>
                  handleChange("website", e.target.value)
                }
                placeholder="https://example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
              />
            </div>
          </div>
        </section>

        {/* Contact information */}
        <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div>
            <h2 className="text-lg font-semibold text-forest">
              Contact Information
            </h2>
            <p className="mt-1 text-sm text-muted">
              How can customers and SunsetDrop contact your business?
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Business Email *
              </label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                placeholder="hello@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Business Phone *
              </label>
              <input
                type="tel"
                required
                value={profile.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
                placeholder="+27 12 345 6789"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
              />
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6">
          <div>
            <h2 className="text-lg font-semibold text-forest">
              About Your Business
            </h2>
            <p className="mt-1 text-sm text-muted">
              Give customers a short introduction to your business.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Business Description
            </label>
            <textarea
              rows={4}
              maxLength={500}
              value={profile.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
              placeholder="Tell customers what makes your business special..."
              className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-forest"
            />
            <p className="mt-1 text-right text-xs text-muted">
              {profile.description.length}/500 characters
            </p>
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {saved && (
            <p className="text-sm font-medium text-green-700">
              Profile saved successfully! (Demo only)
            </p>
          )}

          <button
            type="submit"
            className="rounded-xl bg-forest px-7 py-3 font-semibold text-white transition hover:bg-[#245747]"
          >
            Save Business Profile
          </button>
        </div>
      </form>
    </div>
  );
}
