import { CustomerListing  } from "@/types";
import ListingCard from "./ListingCard";

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
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  );
}
