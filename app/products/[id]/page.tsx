import db from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/solid';
import { formatToDollar } from '@/lib/utils';
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from 'next/cache';

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
  return product;
}

const getCachedProducts = nextCache(getProducts, ['product-detail'], {
  tags: ['product-detail'],
});

async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    select: {
      title: true,
    },
  });
  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ['product-title'], {
  tags: ['product-title'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getCachedProductTitle(Number(id));
  return {
    title: product?.title,
  };
}
export default async function ProductDetatil({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idString } = await params;
  const id = Number(idString);

  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProducts(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  const deleteProduct = async () => {
    'use server';
    await db.product.delete({ where: { id } });
    revalidatePath('/home');
    return redirect('/home');
  };

  // const revalidate = async () => {
  //   'use server';
  //   revalidateTag('product-title');
  // };
  const createChatRoom = async (): Promise<never> => {
    'use server';
    const session = await getSession();
    const seller = product.userId;
    const user = session.id!;
    if (!session) {
      throw new Error('User is not authenticated');
    }
    if (!product || !product.userId) {
      throw new Error('Invalid product data');
    }
    if (seller === user) {
      throw new Error(
        '연결하려는 사용자 중 하나가 데이터베이스에 존재하지 않습니다.',
      );
    }
    revalidateTag('product-detail');
    const room = await db.chatRoom.create({
      data: {
        users: { connect: [{ id: seller }, { id: user }] },
      },
      select: {
        id: true,
      },
    });

    revalidatePath('/home');
    redirect(`/chats/${room.id}`);
  };

  return (
    <div className=''>
      <div className='relative aspect-video '>
        <Image
          src={product.photo}
          alt={product.title}
          fill
          className='object-cover'
        />
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
          <form action={createChatRoom}>
            <button className='bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold'>
              Chat
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// export async function generateStaticParams() {
//   const products = await db.product.findMany({
//     select: {
//       id: true,
//     },
//   });
//   return products.map((product) => ({ id: product.id + '' }));
// }
