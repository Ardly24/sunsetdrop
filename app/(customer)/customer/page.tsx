"use client";

import { useEffect, useState } from "react";
import type { CustomerListing } from "@/types/listing";
import Image from "next/image";

export default function CustomerPage() {
  const [listings, setListings] = useState<CustomerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function fetchListings() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/customer/listings");

      if (!response.ok) {
        throw new Error("Failed to load food listings.");
      }

      const data = await response.json();

      setListings(data.listings);
    } catch (error) {
      console.error("Customer listings error:", error);
      setError("Unable to load food listings. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  fetchListings();
}, []);

  return (
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    {/* Hero Section */}
    <section className="rounded-3xl bg-forest px-6 py-12 text-white sm:px-10 lg:py-16">
      <div className="max-w-3xl">
        <p className="mb-2 text-sm font-medium text-sunset">
          GOOD FOOD. BETTER PRICES.
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Discover great food deals near you.
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-6 text-white/80 sm:text-base">
          Find delicious food at better prices while helping reduce food waste.
        </p>
      </div>
    </section>

    {/* Listings Section */}
    <section className="mt-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">
            Fresh deals near you
          </h2>
          <p className="mt-1 text-sm text-muted">
            Discover food deals from local businesses.
          </p>
        </div>

        <span className="text-sm font-medium text-forest">
          {listings.length} deals
        </span>
      </div>

      {loading ? (
        <p className="mt-8 text-muted">Loading delicious deals...</p>
      ) : error ? (
        <p className="mt-8 text-red-600">{error}</p>
      ) : listings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <h3 className="text-lg font-semibold text-charcoal">
            No deals available yet
          </h3>
          <p className="mt-2 text-sm text-muted">
            Check back soon. New food deals will appear here!
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="aspect-4/3 bg-gray-100">
                {listing.images[0]?.url ? (
                  <Image
                    src={listing.images[0].url}
                    alt={listing.title}
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">
                    No image available
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-forest">
                  {listing.category.replaceAll("_", " ")}
                </p>

                <h3 className="mt-2 font-semibold text-charcoal">
                  {listing.title}
                </h3>

                <p className="mt-1 text-sm text-muted">
                  {listing.branch.business.name} · {listing.branch.suburb} · {listing.branch.city}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-forest">
                    R{Number(listing.price).toFixed(2)}
                  </span>

                  {listing.originalPrice !== null && (
                    <span className="text-sm text-muted line-through">
                      R{Number(listing.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs text-muted">
                  {listing.quantityAvailable} available
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  </div>
);
}