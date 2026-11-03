
import Link from "next/link";

const stats = [
  {
    label: "Active listings",
    value: "8",
    change: "Currently available",
    icon: "🍱",
  },
  {
    label: "Items sold",
    value: "124",
    change: "Across all listings",
    icon: "🛍️",
  },
  {
    label: "Food saved",
    value: "86 kg",
    change: "Estimated food rescued",
    icon: "🌱",
  },
  {
    label: "Revenue generated",
    value: "R4,850",
    change: "From discounted deals",
    icon: "💰",
  },
];

const recentListings = [
  {
    id: 1,
    name: "Fresh bakery selection",
    category: "Bakery",
    price: "R45",
    originalPrice: "R90",
    quantity: 5,
    status: "Active",
  },
  {
    id: 2,
    name: "Vegetable lunch box",
    category: "Prepared meals",
    price: "R35",
    originalPrice: "R70",
    quantity: 3,
    status: "Active",
  },
  {
    id: 3,
    name: "Assorted fresh sandwiches",
    category: "Bakery",
    price: "R25",
    originalPrice: "R50",
    quantity: 0,
    status: "Sold out",
  },
];

export default function BusinessDashboard() {
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted">
            Here&apos;s what&apos;s happening with your food deals.
          </p>
        </div>

        <Link
          href="/business/listings/new"
          className="inline-flex items-center justify-center rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245747]"
        >
          + Create listing
        </Link>
      </div>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted">
                {stat.label}
              </p>
              <span className="text-2xl">{stat.icon}</span>
            </div>

            <p className="mt-4 text-3xl font-bold text-charcoal">
              {stat.value}
            </p>

            <p className="mt-2 text-xs text-muted">
              {stat.change}
            </p>
          </div>
        ))}
      </section>

      {/* Recent listings */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-charcoal">
              Recent listings
            </h2>
            <p className="mt-1 text-sm text-muted">
              A quick overview of your latest food deals.
            </p>
          </div>

          <Link
            href="/business/listings"
            className="text-sm font-semibold text-forest hover:underline"
          >
            View all listings →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-162.5 text-left">
            <thead className="bg-[#F8FAF7] text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-6 py-4 font-semibold">Listing</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Quantity</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recentListings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-6 py-5">
                    <p className="font-semibold text-charcoal">
                      {listing.name}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {listing.category}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="font-semibold text-charcoal">
                      {listing.price}
                    </p>
                    <p className="text-xs text-muted line-through">
                      {listing.originalPrice}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-sm text-charcoal">
                    {listing.quantity} available
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        listing.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Helpful message */}
      <section className="rounded-2xl bg-forest p-6 text-white">
        <p className="text-sm font-semibold text-sunset">
          GOOD FOOD DESERVES A CHANCE
        </p>
        <h2 className="mt-2 text-xl font-bold">
          Every listing makes a difference.
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
          List your closing-time and near-date deals to help more
          people enjoy good food while reducing food waste.
        </p>
      </section>
    </div>
  );
}
