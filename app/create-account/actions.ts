'use server';
import { z } from 'zod';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import getSession from '../../lib/session';

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
    password: z.string().min(PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        path: ['username'],
        message: 'This username is already taken',
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'This email is already taken',
        fatal: true,
      });
      return z.NEVER;
    }
  })

  .superRefine(({ password }, ctx) => {
    if (PASSWORD_REGEX.test(password) === false) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: PASSWORD_REGEX_ERROR,
        fatal: true,
      });
      return z.NEVER;
    }
  })
  // .superRefine(({ password, confirmPassword }, ctx) => {
  //   if (password !== confirmPassword) {
  //     ctx.addIssue({
  //       code: 'custom',
  //       path: ['confirmPassword'],
  //       message: 'Passwords do not match',
  //     });
  //   }
  // });
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
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
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    /**This place should include only the order that is successed and validated.**/
    // hash password
    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    // save user to the database
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    // log the user in
    const session = await getSession();
    session.id = user.id;
    await session.save();
    // redirect to '/home'
    redirect('/profile');
  }
}
