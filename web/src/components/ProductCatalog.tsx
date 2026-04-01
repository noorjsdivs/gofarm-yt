"use client";

import { useMemo, useState } from "react";
import { BRANDS_QUERY_RESULT, Category, Product } from "../../sanity.types";
import {
  ChevronDown,
  Grid3X3,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AnimatePresence, motion } from "motion/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./product/ProductCard";
import { cn } from "@/lib/utils";

interface Props {
  initialProducts: Product[];
  categories: Category[];
  brands: BRANDS_QUERY_RESULT;
}

type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-low"
  | "price-high"
  | "newest"
  | "popular";

const ProductCatalog = ({ initialProducts, categories, brands }: Props) => {
  const [products] = useState<Product[]>(initialProducts);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState({
    categories: true,
    brands: true,
    price: true,
  });

  // Calculate price range from products
  const maxPrice = useMemo(() => {
    const prices = products.map((p) => p.price || 0);
    return Math.max(...prices) || 1000;
  }, [products]);

  // Filter and sort products - Using useMemo for better performance
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const lowerSearchQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(lowerSearchQuery) ||
          product.description?.toLowerCase().includes(lowerSearchQuery),
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        product.categories?.some((cat) =>
          selectedCategories.includes(cat._ref),
        ),
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand?._ref || ""),
      );
    }

    // Price filter
    const [minPrice, maxPrice] = priceRange;
    filtered = filtered.filter((product) => {
      const price = product.price || 0;
      return price >= minPrice && price <= maxPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "newest":
          return (
            new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    products,
    searchQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    sortBy,
  ]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setSortBy("name-asc");
  };

  // Get active filter count
  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    selectedCategories.length +
    selectedBrands.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  // Handle category toggle
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };
  // Handle brand toggle
  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg border border-border border-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            {searchQuery ? (
              <X
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 hover:cursor-pointer"
              />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            )}
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Sort */}
            <Select
              value={sortBy}
              onValueChange={(value: SortOption) => setSortBy(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="price-low">Price Low to High</SelectItem>
                <SelectItem value="price-high">Price High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "large" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("large")}
                className="rounded-l-none"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 px-1.5 py-0.5 text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <span className="text-sm font-medium text-gray-600">
              Active filters:
            </span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            {selectedCategories.map((catId) => {
              const category = categories.find((c) => c._id === catId);
              return category ? (
                <Badge key={catId} variant="secondary" className="gap-1">
                  {category.title}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => toggleCategory(catId)}
                  />
                </Badge>
              ) : null;
            })}
            {selectedBrands.map((brandId) => {
              const brand = brands.find((b) => b._id === brandId);
              return brand ? (
                <Badge key={brandId} variant="secondary" className="gap-1">
                  {brand.title}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => toggleBrand(brandId)}
                  />
                </Badge>
              ) : null;
            })}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <Badge variant="secondary" className="gap-1">
                ${priceRange[0]} - ${priceRange[1]}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setPriceRange([0, maxPrice])}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="ml-auto"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-72 md:w-80 bg-white rounded-lg border border-border shadow-sm p-6 h-fit sticky top-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3>Filters</h3>
                <Button
                  onClick={() => setShowFilters(false)}
                  variant={"ghost"}
                  size={"sm"}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-6">
                {/* Categories */}
                <Collapsible
                  open={isFilterOpen.categories}
                  onOpenChange={(open) =>
                    setIsFilterOpen((prev) => ({ ...prev, categories: open }))
                  }
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <span className="font-medium">Categories</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isFilterOpen.categories ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={category._id}
                          checked={selectedCategories.includes(category._id)}
                          onCheckedChange={() => toggleCategory(category._id)}
                        />
                        <label
                          htmlFor={category._id}
                          className="text-sm flex-1 cursor-pointer"
                        >
                          {category.title}
                        </label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Brands */}
                <Collapsible
                  open={isFilterOpen.brands}
                  onOpenChange={(open) =>
                    setIsFilterOpen((prev) => ({ ...prev, brands: open }))
                  }
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <span className="font-medium">Brands</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isFilterOpen.brands ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-2">
                    {brands.map((brand) => (
                      <div
                        key={brand._id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={brand._id}
                          checked={selectedBrands.includes(brand._id)}
                          onCheckedChange={() => toggleBrand(brand._id)}
                        />
                        <label
                          htmlFor={brand._id}
                          className="text-sm flex-1 cursor-pointer"
                        >
                          {brand.title}
                        </label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* Price Range */}
                <Collapsible
                  open={isFilterOpen.price}
                  onOpenChange={(open) =>
                    setIsFilterOpen((prev) => ({ ...prev, price: open }))
                  }
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <span className="font-medium">Price Range</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isFilterOpen.price ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-4">
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={(value) =>
                          setPriceRange(value as [number, number])
                        }
                        max={maxPrice}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Products Grid */}
        <div className="flex-1">
          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing {filteredProducts?.length} of {products.length}
            </p>
          </div>
          {/* Products List */}
          {loading ? (
            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              <AnimatePresence>
                {filteredProducts?.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <NoProductAvailable />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
