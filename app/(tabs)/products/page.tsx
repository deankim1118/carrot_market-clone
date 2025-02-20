import db from '@/lib/db';
import ProductList from '@/components/ProductList';
import { Prisma } from '@prisma/client';
import { NoOfProductPerPage } from '@/lib/constants';

async function getInitialProducts() {
  // await new Promise((resolve) => {
  //   setTimeout(resolve, 5000);
  // });
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      photo: true,
      created_at: true,
      id: true,
    },
    take: NoOfProductPerPage,
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

export type InitialProductsType = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const initialProducts = await getInitialProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
    </div>
  );
}
