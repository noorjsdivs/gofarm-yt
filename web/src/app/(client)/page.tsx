import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import UserTest from "@/components/UserTest";

export default function Home() {
  return (
    <div>
      <HomeBanner />
      <ProductGrid />
    </div>
  );
}
