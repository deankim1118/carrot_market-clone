'use server';
import { revalidateTag } from 'next/cache';
import db from '@/lib/db';

export const likePost = async ({
  userId,
  postId,
}: {
  userId: number;
  postId: number;
}) => {
  'use server';
  try {
    await db.like.create({
      data: {
        userId: userId,
        postId,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
};

export const dislikePost = async ({
  userId,
  postId,
}: {
  userId: number;
  postId: number;
}) => {
  'use server';
  try {
    await db.like.delete({
      where: {
        id: {
          userId: userId,
          postId,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
};
