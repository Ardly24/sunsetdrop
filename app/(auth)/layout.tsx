
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col bg-cream">
      <header className="border-b border-forest/10 px-6 py-5">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-forest"
          >
            SunsetDrop<span className="text-sunset">.</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </div>
    </main>
  );
}
