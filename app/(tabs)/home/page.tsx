import db from '@/lib/db';
import ProductList from '@/components/ProductList';
import { Prisma } from '@prisma/client';
import { NoOfProductPerPage } from '@/lib/constants';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/solid';
import { unstable_cache as nextCache } from 'next/cache';

const getCachedProducts = nextCache(getInitialProducts, ['home-products']);

async function getInitialProducts() {
  // await new Promise((resolve) => {
  //   setTimeout(resolve, 5000);
  // });
  console.log('hit db');
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

export const metadata = {
  title: 'Home',
};

export type InitialProductsType = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

// export const dynamic = "force-dynamic";
// export const revalidate = 60;

export default async function Products() {
  const initialProducts = await getCachedProducts();
  return (
    <div className='relative'>
      <ProductList initialProducts={initialProducts} />
      <Link
        href='/product/add'
        className='absolute right-0 bottom-0 rounded-full bg-orange-500 text-white p-1 flex items-center justify-center size-14 hover:bg-orange-400'
      >
        <PlusIcon className='size-10' />
      </Link>
    </div>
  );
}
