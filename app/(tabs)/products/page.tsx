import db from '@/lib/db';
import ListProduct from '@/components/ListProduct';

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
    take: 1,
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

export default async function Products() {
  const products = await getInitialProducts();
  return (
    <div className='flex flex-col gap-4 p-8'>
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
    </div>
  );
}
