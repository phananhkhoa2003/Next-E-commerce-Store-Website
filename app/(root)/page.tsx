import { getLatestProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import { Product } from "@/types";

const Homepage = async () => {
  const latestProducts = await getLatestProducts() as Product[];
  
  return (
    <>
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4}/>
    </>
  );
};
export default Homepage;
