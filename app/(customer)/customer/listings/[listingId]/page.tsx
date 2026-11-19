"use client";

import { useEffect, useState } from "react";
import type { CustomerListing } from "@/types";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface ListingDetailsPageProps {
  params: Promise<{
    listingId: string;
  }>;
}

function formatDateTimeLocal(date: string) {
  const value = new Date(date);
  const offset = value.getTimezoneOffset();

  return new Date(value.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export default function ListingDetailsPage({
  params,
}: ListingDetailsPageProps) {
  const [listingId, setListingId] = useState("");
  const [listing, setListing] = useState<CustomerListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [collectionTime, setCollectionTime] = useState("");
  const [reserving, setReserving] = useState(false);
  const [reservationMessage, setReservationMessage] = useState("");
  const [reservationError, setReservationError] = useState("");
  const [isReserveDrawerOpen, setIsReserveDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    params.then(({ listingId }) => {
      setListingId(listingId);
    });
  }, [params]);

  useEffect(() => {
    if (!listingId) return;

    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/customer/listings/${listingId}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch listing");
        }

        setListing(data.listing);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  const handleReservation = async () => {
    if (!listing) return;

    setReserving(true);
    setReservationMessage("");
    setReservationError("");

    try {
      const response = await fetch("/api/customer/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: listing.id,
          quantity: Number(quantity),
          collectionTime: new Date(collectionTime).toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create reservation.");
      }

      setReservationMessage("Reservation created successfully!");

      setListing((prevListing) =>
        prevListing
          ? {
              ...prevListing,
              quantityAvailable:
                prevListing.quantityAvailable - Number(quantity),
            }
          : null,
      );

      setQuantity("1");
      setCollectionTime("");
    } catch (error) {
      setReservationError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-muted">Loading listing...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="text-xl font-bold text-charcoal">Listing unavailable</h2>
        <p className="mt-2 text-sm text-muted">
          {error || "This listing could not be found."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Product Image */}
        <div className="overflow-hidden rounded-3xl bg-gray-100">
          {listing.images[0]?.url ? (
            <Image
              src={listing.images[0].url}
              alt={listing.title}
              width={900}
              height={700}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-4/3 items-center justify-center text-muted">
              No image available
            </div>
          )}
        </div>

        {/* Product Information */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-forest">
            {listing.category === "PREPARED_MEALS"
              ? "Prepared Meals"
              : listing.category.replaceAll("_", " & ")}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-charcoal sm:text-4xl">
              {listing.title}
            </h1>

            <button
              onClick={() => {
                setCurrentTime(Date.now());
                setIsReserveDrawerOpen(true);
              }}
              disabled={listing.quantityAvailable < 1}
              className="rounded-xl bg-forest px-6 py-3 font-semibold text-white transition hover:bg-[#245344] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reserve Item
            </button>
          </div>

          <p className="mt-4 leading-7 text-muted">
            {listing.description || "No description available."}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-3xl font-bold text-forest">
              R{Number(listing.price).toFixed(2)}
            </span>

            {listing.originalPrice !== null && (
              <span className="text-lg text-muted line-through">
                R{Number(listing.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm text-muted">
            {listing.quantityAvailable} items available
          </p>

          <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-charcoal">Sold by</h2>

            <p className="mt-2 text-lg font-medium text-forest">
              {listing.branch.business.name}
            </p>

            <p className="mt-1 text-sm text-muted">
              {listing.branch.suburb}, {listing.branch.city}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Ingredients */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-charcoal">Ingredients</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {listing.ingredients || "Not provided"}
              </p>
            </div>

            {/* Allergens */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-charcoal">Allergens</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {listing.allergens || "Not specified"}
              </p>
            </div>

            {/* Storage */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-charcoal">
                Storage instructions
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {listing.storageInstructions || "Not provided"}
              </p>
            </div>

            {/* Collection */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-charcoal">
                Collection instructions
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {listing.collectionInstructions}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-charcoal">
              Collection details
            </h2>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-medium text-charcoal">Collection starts</p>
                <p className="mt-1 text-muted">
                  {new Date(listing.collectionStartsAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="font-medium text-charcoal">Collection ends</p>
                <p className="mt-1 text-muted">
                  {new Date(listing.collectionEndsAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="font-medium text-charcoal">Collection address</p>
                <p className="mt-1 text-muted">
                  {listing.branch.address}
                  {listing.branch.suburb && `, ${listing.branch.suburb}`},{" "}
                  {listing.branch.city}, {listing.branch.country}
                </p>
              </div>

              <div>
                <p className="font-medium text-charcoal">Contact number</p>
                <p className="mt-1 text-muted">{listing.branch.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={isReserveDrawerOpen} onOpenChange={setIsReserveDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-md p-6"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-[#173D32]">Reserve Item</SheetTitle>
            <SheetDescription className="text-sm text-[#718078]">
              Reserve {listing.title} for collection at your preferred time.
            </SheetDescription>
          </SheetHeader>

          {reservationMessage && (
            <p className="mt-4 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
              {reservationMessage}
            </p>
          )}

          {reservationError && (
            <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
              {reservationError}
            </p>
          )}

          <div className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal">
                Quantity
              </label>

              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "") {
                    setQuantity("");
                    return;
                  }

                  const number = Number(value);

                  if (
                    Number.isInteger(number) &&
                    number >= 1 &&
                    number <= listing.quantityAvailable
                  ) {
                    setQuantity(value);
                  }
                }}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
              />

              <p className="mt-1 text-xs text-brand-muted">
                {listing.quantityAvailable} items available
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal">
              Collection time
            </label>

            <input
              type="datetime-local"
              min={formatDateTimeLocal(
                new Date(
                  Math.max(
                    new Date(listing.collectionStartsAt).getTime(),
                    currentTime ??
                      new Date(listing.collectionStartsAt).getTime(),
                  ),
                ).toISOString(),
              )}
              max={formatDateTimeLocal(listing.collectionEndsAt)}
              value={collectionTime}
              onChange={(e) => setCollectionTime(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
            />

            <p className="mt-1 text-xs text-brand-muted">
              Choose a time within the collection window.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Total</span>

              <span className="text-xl font-bold text-forest">
                R{(Number(listing.price) * Number(quantity)).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleReservation}
              disabled={
                reserving ||
                Number(quantity) < 1 ||
                Number(quantity) > listing.quantityAvailable ||
                !collectionTime
              }
              className="mt-5 w-full rounded-xl bg-forest px-6 py-3 font-semibold text-white transition hover:bg-[#245344] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {reserving ? "Reserving..." : "Confirm Reservation"}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
