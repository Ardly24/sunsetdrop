
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loggingOut}
      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-charcoal transition hover:bg-gray-100 disabled:opacity-50"
    >
      {loggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
