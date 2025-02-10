'use client';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useActionState } from 'react';
import { smsFormAction } from './actions';

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, dispatch] = useActionState(smsFormAction, initialState);

  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex-flex-col gap-2 *:font-medium '>
        <h1 className='text-2xl'>SMS Login</h1>
        <h2 className='text-xl'>Verify your phone number</h2>
      </div>
      <form action={dispatch} className='flex flex-col gap-3'>
        {state.token ? (
          <Input
            name='token'
            type='number'
            placeholder='Verification code'
            required
            minLength={100000}
            maxLength={999999}
          />
        ) : (
          <Input
            name='phone'
            type='number'
            placeholder='Phone number'
            required
            errors={state.error?.formErrors}
          />
        )}
        <Button text={state.token ? 'Verify Code' : 'Send Code'} />
      </form>
    </div>
  );
}
