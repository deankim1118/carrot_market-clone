import db from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { formatToDollar } from '../../../lib/utils';

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProducts(id: number) {
  //   await new Promise((resolve) => {
  //     setTimeout(resolve, 5000);
  //   });
  const product = await db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  console.log(product);
  return product;
}

export default async function ProductDetatil({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProducts(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  const deleteProduct = async () => {
    'use server';
    await db.product.delete({ where: { id } });
    return redirect('/products');
  };

  return (
    <div className=''>
      <div className='relative aspect-video '>
        <Image src={product.photo} alt={product.title} fill objectFit='cover' />
      </div>
      <div className='p-4 bottom-1 border-white border-b '>
        <div className='flex gap-4 items-center '>
          <div className='size-10 rounded-full overflow-hidden'>
            {product.user.avatar !== null ? (
              <Image
                src={product.user.avatar}
                alt={product.user.username}
                width={40}
                height={40}
              />
            ) : (
              <UserIcon />
            )}
          </div>
          <span>{product.user.username}</span>
        </div>
      </div>
      <div className='p-4 space-y-2'>
        <h3 className='text-2xl font-semibold'>{product.title}</h3>
        <p>{product.description}</p>
      </div>
      <div className='fixed w-full bottom-0 bg-neutral-800 p-5  flex justify-between items-center max-w-screen-sm'>
        <span className='font-semibold text-xl'>
          $ {formatToDollar(product.price)}
        </span>
        <div className='flex gap-4 items-center'>
          {isOwner ? (
            <form action={deleteProduct}>
              <button className='bg-red-500 px-2 py-1 rounded-md text-sm text-center text-white font-semibold'>
                Delete
              </button>
            </form>
          ) : null}
          <Link
            href='/chat'
            className='bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold'
          >
            Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
