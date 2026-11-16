
import { CustomerListing  } from "@/types";
import Image from "next/image";

interface FeaturedDealsProps {
  listings: CustomerListing[];
  loading: boolean;
  error: string | null;
}

export default function FeaturedDeals({
  listings,
  loading,
  error,
}: FeaturedDealsProps) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">
            Fresh deals near you
          </h2>
          <p className="mt-1 text-sm text-muted">
            Discover food deals from local businesses.
          </p>
        </div>

        <span className="text-sm font-medium text-forest">
          {listings.length} deals
        </span>
      </div>

      {loading ? (
        <p className="mt-8 text-muted">Loading delicious deals...</p>
      ) : error ? (
        <p className="mt-8 text-red-600">{error}</p>
      ) : listings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <h3 className="text-lg font-semibold text-charcoal">
            No deals found
          </h3>
          <p className="mt-2 text-sm text-muted">
            Try another search or category.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="aspect-4/3 bg-gray-100">
                {listing.images[0]?.url ? (
                  <Image
                    src={listing.images[0].url}
                    alt={listing.title}
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">
                    No image available
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-forest">
                  {listing.category.replaceAll("_", " ")}
                </p>

                <h3 className="mt-2 font-semibold text-charcoal">
                  {listing.title}
                </h3>

                <p className="mt-1 text-sm text-muted">
                  {listing.branch.business.name} · {listing.branch.city}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-forest">
                    R{Number(listing.price).toFixed(2)}
                  </span>

                  {listing.originalPrice !== null && (
                    <span className="text-sm text-muted line-through">
                      R{Number(listing.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs text-muted">
                  {listing.quantityAvailable} available
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
