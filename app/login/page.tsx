import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';
import SocialLogin from '@/components/SocialLogin';

export default function Login() {
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex-flex-col gap-2 *:font-medium '>
        <h1 className='text-2xl'>Hello</h1>
        <h2 className='text-xl'>Login with email and password</h2>
      </div>
      <form className='flex flex-col gap-3'>
        <FormInput
          type='email'
          placeholder='Email'
          required={true}
          errors={[]}
        />
        <FormInput
          type='password'
          placeholder='Password'
          required={true}
          errors={[]}
        />
        <FormButton loading={false} text='Login' />
      </form>
      <SocialLogin />
    </div>
  );
}
