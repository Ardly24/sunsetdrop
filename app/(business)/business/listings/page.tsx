
"use client";

import { useState } from "react";
import Link from "next/link";
import { FoodListing, ListingStatus } from "@/types";


const initialListings: FoodListing[] = [
  {
    id: '1',
    title: "Fresh bakery selection",
    category: "Bakery",
    originalPrice: 90,
    discountedPrice: 45,
    quantity: 5,
    status: "ACTIVE",
    type: "DISCOUNTED",
    businessId: "1",
    locationId: "1",
    description: "A selection of freshly baked goods.",
    collectionStart: "2024-06-01T10:00:00Z",
    collectionEnd: "2024-06-01T12:00:00Z",
    createdAt: "2024-05-30T08:00:00Z",
    updatedAt: "2024-05-30T08:00:00Z",
  },

  {
    id: '2',
    title: "Vegetable lunch box",
    category: "Prepared meals",
    originalPrice: 70,
    discountedPrice: 35,
    quantity: 3,
    status: "ACTIVE",
    type: "DISCOUNTED",
    businessId: "1",
    locationId: "1",
    description: "A healthy selection of vegetables.",
    collectionStart: "2024-06-01T10:00:00Z",
    collectionEnd: "2024-06-01T12:00:00Z",
    createdAt: "2024-05-30T08:00:00Z",
    updatedAt: "2024-05-30T08:00:00Z",
  },
  {
    id: '3',
    title: "Assorted fresh sandwiches",
    category: "Bakery",
    originalPrice: 50,
    discountedPrice: 25,
    quantity: 0,
    status: "SOLD_OUT",
    type: "DISCOUNTED",
    businessId: "1",
    locationId: "1",
    description: "A variety of fresh sandwiches.",
    collectionStart: "2024-06-01T10:00:00Z",
    collectionEnd: "2024-06-01T12:00:00Z",
    createdAt: "2024-05-30T08:00:00Z",
    updatedAt: "",
  },

  {
    id: '4',
    title: "Fresh fruit donation box",
    category: "Fruits & vegetables",
    originalPrice: 0,
    discountedPrice: 0,
    quantity: 10,
    status: "ACTIVE",
    type: "DONATION",
    businessId: "1",
    locationId: "1",
    description: "A box of assorted fresh fruits for donation.",
    collectionStart: "2024-06-01T10:00:00Z",
    collectionEnd: "2024-06-01T12:00:00Z",
    createdAt: "2024-05-30T08:00:00Z",
    updatedAt: "2024-05-30T08:00:00Z",
  },
  {
    id: '5',
    title: "Evening pastry selection",
    category: "Bakery",
    originalPrice: 80,
    discountedPrice: 40,
    quantity: 4,
    status: "PAUSED",
    type: "DISCOUNTED",
    businessId: "1",
    locationId: "1",
    description: "A selection of pastries for the evening.",
    collectionStart: "2024-06-01T10:00:00Z",
    collectionEnd: "2024-06-01T12:00:00Z",
    createdAt: "2024-05-30T08:00:00Z",
    updatedAt: "2024-05-30T08:00:00Z",
  },
];

const statusLabels: Record<ListingStatus, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  SOLD_OUT: "Sold out",
  EXPIRED: "Expired",
};

export default function ManageListingsPage() {
  const [listings, setListings] = useState(initialListings);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || listing.status === filter;

    return matchesSearch && matchesFilter;
  });

  function updateStatus(id: string, status: ListingStatus) {
    setListings((previous) =>
      previous.map((listing) =>
        listing.id === id ? { ...listing, status } : listing
      )
    );
  }

  function handleCancel(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this listing?"
    );

    if (confirmed) {
      updateStatus(id, "EXPIRED");
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">
            My listings
          </h1>
          <p className="mt-2 text-sm text-muted">
            Manage your food deals and donations.
          </p>
        </div>

        <Link
          href="/business/listings/new"
          className="rounded-xl bg-forest px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#245747]"
        >
          + Create listing
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total listings",
            value: listings.length,
          },
          {
            label: "Active",
            value: listings.filter((item) => item.status === "ACTIVE").length,
          },
          {
            label: "Paused",
            value: listings.filter((item) => item.status === "PAUSED").length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold text-charcoal">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search listings..."
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-forest sm:flex-1"
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-forest"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="SOLD_OUT">Sold out</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {filteredListings.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
            <p className="font-semibold text-charcoal">
              No listings found
            </p>
            <p className="mt-2 text-sm text-muted">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col justify-between gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:flex-row lg:items-center"
            >
              {/* Listing details */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F0] text-2xl">
                  {listing.category === "Bakery" ? "🥐" : "🥗"}
                </div>

                <div>
                  <h3 className="font-bold text-charcoal">
                    {listing.title}
                  </h3>

                  <p className="mt-1 text-xs text-muted">
                    {listing.category} · {listing.type === "DONATION" ? "Donation" : "Discounted deal"}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    {listing.type === "DONATION" ? (
                      <span className="font-bold text-forest">
                        FREE
                      </span>
                    ) : (
                      <>
                        <span className="font-bold text-forest">
                          R{listing.discountedPrice}
                        </span>
                        <span className="text-xs text-muted line-through">
                          R{listing.originalPrice}
                        </span>
                      </>
                    )}
                    <span className="text-xs text-muted">
                      · {listing.quantity} available
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and actions */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    listing.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : listing.status === "PAUSED"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {statusLabels[listing.status]}
                </span>

                {listing.status === "ACTIVE" && (
                  <button
                    onClick={() => updateStatus(listing.id, "PAUSED")}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-charcoal hover:bg-gray-50"
                  >
                    Pause
                  </button>
                )}

                {listing.status === "PAUSED" && (
                  <button
                    onClick={() => updateStatus(listing.id, "ACTIVE")}
                    className="rounded-lg border border-forest px-3 py-2 text-xs font-semibold text-forest hover:bg-[#F0F5F0]"
                  >
                    Resume
                  </button>
                )}

                {listing.status === "ACTIVE" && listing.quantity > 0 && (
                  <button
                    onClick={() => updateStatus(listing.id, "SOLD_OUT")}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-charcoal hover:bg-gray-50"
                  >
                    Mark sold out
                  </button>
                )}

                {listing.status !== "EXPIRED" &&
                  listing.status !== "SOLD_OUT" && (
                    <button
                      onClick={() => handleCancel(listing.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
