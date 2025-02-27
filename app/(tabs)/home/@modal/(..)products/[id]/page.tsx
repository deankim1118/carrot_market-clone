import { PhotoIcon, UserIcon } from '@heroicons/react/24/solid';
import CloseButton from '@/components/CloseButton';
import db from '@/lib/db';
import Image from 'next/image';
import { formatToDollar } from '@/lib/utils';

export default async function Modal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id: Number(id) },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return (
    <div className='absolute w-full h-full z-50 left-0 top-0 bg-black flex items-center justify-center bg-opacity-45'>
      <div className='max-w-screen-sm w-full flex justify-center'>
        <CloseButton />
        <div className='aspect-square w-full bg-neutral-700 text-neutral-200  rounded-md flex-col justify-center items-center'>
          {product !== null ? (
            <>
              <div className='relative w-full h-1/2'>
                <Image
                  src={product.photo}
                  alt={product.title}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='h-1/2 flex-col justify-between p-4 '>
                <div className='p-4 bottom-1 border-white border-b '>
                  <div className='flex gap-4 items-center '>
                    <div className='size-10 rounded-full overflow-hidden'>
                      {product!.user.avatar !== null ? (
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
                <div className='flex justify-between p-4 items-center'>
                  <div className='space-y-2'>
                    <h3 className='text-2xl font-semibold'>{product!.title}</h3>
                    <p>{product!.description}</p>
                  </div>
                  <div>
                    <span className='font-semibold text-xl'>
                      $ {formatToDollar(product!.price)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className='w-full h-full flex justify-center items-center'>
              <PhotoIcon className='h-28' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
