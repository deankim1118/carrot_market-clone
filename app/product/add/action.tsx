'use server';

import fs from 'fs/promises';
import db from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { productSchema } from './schema';
import { revalidatePath } from 'next/cache';

export default async function uploadProduct(_: unknown, formData: FormData) {
  const data = await {
    photo: formData.get('photo'),
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
  };

  if (data.photo instanceof File && data.photo.name !== 'undefined') {
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  }

  const result = await productSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  }
  const session = await getSession();
  if (session.id) {
    await db.product.create({
      data: {
        photo: result.data.photo,
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        user: {
          connect: { id: session.id },
        },
      },
      select: {
        id: true,
      },
    });
    revalidatePath('/home');
    redirect('/home');
  }
}
