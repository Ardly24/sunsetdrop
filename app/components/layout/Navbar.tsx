
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

export default function Navbar() {
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
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-2xl font-bold tracking-tight text-forest">
        SunsetDrop<span className="text-sunset">.</span>
      </Link>

      <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
        <Link href="/#how-it-works" className="transition hover:text-forest">
          How it works
        </Link>

        <Link href="/#about" className="transition hover:text-forest">
          About us
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        {!loading && (
          <>
            {user ? (
              <>
                <span className="hidden text-sm font-medium sm:inline">
                  Hi, {user.fullName}
                </span>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245747] disabled:opacity-50"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-3 text-sm font-semibold text-forest transition hover:bg-gray-100"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245747]"
                >
                  Register
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}

