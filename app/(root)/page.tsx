import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import { Product } from "@/types";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";
import IconBoxes from "@/components/icon-boxes";
import DealCountdown from "@/components/deal-countdown";

const Homepage = async () => {
  const latestProducts = (await getLatestProducts()) as Product[];
  const featuredProducts = (await getFeaturedProducts()) as Product[];

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts}  />
      )}
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
      <ViewAllProductsButton/>
      <DealCountdown />
      <IconBoxes />
    </>
  );
};
export default Homepage;
