import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-col justify-between items-center min-h-screen p-6 '>
      <div className='my-auto flex flex-col items-center gap-2 *:font-medium'>
        <span className='text-9xl'>🥕</span>
        <h1 className='text-4xl'>Carrot Market</h1>
        <h2 className='text-2xl'>Welcome to Carrot Market</h2>
      </div>
      <div className='flex flex-col items-center gap-3 w-full '>
        <Link href='/create-account' className='primary-btn p-2.5 text-lg'>
          Start
        </Link>
        <div className='flex gap-2'>
          <span>Do you have account already?</span>
          <Link href='/login' className='hover:underline'>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
