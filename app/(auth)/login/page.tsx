'use client';

import Input from '@/components/Input';
import Button from '@/components/Button';
import SocialLogin from '@/components/SocialLogin';
import { loginFormAction } from './actions';
import { useActionState } from 'react';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';

export default function Login() {
  const [state, dispatch] = useActionState(loginFormAction, null);

  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex-flex-col gap-2 *:font-medium '>
        <h1 className='text-2xl'>Hello</h1>
        <h2 className='text-xl'>Login with email and password</h2>
      </div>
      <form action={dispatch} className='flex flex-col gap-3'>
        <Input
          name='email'
          type='email'
          placeholder='Email'
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name='password'
          type='password'
          placeholder='Password'
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <Button text='Login' />
      </form>
      <SocialLogin />
    </div>
  );
}
