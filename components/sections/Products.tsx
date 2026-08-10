import { getProducts } from "@/lib/api/content";
import ProductsReveal from "./ProductsReveal";

export default async function Products() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let hasError = false;

  try {
    products = await getProducts();
  } catch {
    hasError = true;
  }

  return <ProductsReveal products={products} hasError={hasError} />;
}
