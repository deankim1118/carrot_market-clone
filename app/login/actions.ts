'use server';
import { z } from 'zod';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';
import bcrypt from 'bcrypt';
import getSession from '../../lib/session';
import { redirect } from 'next/navigation';

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: { id: true },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "Email doens't exist"),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function loginFormAction(prevState: any, formData: FormData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: { email: result.data.email },
      select: { id: true, password: true },
    });
    const passwordConfirmed = await bcrypt.compare(
      result.data.password,
      user!.password ?? 'xxxx',
    );
    if (passwordConfirmed) {
      const session = await getSession();
      session.id = user!.id;
      redirect('/profile');
    } else {
      return {
        fieldErrors: {
          password: ['Wrong password'],
          email: [],
        },
      };
    }
  }
}
