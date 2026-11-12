
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function CustomerNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to check session.");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Session error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8E2D8] bg-[#FFF9F0]/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          href="/customer"
          className="shrink-0 text-2xl font-bold tracking-tight text-forest"
        >
          SunsetDrop<span className="text-sunset">.</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#26332D] md:flex">
          <Link
            href="/customer"
            className="transition hover:text-forest"
          >
            Browse deals
          </Link>

          <Link
            href="/customer/reservations"
            className="transition hover:text-forest"
          >
            My reservations
          </Link>

          <Link
            href="/customer/saved"
            className="transition hover:text-forest"
          >
            Saved items
          </Link>
        </nav>

        {/* User actions */}
        <div className="flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <>
                  <span className="hidden text-sm font-medium text-[#26332D] lg:inline">
                    Hi, {user.fullName.split(" ")[0]}
                  </span>

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245747] disabled:opacity-50"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full px-4 py-2.5 text-sm font-semibold text-forest transition hover:bg-forest/5"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245747]"
                  >
                    Join us
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <nav className="flex items-center justify-center gap-6 overflow-x-auto border-t border-[#E8E2D8] px-4 py-3 text-sm font-medium text-[#26332D] md:hidden">
        <Link href="/customer" className="whitespace-nowrap hover:text-forest">
          Browse deals
        </Link>

        <Link
          href="/customer/reservations"
          className="whitespace-nowrap hover:text-forest"
        >
          Reservations
        </Link>

        <Link
          href="/customer/saved"
          className="whitespace-nowrap hover:text-forest"
        >
          Saved
        </Link>
      </nav>
    </header>
  );
}
