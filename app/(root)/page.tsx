import { getLatestProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import { Product } from "@/types";
import {auth} from "@/auth"

const Homepage = async () => {
  const session = await auth();
  console.log("Auth session:", session);

  const latestProducts = await getLatestProducts() as Product[];
  
  return (
    <>
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4}/>
    </>
  );
};
export default Homepage;
