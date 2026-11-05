
import Link from "next/link";
import { verifyRole } from "@/lib/dal";

const navigation = [
  {
    name: "Dashboard",
    href: "/business/dashboard",
    icon: "⌂",
  },
  {
    name: "My Listings",
    href: "/business/listings",
    icon: "▤",
  },
  {
    name: "Reservations",
    href: "/business/reservations",
    icon: "▣",
  },
];

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await verifyRole("BUSINESS");
  return (
    <div className="min-h-screen bg-[#F7F8F5] md:flex">
      {/* Sidebar */}
      <aside className="w-full border-b border-gray-200 bg-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="border-b border-gray-100 px-6 py-6">
          <Link
            href="/business/dashboard"
            className="text-2xl font-bold text-forest"
          >
            SunsetDrop<span className="text-sunset">.</span>
          </Link>
          <p className="mt-1 text-xs text-muted">
            Business Portal
          </p>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-4 md:flex-col">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-charcoal transition hover:bg-[#F0F5F0] hover:text-forest"
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden border-t border-gray-100 p-5 md:block">
          <p className="text-xs text-muted">
            Good food deserves a chance.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 md:px-10">
          <div>
            <p className="text-sm font-medium text-charcoal">
              Business workspace
            </p>
            <p className="text-xs text-muted">
              Manage your food deals
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-charcoal">
                {user.fullName}
              </p>
              <p className="text-xs text-muted">
                Business owner
              </p>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
