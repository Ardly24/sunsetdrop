
interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function HeroSection({
  searchQuery,
  onSearchChange,
}: HeroSectionProps) {
  return (
    <section className="rounded-3xl bg-forest px-4 py-4 text-white sm:px-10 lg:py-8">
      <div className="max-w-4xl">
        <p className="mb-2 text-sm font-medium text-sunset">
          GOOD FOOD. BETTER PRICES.
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Discover great food deals near you.
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-6 text-white/80 sm:text-base">
          Find delicious food at better prices while helping reduce food waste.
        </p>

         <div className="mt-3 flex items-center gap-3 rounded-xl bg-white px-4 py-3">
          <span className="text-gray-400">⌕</span>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search food or businesses..."
            className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-gray-400"
          />
        </div>
      </div>
    </section>
  );
}
