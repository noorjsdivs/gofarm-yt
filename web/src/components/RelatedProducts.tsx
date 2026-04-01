import { urlFor } from "@/sanity/lib/image";
import { Product } from "../../sanity.types";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import AddToCartButton from "./product/AddToCartButton";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import { Badge } from "./ui/badge";
import { StarIcon } from "lucide-react";
import { Button } from "./ui/button";

interface RelatedProductsProps {
  currentProduct: Product;
  relatedProducts: Product[];
}

const RelatedProducts = ({
  currentProduct,
  relatedProducts,
}: RelatedProductsProps) => {
  // If no related products found, return null
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }
  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gofarm-green mb-2">
          You Might Also Like
        </h2>
        <p className="text-gray-600">Similar products from the same category</p>
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
       gap-6"
      >
        {relatedProducts?.map((product: Product) => {
          const imageUrl = product?.images?.[0]
            ? urlFor(product.images[0]).url()
            : null;
          const originalPrice =
            product?.discount && product?.price
              ? (product.price / (1 - product.discount / 100)).toFixed(2)
              : null;
          const isInStock = (product?.stock || 0) > 0;
          return (
            <Card
              key={product?._id}
              className="group hover:shadow-xl transition-all duration-300 border-2 border-border hover:border-gofarm-light-green/30"
            >
              <CardContent>
                {/* Product Image */}

                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={"productImage"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        Product Image
                      </span>
                    </div>
                  )}
                  {/* Discount Badge */}
                  {product?.discount && product.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-gofarm-orange text-white hover:bg-gofarm-orange/90">
                      -{product.discount}%
                    </Badge>
                  )}

                  {/* Stock Badge */}
                  {!isInStock && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600">
                      Out of Stock
                    </Badge>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 rounded-full p-1 hover:bg-white transition-colors">
                      <FavoriteButton product={product} />
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <Link
                    href={`/product/${product?.slug?.current}`}
                    className="block hover:text-gofarm-light-green transition-colors"
                  >
                    <h3 className="font-semibold text-gofarm-green line-clamp-2 text-sm">
                      {product?.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          size={12}
                          className={`${
                            index < 4
                              ? "text-gofarm-light-green fill-gofarm-light-green"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">(4.0)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gofarm-green">
                      ${product?.price}
                    </span>
                    {originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <AddToCartButton
                    product={product}
                    className="w-full mt-3 bg-gofarm-green hover:bg-gofarm-light-green text-white text-sm py-2 rounded-md"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* View More Button */}
      <div className="text-center mt-8">
        <Button
          variant="outline"
          className="border-gofarm-green text-gofarm-green hover:bg-gofarm-green hover:text-white"
          asChild
        >
          <Link href="/shop">View More Products</Link>
        </Button>
      </div>
    </div>
  );
};

export default RelatedProducts;
