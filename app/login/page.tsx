'use client';

import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';
import SocialLogin from '@/components/SocialLogin';
import { handleForm } from './actions';
import { useActionState } from 'react';

export default function Login() {
  const [state, action] = useActionState(handleForm, null);

  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex-flex-col gap-2 *:font-medium '>
        <h1 className='text-2xl'>Hello</h1>
        <h2 className='text-xl'>Login with email and password</h2>
      </div>
      <form action={action} className='flex flex-col gap-3'>
        <FormInput
          name='email'
          type='email'
          placeholder='Email'
          required={true}
          errors={state?.errors ?? []}
        />
        <FormInput
          name='password'
          type='password'
          placeholder='Password'
          required={true}
          errors={state?.errors ?? []}
        />
        <FormButton text='Login' />
      </form>
      <SocialLogin />
    </div>
  );
}
