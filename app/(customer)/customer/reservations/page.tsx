"use client";

import { useState, useEffect } from "react";
import type { CustomerReservation } from "@/types";
import Image from "next/image";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<CustomerReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("/api/customer/reservations");

        if (!response.ok) {
          throw new Error("Failed to fetch reservations.");
        }

        const data = await response.json();

        setReservations(data.reservations);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancelReservation = async (reservationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?",
    );

    if (!confirmed) return;
    setCancellingId(reservationId);

    try {
      const response = await fetch("/api/customer/reservations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reservationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel reservation.");
      }

      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: "CANCELLED" }
            : reservation,
        ),
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF9F0] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {loading && (
          <p className="mt-8 text-[#718078]">Loading your reservations...</p>
        )}

        {error && <p className="mt-8 text-red-600">{error}</p>}

        {!loading && !error && reservations.length === 0 && (
          <div className="mt-10 rounded-2xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-[#173D32]">
              No reservations yet
            </h2>

            <p className="mt-2 text-[#718078]">
              Explore available deals and reserve your favourite food.
            </p>
          </div>
        )}
        <h1 className="text-3xl font-bold text-[#173D32]">My Reservations</h1>

        <p className="mt-2 text-[#718078]">
          Keep track of your food reservations and collection details.
        </p>

        {!loading && !error && reservations.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Product image */}
                <div className="aspect-4/3 bg-gray-100">
                  {reservation.listing.images[0]?.url ? (
                    <Image
                      src={reservation.listing.images[0].url}
                      alt={reservation.listing.title}
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

                {/* Reservation details */}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-forest">
                      {reservation.listing.category === "PREPARED_MEALS"
                        ? "Prepared Meals"
                        : reservation.listing.category.replaceAll("_", " & ")}
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        reservation.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : reservation.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : reservation.status === "COLLECTED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {reservation.status.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="mt-2 font-semibold text-charcoal">
                    {reservation.listing.title}
                  </h3>

                  <p className="mt-1 text-sm text-muted">
                    {reservation.listing.branch.business.name}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-forest">
                      R
                      {(
                        Number(reservation.listing.price) * reservation.quantity
                      ).toFixed(2)}
                    </span>

                    <span className="text-sm text-muted">
                      Qty: {reservation.quantity}
                    </span>
                  </div>

                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="text-xs text-muted">Collection time</p>

                    <p className="mt-1 text-sm font-medium text-charcoal">
                      {new Date(reservation.collectionTime).toLocaleString(
                        "en-ZA",
                      )}
                    </p>

                    <p className="mt-2 text-xs text-muted">
                      {reservation.listing.branch.address},{" "}
                      {reservation.listing.branch.suburb},{" "}
                      {reservation.listing.branch.city}
                    </p>
                  </div>

                  {["PENDING", "CONFIRMED"].includes(reservation.status) && (
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      disabled={cancellingId === reservation.id}
                      className="mt-4 w-full rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
