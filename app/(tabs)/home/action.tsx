'use server';

import db from '@/lib/db';
import { NoOfProductPerPage } from '@/lib/constants';

export default async function getMoreProducts(page: number) {
  const products = db.product.findMany({
    select: {
      title: true,
      price: true,
      photo: true,
      created_at: true,
      id: true,
    },
    skip: page * NoOfProductPerPage,
    take: NoOfProductPerPage,
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}
