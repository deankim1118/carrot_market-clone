import Image from 'next/image';
import Link from 'next/link';

interface ListProductProps {
  title: string;
  price: number;
  photo: string;
  created_at: Date;
  id: number;
}

export default function ListProduct({
  title,
  price,
  photo,
  created_at,
  id,
}: ListProductProps) {
  return (
    <Link href={`products/${id}`} className='flex gap-5'>
      <div className='relative size-28 rounded-md overflow-hidden bg-slate-300'>
        <Image src={photo} alt={title} fill />
      </div>
      <div className='flex flex-col gap-2 *:text-white'>
        <span className='text-lg'>{title}</span>
        <span className='text-sm text-neutral-500'>
          {created_at.toString()}
        </span>
        <span className='text-lg font-semibold'>{price}</span>
      </div>
    </Link>
  );
}
