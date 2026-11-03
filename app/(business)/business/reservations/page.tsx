
"use client";

import { useState } from "react";
import { Reservation, ReservationStatus } from "@/types";


const initialReservations: Reservation[] = [
  {
    id: "RES-001",
    customerId: "CUS-001",
    listingId: "LIST-001",
    quantity: 2,
    collectionTime: "Today, 16:30",
    status: "PENDING",
    createdAt: "2024-05-30T08:00:00Z",
    updatedAt: "2024-05-30T08:00:00Z",
  },
  {
    id: "RES-002",
    customerId: "CUS-002",
    listingId: "LIST-002",
    quantity: 1,
    collectionTime: "Today, 17:00",
    status: "CONFIRMED",
    createdAt: "2024-05-30T08:00:00Z",
    updatedAt: "2024-05-30T08:00:00Z",  
  },
  {
    id: "RES-003",
    customerId: "CUS-003",
    listingId: "LIST-003",
    quantity: 3,
    collectionTime: "Today, 15:30",
    status: "COLLECTED",
    createdAt: "2024-05-30T08:00:00Z",
    updatedAt: "2024-05-30T08:00:00Z",
  },
  {
    id: "RES-004",
    customerId: "CUS-004",
    listingId: "LIST-004",
    quantity: 1,
    collectionTime: "Tomorrow, 10:00",
    status: "CANCELLED",
    createdAt: "2024-05-30T08:00:00Z",
    updatedAt: "2024-05-30T08:00:00Z",
  },
];

const statusStyles: Record<ReservationStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  COLLECTED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState(initialReservations);
  const [filter, setFilter] = useState("ALL");

  function updateStatus(id: string, status: ReservationStatus) {
    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === id
          ? { ...reservation, status }
          : reservation
      )
    );
  }

  const filteredReservations = reservations.filter(
    (reservation) =>
      filter === "ALL" || reservation.status === filter
  );

  const pendingCount = reservations.filter(
    (reservation) => reservation.status === "PENDING"
  ).length;

  const confirmedCount = reservations.filter(
    (reservation) => reservation.status === "CONFIRMED"
  ).length;

  const collectedCount = reservations.filter(
    (reservation) => reservation.status === "COLLECTED"
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-forest">
          Reservations
        </h1>
        <p className="mt-2 text-muted">
          Manage customer reservations and food collections.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard title="Pending" value={pendingCount} />
        <SummaryCard title="Confirmed" value={confirmedCount} />
        <SummaryCard title="Collected" value={collectedCount} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "PENDING", "CONFIRMED", "COLLECTED", "CANCELLED"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === status
                  ? "bg-forest text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status === "ALL" ? "All reservations" : status}
            </button>
          )
        )}
      </div>

      {/* Reservations */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-forest">
            Customer reservations
          </h2>
        </div>

        {filteredReservations.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">
            No reservations found.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-forest">
                    {reservation.customerId}
                  </p>
                  <p className="text-sm text-muted">
                    {reservation.collectionTime}
                  </p>
                  <p className="pt-2 text-sm font-medium text-charcoal">
                    {reservation.listingId}
                  </p>
                  <p className="text-sm text-muted">
                    Quantity: {reservation.quantity} · Collection:{" "}
                    {reservation.collectionTime}
                  </p>
                  <p className="text-xs text-gray-400">
                    {reservation.id}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[reservation.status]}`}
                  >
                    {reservation.status}
                  </span>

                  {reservation.status === "PENDING" && (
                    <button
                      onClick={() =>
                        updateStatus(reservation.id, "CONFIRMED")
                      }
                      className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-[#245747]"
                    >
                      Confirm
                    </button>
                  )}

                  {reservation.status === "CONFIRMED" && (
                    <button
                      onClick={() =>
                        updateStatus(reservation.id, "COLLECTED")
                      }
                      className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-[#245747]"
                    >
                      Mark collected
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-2 text-3xl font-bold text-forest">{value}</p>
    </div>
  );
}
