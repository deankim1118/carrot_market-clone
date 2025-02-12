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

// Check if the username is unique in your database here
const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });
  // true if unique, false otherwise
  // But return false if it's true, so that the zod will return false(with refine()) when username is found in database
  return !Boolean(user);
};

// Check if the username is unique in your database here
const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  // true if unique, false otherwise
  // But return false if it's true, so that the zod will return false(with refine()) when username is found in database
  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'Username must be a string',
        required_error: 'Please enter the username',
      })
      .trim()
      .toLowerCase()
      .refine(checkUniqueUsername, 'This username is already taken'),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(checkUniqueEmail, 'This email is already taken'),
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
