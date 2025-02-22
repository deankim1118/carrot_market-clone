'use client';

import { PhotoIcon } from '@heroicons/react/24/solid';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useActionState, useState } from 'react';
import uploadProduct from './action';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const [state, action] = useActionState(uploadProduct, null);
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  return (
    <div>
      <form action={action} className='p-4 flex flex-col gap-5'>
        <label
          htmlFor='photo'
          className='border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover'
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === '' ? (
            <>
              <PhotoIcon className='w-20' />
              <div className='text-neutral-400 text-sm'>
                Please add Photo{state?.fieldErrors.title}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type='file'
          id='photo'
          name='photo'
          accept='image/*'
          className='hidden'
        />
        <Input
          name='title'
          required
          placeholder='Title'
          type='text'
          errors={state?.fieldErrors.title}
        />
        <Input
          name='price'
          type='number'
          required
          placeholder='Price'
          errors={state?.fieldErrors.price}
        />
        <Input
          name='description'
          type='text'
          required
          placeholder='Description'
          errors={state?.fieldErrors.description}
        />
        <Button text='Add Product' />
      </form>
    </div>
  );
}
