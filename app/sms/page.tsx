'use client';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function SMSLogin() {
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex-flex-col gap-2 *:font-medium '>
        <h1 className='text-2xl'>SMS Login</h1>
        <h2 className='text-xl'>Verify your phone number</h2>
      </div>
      <form className='flex flex-col gap-3'>
        <Input
          name='phone'
          type='number'
          placeholder='Phone number'
          required={true}
        />
        <Input
          name='token'
          type='number'
          placeholder='Verification code'
          required={true}
        />
        <Button text='Verify' />
      </form>
    </div>
  );
}
