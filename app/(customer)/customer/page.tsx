"use client";

import { useEffect, useState } from "react";
import type { CustomerListing } from "@/types/listing";
import HeroSection from "./components/HeroSection";
import CategorySection from "./components/CategorySection";
import { FoodCategory } from "@/app/generated/prisma/enums";
import FeaturedDeals from "./components/FeaturedDeals";

export default function CustomerPage() {
  const [listings, setListings] = useState<CustomerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
  FoodCategory | "ALL"
>("ALL");

  useEffect(() => {
  async function fetchListings() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/customer/listings");

      if (!response.ok) {
        throw new Error("Failed to load food listings.");
      }

      const data = await response.json();

      setListings(data.listings);
    } catch (error) {
      console.error("Customer listings error:", error);
      setError("Unable to load food listings. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  fetchListings();
}, []);

const filteredListings = listings.filter((listing) => {
  const matchesSearch =
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.branch.business.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

  const matchesCategory =
    selectedCategory === "ALL" ||
    listing.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

  return (
  <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
    {/* Hero Section */}
    <HeroSection
     searchQuery={searchQuery}
     onSearchChange={setSearchQuery}
    />
    <CategorySection
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
/>
    

  {/* Listings Section */}
  <FeaturedDeals
  listings={filteredListings}
  loading={loading}
  error={error}
/>
  </div>
);
}