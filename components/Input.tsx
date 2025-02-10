import { InputHTMLAttributes } from 'react';

interface InputProps {
  name: string;
  errors?: string[];
}

export default function Input({
  name,
  errors = [],
  ...props
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className='flex flex-col gap-2 '>
      <input
        name={name}
        className='bg-transparent rounded-md w-full h-10 focus:outline-none  placeholder:text-white/60 ring-1 focus:ring-4 transition border-none ring-neutral-200  focus:ring-orange-400'
        {...props}
      />
      {errors.map((error, index) => (
        <span key={index} className='text-red-500 font-medium'>
          {error}
        </span>
      ))}
    </div>
  );
}
