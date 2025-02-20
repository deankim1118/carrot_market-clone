'use client';

import { useEffect, useRef, useState } from 'react';
import { InitialProductsType } from '@/app/(tabs)/products/page';
import ListProduct from './ListProduct';
import getMoreProducts from '@/app/(tabs)/products/action';

interface ProductListProps {
  initialProducts: InitialProductsType;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver,
      ) => {
        const triggerElement = entries[0];
        if (triggerElement.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 0.5,
      },
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className='flex flex-col gap-4 p-5'>
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {!isLastPage ? (
        <span
          ref={trigger}
          className=' text-sm font-semibold bg-orange-500 w-fit  px-3 py-2 rounded-md hover:opacity-90 active:scale-95 mx-auto'
        >
          {isLoading ? 'Loading...' : 'Load more...'}
        </span>
      ) : null}
    </div>
  );
}
