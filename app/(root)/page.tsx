import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import { Product } from "@/types";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";

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
    </>
  );
};
export default Homepage;
