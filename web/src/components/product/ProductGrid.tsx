/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { ALL_PRODUCTS_QUERY_RESULT } from "../../../sanity.types";
import { client } from "@/sanity/lib/client";
import { Button } from "../ui/button";
import Container from "../Container";
import ProductTypeCarousel from "./ProductTypeCarousel";
import HomeTabbar from "./HomeTabbar";
import { ProductGridSkeleton } from "./ProductSkeletons";
import { AnimatePresence, motion } from "motion/react";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";

type ViewMode = "grid-2" | "grid-3" | "grid-4" | "grid-5" | "list";
type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";

interface ProductVariant {
  _id: string;
  title: string;
  slug: { current: string };
  isActive: boolean;
  weight: number;
}

const ProductGrid = () => {
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERY_RESULT>([]);
  const [filteredProducts, setFilteredProducts] =
    useState<ALL_PRODUCTS_QUERY_RESULT>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [productsByVariant, setProductsByVariant] = useState<
    Record<string, ALL_PRODUCTS_QUERY_RESULT>
  >({});
  const [loading, setLoading] = useState(false);
  const [variantsLoading, setVariantsLoading] = useState(true);
  const [carouselsLoading, setCarouselsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid-5");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [productsPerPage] = useState(20);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [stockStatus, setStockStatus] = useState<string>("all");
  const [rating, setRating] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  //   Fetch product variants from Sanity
  const fetchVariants = async () => {
    setVariantsLoading(true);
    try {
      const varaintsQuery = `*[_type == "productVariant" && isActive == true] | order(weight asc){
        _id, title, slug, isActive, weight}`;

      const variants = await client.fetch(varaintsQuery);
      setProductVariants(variants);
      if (variants.length > 0) {
        setSelectedTab(variants[0]._id);
      }
    } catch (error) {
      console.error("Error fetching product variants:", error);
    } finally {
      setVariantsLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  //   Fetch Prouducts for each variant (for carousels)
  useEffect(() => {
    const fetchProductsByVariant = async () => {
      if (productVariants?.length === 0) return;
      setCarouselsLoading(true);

      try {
        const productsByVariantData: Record<string, ALL_PRODUCTS_QUERY_RESULT> =
          {};
        //   Fetch products for each variant
        for (const variant of productVariants) {
          const query = `*[_type == "product" && references($variantId)] | order(_createdAt desc) [0...10] {
            ...,
            "categories": categories[]->title,
            "variant": variant->{title, slug}
          }`;
          const products = await client.fetch(query, {
            variantId: variant._id,
          });
          productsByVariantData[variant._id] = products;
        }
        setProductsByVariant(productsByVariantData);
      } catch (error) {
        console.log("Error fetching products by variant:", error);
      } finally {
        setCarouselsLoading(false);
      }
    };
    fetchProductsByVariant();
  }, [productVariants]);
  const query = `*[_type == "product" && references($variantId)] | order(${getSortQuery(
    sortBy
  )}){
  ...,
  "categories": categories[]->title,
  "variant": variant->{title, slug}
}`;
  const params = { variantId: selectedTab };

  function getSortQuery(sort: SortOption): string {
    switch (sort) {
      case "name-asc":
        return "name asc";
      case "name-desc":
        return "name desc";
      case "price-asc":
        return "price asc";
      case "price-desc":
        return "price desc";
      case "newest":
        return "_createdAt desc";
      default:
        return "name asc";
    }
  }

  useEffect(() => {
    if (!selectedTab) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, params);
        setProducts(await response);
        setFilteredProducts(await response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab, sortBy]);

  // Apply filters to products
  const applyFilters = () => {
    let filtered = [...products];

    // Filter by price range
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      filtered = filtered.filter((product) => {
        const price = product.price || 0;
        const finalPrice = product.discount
          ? price - price * (product.discount / 100)
          : price;
        return finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
      });
    }

    // Filter by stock status
    if (stockStatus !== "all") {
      filtered = filtered.filter((product) => {
        if (stockStatus === "in-stock") {
          return (product.stock || 0) > 0;
        } else if (stockStatus === "out-of-stock") {
          return (product.stock || 0) === 0;
        }
        return true;
      });
    }

    // Filter by status (using status as a proxy for "rating/quality")
    if (rating !== "all") {
      filtered = filtered.filter((product) => {
        if (rating === "5") {
          return product.status === "hot"; // Hot products = 5 stars
        } else if (rating === "4") {
          return product.status === "hot" || product.status === "new"; // Hot or New = 4+ stars
        } else if (rating === "3") {
          return (
            product.status === "hot" ||
            product.status === "new" ||
            product.status === "sale"
          ); // All products = 3+ stars
        }
        return true;
      });
    }

    setFilteredProducts(filtered);
  };
  // Auto-apply filters when filter values change
  useEffect(() => {
    applyFilters();
  }, [products, priceRange, stockStatus, rating]);

  const getGridClasses = () => {
    switch (viewMode) {
      case "grid-2":
        return "grid-cols-1 sm:grid-cols-2 gap-6";
      case "grid-3":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5";
      case "grid-4":
        return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "grid-5":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3";
      case "list":
        return "grid-cols-1 gap-4";
      default:
        return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
    }
  };

  const ViewModeButton = ({
    mode,
    icon,
    label,
  }: {
    mode: ViewMode;
    icon: React.ReactNode;
    label: string;
  }) => (
    <Button
      variant={viewMode === mode ? "default" : "outline"}
      size="sm"
      onClick={() => setViewMode(mode)}
      className={`p-2 hoverEffect ${
        viewMode === mode
          ? "bg-gofarm-light-green hover:bg-gofarm-green border-gofarm-light-green"
          : "hover:border-gofarm-light-green hover:text-gofarm-light-green"
      }`}
      title={label}
    >
      {icon}
    </Button>
  );

  return (
    <Container className="flex flex-col lg:px-0 mt-16 lg:mt-24">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-linear-to-r from-gofarm-light-green to-gofarm-green rounded-full" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gofarm-black">
            Featured Products
          </h2>
          <div className="h-1 w-12 bg-linear-to-r from-gofarm-light-green to-gofarm-green rounded-full" />
        </div>
        <p className="text-gofarm-gray text-lg max-w-2xl mx-auto">
          Discover our carefully curated selection of premium products
        </p>
      </div>
      {/* Product type Carousels */}
      {carouselsLoading ? (
        <div className="space-y-6 mb-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-96 bg-gofarm-light-gray/30 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div>
          {productVariants?.map((variant) => {
            const variantProducts = productsByVariant[variant._id] || [];
            if (variantProducts?.length === 0) return null;
            return (
              <ProductTypeCarousel
                key={variant?._id}
                variantId={variant._id}
                variantTitle={variant.title}
                variantSlug={variant.slug.current}
                products={variantProducts}
              />
            );
          })}
        </div>
      )}
      {/* Enhanced Controls Section */}
      <div className="mb-10">
        {variantsLoading ? (
          <div>loading</div>
        ) : (
          <HomeTabbar
            selectedTab={selectedTab}
            onTabSelect={setSelectedTab}
            variants={productVariants}
          />
        )}
        {/* Advanced Controls */}
        {/* Expandable Filters secton */}
      </div>
      {/* Products Grid */}
      {loading ? (
        <ProductGridSkeleton />
      ) : filteredProducts?.length ? (
        <div className={`grid ${getGridClasses()}`}>
          <AnimatePresence mode="popLayout">
            {filteredProducts
              ?.slice(0, productsPerPage)
              .map((product, index) => (
                <motion.div
                  key={product?._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    layout: { duration: 0.3 },
                  }}
                  className="group"
                >
                  {viewMode === "list" ? (
                    // <ProductListCard product={product} />
                    <div>List View Coming Soon</div>
                  ) : (
                    <ProductCard product={product} />
                  )}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      ) : (
        <NoProductAvailable
          selectedTab={selectedTab}
          variantTitle={
            productVariants.find((v) => v._id === selectedTab)?.title
          }
        />
      )}
    </Container>
  );
};

export default ProductGrid;
