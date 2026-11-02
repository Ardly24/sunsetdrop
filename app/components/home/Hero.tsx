export default function Hero() {
    return (
              <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span className="inline-flex rounded-full bg-[#F5A64A]/15 px-4 py-2 text-sm font-semibold text-[#9A5B13]">
             Great food deserves a chance.
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-forest md:text-7xl">
            <br />
            Good food. 
            <br />
            <span className="text-sunset">Better prices.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
            Discover amazing deals from local restaurants, bakeries and
            supermarkets. Enjoy your favourite food for less while helping
            reduce food waste.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#how-it-works"
              className="rounded-full bg-forest px-7 py-4 font-semibold text-white transition hover:bg-[#245747]"
            >
              Explore deals →
            </a>

            <a
              href="#about"
              className="rounded-full border border-forest/20 px-7 py-4 font-semibold text-forest transition hover:bg-forest/5"
            >
              Learn more
            </a>
          </div>

          <p className="mt-6 text-sm text-muted">
            Save food. Reduce waste. Enjoy more.
          </p>
        </div>

        {/* Visual placeholder */}
        <div className="relative flex min-h-95 items-center justify-center overflow-hidden rounded-4xl bg-forest p-8 md:min-h-120">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sunset/20 blur-2xl" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-[#FFF9F0]/10 blur-2xl" />

          <div className="relative w-full max-w-sm rounded-3xl bg-cream p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#E8F0E8] px-3 py-1 text-xs font-semibold text-forest">
                Today&apos;s deal
              </span>
              <span className="text-xs text-muted">Closing soon</span>
            </div>

            <div className="my-6 flex h-44 items-center justify-center rounded-2xl bg-[#F5E7D2] text-7xl">
              🥐
            </div>

            <h2 className="text-xl font-bold text-forest">
              Fresh bakery selection
            </h2>
            <p className="mt-2 text-sm text-muted">
              A delicious selection from your local bakery.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-forest">R45</span>
                <span className="ml-2 text-sm text-muted line-through">
                  R90
                </span>
              </div>
              <span className="rounded-full bg-sunset px-4 py-2 text-sm font-bold text-forest">
                50% off
              </span>
            </div>
          </div>
        </div>
      </section>
    )
}