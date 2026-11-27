"use client";

import { useEffect, useRef, useState } from "react";
import { BusinessReservation, ReservationStatus } from "@/types";
import ReservationQRScanner from "../components/ReservationQRScanner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const statusStyles: Record<ReservationStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  COLLECTED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<BusinessReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [verifyingQR, setVerifyingQR] = useState(false);

  const verificationInProgressRef = useRef(false);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch("/api/business/reservations");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch reservations.");
        }

        setReservations(data.reservations);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);

  async function startScanner() {
    setScanResult("");
    setScannerOpen(true);
  }

  async function handleVerifyQR(token: string) {
    if (verificationInProgressRef.current) return;

    verificationInProgressRef.current = true;
    setVerifyingQR(true);
    setScanResult("");

    try {
      const response = await fetch("/api/business/reservations/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "QR verification failed.");
      }

      setScanResult("Collection verified successfully!");

      const reservationsResponse = await fetch("/api/business/reservations");

      if (reservationsResponse.ok) {
        const reservationsData = await reservationsResponse.json();
        setReservations(reservationsData.reservations);
      }

      setScannerOpen(false);
    } catch (error) {
      setScanResult(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setVerifyingQR(false);
    }
  }

  async function updateStatus(id: string, status: ReservationStatus) {
    try {
      const response = await fetch("/api/business/reservations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update reservation.");
      }

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id
            ? { ...reservation, status: data.reservation.status }
            : reservation,
        ),
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  const filteredReservations = reservations.filter(
    (reservation) => filter === "ALL" || reservation.status === filter,
  );

  const pendingCount = reservations.filter(
    (reservation) => reservation.status === "PENDING",
  ).length;

  const confirmedCount = reservations.filter(
    (reservation) => reservation.status === "CONFIRMED",
  ).length;

  const collectedCount = reservations.filter(
    (reservation) => reservation.status === "COLLECTED",
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-forest">Reservations</h1>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <p className="text-muted">
            Manage customer reservations and food collections.
          </p>

          <button
            onClick={startScanner}
            className="rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245747]"
          >
            Scan Collection QR
          </button>
        </div>
      </div>

      <ReservationQRScanner
        scannerOpen={scannerOpen}
        scanResult={scanResult}
        onClose={() => setScannerOpen(false)}
        onVerify={handleVerifyQR}
        onScanResult={setScanResult}
        verifyingQR={verifyingQR}
      />

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
          ),
        )}
      </div>

      {/* Reservations */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {loading ? (
          <p className="p-8 text-center text-sm text-muted">
            Loading reservations...
          </p>
        ) : error ? (
          <p className="p-8 text-center text-sm text-red-600">{error}</p>
        ) : (
          <>
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
                        {reservation.customer.fullName}
                      </p>
                      <p className="pt-2 text-sm font-medium text-charcoal">
                        {reservation.listing.title}
                      </p>
                      <p className="text-sm text-muted">
                        Quantity: {reservation.quantity} · Collection:{" "}
                        {new Date(reservation.collectionTime).toLocaleString(
                          "en-ZA",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                            timeZone: "Africa/Johannesburg",
                          },
                        )}
                      </p>
                      <p className="text-xs text-gray-400">
                        Reservation reference: {reservation.id}
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  const styles = {
    Pending: {
      icon: "clock",
      color: "text-amber-600",
      background: "bg-amber-50",
      description: "Awaiting confirmation",
    },
    Confirmed: {
      icon: "check",
      color: "text-emerald-700",
      background: "bg-emerald-50",
      description: "Ready for collection",
    },
    Collected: {
      icon: "package",
      color: "text-slate-600",
      background: "bg-slate-100",
      description: "Successfully collected",
    },
  }[title] ?? {
    icon: "clock",
    color: "text-forest",
    background: "bg-gray-100",
    description: "Reservation overview",
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-muted">
          {title}
        </CardTitle>

        <div className={`rounded-xl p-2 ${styles.background}`}>
          <span className={`text-lg font-bold ${styles.color}`}>
            {styles.icon === "clock"
              ? "⌛"
              : styles.icon === "check"
                ? "✓"
                : "📦"}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold tracking-tight text-forest">{value}</p>
        <CardDescription className="mt-1">{styles.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
