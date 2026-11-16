import Image from "next/image";
import type { CustomerListing } from "@/types";
import Link from "next/link";

interface ListingCardProps {
  listing: CustomerListing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
  <Link
    href={`/customer/listings/${listing.id}`}
    className="block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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
          {listing.category === "PREPARED_MEALS"
            ? "Prepared Meals"
            : listing.category.replaceAll("_", " & ")}
        </p>

        <h3 className="mt-2 font-semibold text-charcoal">{listing.title}</h3>

        <p className="mt-1 text-sm text-muted">
          {listing.branch.business.name} · {listing.branch.suburb} · {listing.branch.city}
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
    </Link>
  );
}
