"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FoodListing } from "@/types";
import { ListingStatus } from "@/app/generated/prisma/enums";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusLabels: Record<ListingStatus, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  SOLD_OUT: "Sold out",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

export default function ManageListingsPage() {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [cancelListingId, setCancelListingId] = useState<string | null>(null);

  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(
    null,
  );
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    quantityAvailable: "",
  });
  const [alertMessage, setAlertMessage] = useState<{
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch("/api/business/listings");

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();

        setListings(data.listings as FoodListing[]);

        if (loading) {
          return <p className="p-6">Loading listings...</p>;
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [loading]);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "ALL" || listing.status === filter;

    return matchesSearch && matchesFilter;
  });

  //Update listing status on the server and update the state
  async function updateStatus(id: string, status: ListingStatus) {
    try {
      const response = await fetch("/api/business/listings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update listing.");
      }

      setListings((previous) =>
        previous.map((listing) =>
          listing.id === id ? { ...listing, status } : listing,
        ),
      );
    } catch (error) {
      console.error("Update listing error:", error);
      alert(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  function handleCancel(id: string) {
    setCancelListingId(id);
  }

  async function handleSaveEdit() {
    if (!selectedListing) return;

    try {
      const response = await fetch("/api/business/listings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedListing.id,
          ...editForm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAlertMessage({
          title: "Error",
          message: data.message || "Unable to update listing.",
          type: "error",
        });
        return;
      }

      setListings((currentListings) =>
        currentListings.map((listing) =>
          listing.id === selectedListing.id ? data.listing : listing,
        ),
      );

      setAlertMessage({
        title: "Success",
        message: "Listing updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Save listing error:", error);
      setAlertMessage({
        title: "Error",
        message: "Something went wrong while updating the listing.",
        type: "error",
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">My listings</h1>
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
          {Object.values(ListingStatus).map((status) => (
            <option key={status} value={status}>
              {status
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {filteredListings.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
            <p className="font-semibold text-charcoal">No listings found</p>
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
                {/* <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F0] text-2xl">
                  {listing.category === "Bakery" ? "🥐" : "🥗"}
                </div> */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F0F5F0] text-2xl">
                  {listing.images?.length > 0 ? (
                    <Image
                      src={listing.images[0].url}
                      alt={listing.title}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                  ) : listing.category === "BAKERY" ? (
                    "🥐"
                  ) : (
                    "🥗"
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-charcoal">{listing.title}</h3>

                  <p className="mt-1 text-xs text-muted">
                    {listing.category} ·{" "}
                    {listing.type === "DONATION"
                      ? "Donation"
                      : "Discounted deal"}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    {listing.type === "DONATION" ? (
                      <span className="font-bold text-forest">FREE</span>
                    ) : (
                      <>
                        <span className="font-bold text-forest">
                          R{listing.price}
                        </span>
                        <span className="text-xs text-muted line-through">
                          R{listing.originalPrice}
                        </span>
                      </>
                    )}
                    <span className="text-xs text-muted">
                      · {listing.quantityAvailable} available
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

                {listing.status === "ACTIVE" &&
                  listing.quantityAvailable > 0 && (
                    <button
                      onClick={() => updateStatus(listing.id, "SOLD_OUT")}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-charcoal hover:bg-gray-50"
                    >
                      Mark sold out
                    </button>
                  )}

                {listing.status !== "EXPIRED" &&
                  listing.status !== "CANCELLED" &&
                  listing.status !== "SOLD_OUT" && (
                    <>
                      <button
                        onClick={() => handleCancel(listing.id)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => {
                          setSelectedListing(listing);
                          setEditForm({
                            title: listing.title,
                            description: listing.description ?? "",
                            price: String(listing.price),
                            originalPrice: String(listing.originalPrice ?? ""),
                            quantityAvailable: String(
                              listing.quantityAvailable,
                            ),
                          });
                          setIsEditDrawerOpen(true);
                        }}
                        className="rounded-lg border border-forest px-3 py-2 text-xs font-semibold text-forest hover:bg-[#F0F5F0]"
                      >
                        Edit
                      </button>
                    </>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      <Sheet
        open={isEditDrawerOpen}
        onOpenChange={(open) => {
          setIsEditDrawerOpen(open);

          if (!open) {
            setAlertMessage(null);
            setSelectedListing(null);
          }
        }}
      >
        <SheetContent
          side="right"
          className="overflow-y-auto border-l border-[#E8E2D8] bg-[#FFF9F0] text-[#26332D]"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-[#173D32]">
              Edit listing
            </SheetTitle>
            <SheetDescription className="text-sm text-[#718078]">
              Update the details of your food listing.
            </SheetDescription>
          </SheetHeader>

          {alertMessage && (
            <Alert
              className={`relative m-2 ${
                alertMessage.type === "success"
                  ? "border-green-200 bg-green-50 text-green-900"
                  : alertMessage.type === "error"
                    ? "border-red-200 bg-red-50 text-red-900"
                    : "border-yellow-200 bg-yellow-50 text-yellow-900"
              }`}
            >
              <AlertTitle>{alertMessage.title}</AlertTitle>
              <AlertDescription>{alertMessage.message}</AlertDescription>

              <button
                type="button"
                onClick={() => {
                  setAlertMessage(null);
                  setIsEditDrawerOpen(false);
                  setSelectedListing(null);
                }}
                className="absolute right-3 top-3 text-current opacity-60 hover:opacity-100"
                aria-label="Close alert and drawer"
              >
                ✕
              </button>
            </Alert>
          )}
          <div className="m-2 space-y-2">
            <label className="text-sm font-medium">Listing title</label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              className="w-full rounded-lg border border-[#D8DED8] bg-white px-3 py-2 text-sm text-[#26332D] outline-none focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
            />
          </div>

          <div className="m-2 space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              placeholder="Describe your food listing"
              rows={3}
              className="w-full rounded-lg border border-[#D8DED8] bg-white px-3 py-2 text-sm text-[#26332D] outline-none focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
            />
          </div>
          <div className="m-2 space-y-2">
            <label className="text-sm font-medium">Selling price (R)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={editForm.price}
              onChange={(e) =>
                setEditForm({ ...editForm, price: e.target.value })
              }
              placeholder="0.00"
              className="w-full rounded-lg border border-[#D8DED8] bg-white px-3 py-2 text-sm text-[#26332D] outline-none focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
            />
          </div>

          <div className="m-2 space-y-2">
            <label className="text-sm font-medium">Original price (R)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={editForm.originalPrice}
              onChange={(e) =>
                setEditForm({ ...editForm, originalPrice: e.target.value })
              }
              placeholder="0.00"
              className="w-full rounded-lg border border-[#D8DED8] bg-white px-3 py-2 text-sm text-[#26332D] outline-none focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
            />
          </div>

          <div className="m-2 space-y-2">
            <label className="text-sm font-medium">Quantity available</label>
            <input
              type="number"
              min="0"
              value={editForm.quantityAvailable}
              onChange={(e) =>
                setEditForm({ ...editForm, quantityAvailable: e.target.value })
              }
              className="w-full rounded-lg border border-[#D8DED8] bg-white px-3 py-2 text-sm text-[#26332D] outline-none focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
            />
          </div>

          <div className="m-2 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEditDrawerOpen(false);
                setAlertMessage(null);
                setSelectedListing(null);
              }}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveEdit}
              className="flex-1 rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#245344]"
            >
              Save Changes
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={cancelListingId !== null}
        onOpenChange={(open) => {
          if (!open) setCancelListingId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel listing?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this listing? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (cancelListingId) {
                  updateStatus(cancelListingId, "CANCELLED");
                }
                setCancelListingId(null);
              }}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
