'use server';
import { z } from 'zod';
import twilio from 'twilio';
import crypto from 'crypto';
import validator from 'validator';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { loginSession } from '@/lib/session';

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'en-US'),
    'Please enter only US phone number',
  );

const tokenExists = async (token: number) => {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
};

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, 'This Token is not available');

interface ActionState {
  isToken: boolean;
}

const getToken = async () => {
  const token = crypto.randomInt(100000, 999999).toString();
  const isTokenExists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (isTokenExists) {
    return getToken();
  } else {
    return token;
  }
};

export async function smsFormAction(
  prevState: ActionState,
  formData: FormData,
) {
  const phone = formData.get('phone');
  const tokenInput = formData.get('token');
  if (!prevState.isToken) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        isToken: false,
        error: result.error.flatten(),
      };
    } else {
      // delete previous token
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      // generate new token
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString('hex'),
                phone: result.data,
              },
            },
          },
        },
      });
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
      await client.messages.create({
        body: `Your verification code is ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.MY_PHONE_NUMBER!,
      });
      return { isToken: true };
    }
  } else {
    const result = await tokenSchema.safeParseAsync(tokenInput);
    if (!result.success) {
      return {
        isToken: true,
        error: result.error.flatten(),
      };
    } else {
      // get the userId of token
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      // log the user in
      await loginSession(token!.userId);
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      redirect('/');
    }
  }
}
