import Title from "@/components/common/Title";
import Container from "@/components/Container";
import ProductCatalog from "@/components/ProductCatalog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAllBrands, getAllProducts, getCategories } from "@/sanity/queries";
import { ArrowRight, Filter, Package, Search } from "lucide-react";
import React, { Suspense } from "react";

const ProductPage = async () => {
  const [products, categories, brands] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getAllBrands(),
  ]);

  return (
    <div className="bg-linear-to-b from-gray-200 to-white min-h-screen">
      {/* Hero section */}
      <div className="bg-linear-to-r from-gofarm-green to-gofarm-light-green">
        <Container>
          <div className="py-16 text-white">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList className="text-white/80">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="hover:text-white">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/60" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">
                      Products
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-8 h-8" />
                <Title className="text-4xl md:text-5xl font-bold text-white mb-0">
                  Product Catalog
                </Title>
              </div>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
                Discover our complete collection of premium products. From
                cutting-edge electronics to stylish accessories, find everything
                you need in one place.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {products?.length || 0}+ Products
                    </p>
                    <p className="text-sm text-white/70">
                      Premium Quality Items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {categories?.length || 0} Categories
                    </p>
                    <p className="text-sm text-white/70">Easy to Navigate</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Advanced Filters</p>
                    <p className="text-sm text-white/70">Find What You Need</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      {/* Main content */}
      <Container className="py-10">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-2 text-gofarm-green">
                <div className="w-6 h-6 border-2 border-gofarm-green border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Loading products...</span>
              </div>
            </div>
          }
        >
          <ProductCatalog
            initialProducts={products}
            categories={categories}
            brands={brands}
          />
        </Suspense>
      </Container>
      {/* Bottom CTA Section */}
      <div className="bg-gray-50 border-t border-t-border">
        <Container>
          <div className="py-12 text-center">
            <Title className="text-2xl mb-4">
              Can&apos;t find what you&apos;re looking for?
            </Title>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our customer support team is here to help you find the perfect
              product. Get in touch with us for personalized recommendations.
            </p>
            <button className="inline-flex items-center gap-2 bg-gofarm-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-gofarm-green/90 transition-colors">
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ProductPage;
