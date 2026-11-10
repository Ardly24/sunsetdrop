"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";
import { ListingType } from "@/types";
import { FoodCategory } from "@/app/generated/prisma/enums";
import Image from "next/image";
import { validatePhotos } from "@/lib/photo-utils";

export default function CreateListingPage() {
  const initialFormData = {
    title: "",
    category: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    quantity: "",
    collectionStart: "",
    collectionEnd: "",
    expiresAt: "",
    ingredients: "",
    allergens: "",
    storageInstructions: "",
    collectionInstructions: "",
  };
  const [listingType, setListingType] = useState<ListingType>("DISCOUNTED");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(false);

    try {
      let uploadedPhotos: {
        fileId: string;
        url: string;
        name: string;
      }[] = [];

      if (photos.length > 0) {
        const photoFormData = new FormData();

        photos.forEach((photo) => {
          photoFormData.append("photos", photo);
        });

        const uploadResponse = await fetch("/api/uploads", {
          method: "POST",
          body: photoFormData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || "Photo upload failed.");
        }

        uploadedPhotos = uploadResult.photos;
      }

      const response = await fetch("/api/business/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: listingType,
          originalPrice:
            listingType === "DONATION" ? 0 : Number(formData.originalPrice),
          discountedPrice:
            listingType === "DONATION" ? 0 : Number(formData.discountedPrice),
          quantity: Number(formData.quantity),
          photos: uploadedPhotos,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to create listing.");
      }

      setFormData(initialFormData);
      setListingType("DISCOUNTED");
      setSubmitted(true);
      setPhotos([]);
      setPhotoPreviews([]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-gray-400 focus:border-forest focus:ring-2 focus:ring-forest/10";

  const labelClass = "mb-2 block text-sm font-semibold text-charcoal";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Heading */}
      <div>
        <Link
          href="/business/listings"
          className="text-sm font-medium text-brand-muted hover:text-forest"
        >
          ← Back to listings
        </Link>

        <h1 className="mt-2 text-3xl font-bold text-charcoal">
          {" "}
          Create a listing{" "}
        </h1>

        <p className="mt-2 text-sm text-brand-muted">
          Share your available food deals and help good food find a home.
        </p>
      </div>

      {submitted && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Listing created successfully! Your food listing has been saved and is
          ready to manage.
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="ml-2 font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Listing type */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-charcoal">
            {" "}
            1. Choose listing type{" "}
          </h2>

          <p className="mt-1 text-sm text-brand-muted">
            Decide how you want to offer your food.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setListingType("DISCOUNTED")}
              className={`rounded-xl border-2 p-5 text-left transition ${
                listingType === "DISCOUNTED"
                  ? "border-forest bg-[#F0F5F0]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">🏷️</span>
              <p className="mt-3 font-bold text-charcoal">Discounted deal</p>
              <p className="mt-1 text-xs leading-5 text-brand-muted">
                Sell food at a reduced price to consumers.
              </p>
              {listingType === "DISCOUNTED" && (
                <p className="mt-3 text-xs font-bold text-forest">✓ Selected</p>
              )}
            </button>

            <button
              type="button"
              onClick={() => setListingType("DONATION")}
              className={`rounded-xl border-2 p-5 text-left transition ${
                listingType === "DONATION"
                  ? "border-forest bg-[#F0F5F0]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">💚</span>
              <p className="mt-3 font-bold text-charcoal">Food donation</p>
              <p className="mt-1 text-xs leading-5 text-brand-muted">
                Give food free of charge to eligible charities.
              </p>
              {listingType === "DONATION" && (
                <p className="mt-3 text-xs font-bold text-forest">✓ Selected</p>
              )}
            </button>
          </div>
        </section>

        {/* Food information */}
        <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-charcoal">
              2. Food information
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Tell customers what you&apos;re offering.
            </p>
          </div>

          <div>
            <label className={labelClass} htmlFor="title">
              {" "}
              Listing title *
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Fresh bakery selection"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="category">
              Food category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select a category</option>
              {Object.values(FoodCategory).map((category) => (
                <option key={category} value={category}>
                  {category
                    .replace(/_/g, " - ")
                    .toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="description">
              {" "}
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the food, portion sizes and what is included..."
              rows={4}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="photo">
              Food photo
            </label>
            <input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className={inputClass}
              disabled={photos.length >= 5}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);

                setPhotoError(null);

                const validationError = validatePhotos(
                  files,
                  5 - photos.length,
                );

                if (validationError) {
                  setPhotoError(validationError);
                  e.target.value = "";
                  return;
                }

                const oversizedFile = files.find(
                  (file) => file.size > 5 * 1024 * 1024,
                );

                if (oversizedFile) {
                  setPhotoError("Each image must not exceed 5 MB.");
                  e.target.value = "";
                  return;
                }

                const allFileNames = [
                  ...photos.map((photo) => photo.name.toLowerCase()),
                  ...files.map((file) => file.name.toLowerCase()),
                ];

                if (new Set(allFileNames).size !== allFileNames.length) {
                  setPhotoError(
                    "You cannot select photos with duplicate filenames.",
                  );
                  e.target.value = "";
                  return;
                }

                setPhotos((prev) => [...prev, ...files]);

                setPhotoPreviews((prev) => [
                  ...prev,
                  ...files.map((file) => URL.createObjectURL(file)),
                ]);

                e.target.value = "";
              }}
            />
            {photoError && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {photoError}
              </p>
            )}

            {photoPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {photoPreviews.map((preview, index) => (
                  <div key={preview} className="relative">
                    <Image
                      src={preview}
                      alt={`Food preview ${index + 1}`}
                      width={400}
                      height={300}
                      unoptimized
                      className="h-32 w-full rounded-xl border border-gray-200 object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-md bg-forest px-2 py-1 text-xs text-white">
                        Cover photo
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setPhotos((prev) => prev.filter((_, i) => i !== index));
                        setPhotoPreviews((prev) =>
                          prev.filter((_, i) => i !== index),
                        );
                      }}
                      className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mb-2 text-xs font-medium text-brand-muted">
              {photos.length} / 5 photos selected
            </p>
          </div>
        </section>

        {/* Pricing and quantity */}
        <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-charcoal">
              3. Pricing and quantity
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              {listingType === "DISCOUNTED"
                ? "Set your discounted price and available quantity."
                : "Donations are free for eligible charities."}
            </p>
          </div>

          {listingType === "DISCOUNTED" ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="originalPrice">
                  Original price (R) *
                </label>
                <input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="90.00"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="discountedPrice">
                  Discounted price (R) *
                </label>
                <input
                  id="discountedPrice"
                  name="discountedPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  placeholder="45.00"
                  className={inputClass}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-[#F0F5F0] p-4">
              <p className="text-sm font-semibold text-forest">
                Donation price: R0.00
              </p>
              <p className="mt-1 text-xs text-brand-muted">
                This listing will be offered free of charge through the charity
                claim workflow.
              </p>
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="quantity">
              {" "}
              Available quantity *{" "}
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g. 10"
              className={inputClass}
              required
            />
          </div>
        </section>

        {/* Collection details */}
        <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-charcoal">
              4. Collection details
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Let people know when and where food can be collected.{" "}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="collectionStart">
                Collection starts *
              </label>
              <input
                id="collectionStart"
                name="collectionStart"
                type="datetime-local"
                value={formData.collectionStart}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="collectionEnd">
                Collection deadline *
              </label>
              <input
                id="collectionEnd"
                name="collectionEnd"
                type="datetime-local"
                value={formData.collectionEnd}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="expiresAt">
                Listing expires at *
              </label>
              <input
                id="expiresAt"
                name="expiresAt"
                type="datetime-local"
                value={formData.expiresAt}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="collectionInstructions">
              Collection instructions *
            </label>
            <textarea
              id="collectionInstructions"
              name="collectionInstructions"
              value={formData.collectionInstructions}
              onChange={handleChange}
              placeholder="e.g. Collect at the main counter and show your reservation QR code."
              rows={3}
              className={inputClass}
              required
            />
          </div>
        </section>

        {/* Food safety */}
        <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-charcoal">
              5. Food safety information{" "}
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Help customers and charities make informed choices.
            </p>
          </div>

          <div>
            <label className={labelClass} htmlFor="ingredients">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="List the main ingredients..."
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="allergens">
              Allergens *{" "}
            </label>
            <input
              id="allergens"
              name="allergens"
              value={formData.allergens}
              onChange={handleChange}
              placeholder="e.g. Gluten, milk, eggs, nuts, or none declared"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="storageInstructions">
              {" "}
              instructions
            </label>
            <textarea
              id="storageInstructions"
              name="storageInstructions"
              value={formData.storageInstructions}
              onChange={handleChange}
              placeholder="e.g. Keep refrigerated at 5°C or below."
              rows={2}
              className={inputClass}
            />
          </div>

          <p className="rounded-xl bg-[#FFF9F0] p-4 text-xs leading-5 text-brand-muted">
            {" "}
            Please provide accurate allergen and food safety information. If
            cross-contamination information is relevant, disclose it clearly. Do
            not claim a food is allergen-free without being able to verify that.
          </p>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Link
            href="/business/listings"
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-semibold text-charcoal hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-forest px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#245747]"
          >
            Create listing →
          </button>
        </div>
      </form>
    </div>
  );
}
