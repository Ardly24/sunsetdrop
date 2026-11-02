import Link from 'next/link'

export default function Navbar() {
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

      <Link
        href="/#how-it-works"
        className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245747]"
      >
        Explore deals
      </Link>
    </header>
  );
}
