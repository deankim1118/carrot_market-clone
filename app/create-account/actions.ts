'use server';
import { z } from 'zod';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'Username must be a string',
        required_error: 'Please enter the username',
      })
      .trim()
      .toLowerCase(),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });

export default async function createAccoutFormAction(
  prevState: any,
  formData: FormData,
) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
