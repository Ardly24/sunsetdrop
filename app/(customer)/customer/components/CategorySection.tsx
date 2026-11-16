
import { FoodCategory } from "@/app/generated/prisma/enums";

interface CategorySectionProps {
  selectedCategory: FoodCategory | "ALL";
  onCategoryChange: (category: FoodCategory | "ALL") => void;
}

const categories = [
  { value: "ALL", label: "All deals", icon: "🍽️" },
  { value: FoodCategory.BAKERY, label: "Bakery", icon: "🥐" },
  { value: FoodCategory.PREPARED_MEALS, label: "Prepared Meals", icon: "🍱" },
  { value: FoodCategory.FRUITS_VEGETABLES, label: "Fruits & Vegetables", icon: "🥑" },
  { value: FoodCategory.DAIRY, label: "Dairy", icon: "🥛" },
  { value: FoodCategory.MEAT_SEAFOOD, label: "Meat & Seafood", icon: "🥩" },
  { value: FoodCategory.GROCERIES, label: "Groceries", icon: "🛒" },
  { value: FoodCategory.OTHER, label: "Other", icon: "📦" },
];

export default function CategorySection({
  selectedCategory,
  onCategoryChange,
}: CategorySectionProps) {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-bold text-charcoal">
        Explore categories
      </h2>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-3">
        {categories.map((category) => {
          const isActive = selectedCategory === category.value;

          return (
            <button
              key={category.value}
              onClick={() =>
                onCategoryChange(category.value as FoodCategory | "ALL")
              }
              className={`flex shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition ${
                isActive
                  ? "border-forest bg-forest text-white"
                  : "border-gray-200 bg-white text-charcoal hover:border-forest"
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
