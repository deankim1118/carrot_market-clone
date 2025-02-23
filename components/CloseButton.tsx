'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function CloseButton() {
  const router = useRouter();

  const onCloseButtonClick = () => {
    router.back();
  };

  return (
    <button
      onClick={onCloseButtonClick}
      className='absolute right-4 top-4 rounded-full bg-orange-500 text-white p-1 flex items-center justify-center size-14 hover:bg-orange-400'
    >
      <XMarkIcon className='size-10' />
    </button>
  );
}
