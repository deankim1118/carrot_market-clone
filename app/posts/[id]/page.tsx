import { notFound } from 'next/navigation';
import db from '@/lib/db';
import { EyeIcon } from '@heroicons/react/24/solid';
import { formatToTimeAgoDetailVersion } from '@/lib/utils';
import Image from 'next/image';
import { getSession } from '@/lib/session';
import { unstable_cache as nextCache } from 'next/cache';
import LikeButton from '../../../components/LikeButton';

const getPost = async (id: number) => {
  try {
    const post = await db.post.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
};

const getLikeStatus = async ({
  userId,
  postId,
}: {
  userId: number;
  postId: number;
}) => {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        userId: userId,
        postId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return { likeCount, isLiked: Boolean(isLiked) };
};

const cashedGetPost = nextCache(getPost, ['post-detail'], {
  tags: ['post-detail'],
});

const getCachedLikeStatus = (userId: number, postId: number) => {
  const cachedOperation = nextCache(getLikeStatus, ['post-like-status'], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation({ userId, postId });
};

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idString } = await params;
  const id = Number(idString);
  const session = await getSession();
  const userId = session.id!;

  if (isNaN(id)) {
    return notFound();
  }

  const post = await cashedGetPost(id);
  if (!post) {
    return notFound();
  }

  const { likeCount, isLiked } = await getCachedLikeStatus(userId, id);

  return (
    <div className='p-5 text-white'>
      <div className='flex items-center gap-2 mb-2'>
        <Image
          width={28}
          height={28}
          className='size-7 rounded-full'
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className='text-sm font-semibold'>{post.user.username}</span>
          <div className='text-xs'>
            <span>
              {formatToTimeAgoDetailVersion(post.created_at.toString())}
            </span>
          </div>
        </div>
      </div>
      <h2 className='text-lg font-semibold'>{post.title}</h2>
      <p className='mb-5'>{post.description}</p>
      <div className='flex flex-col gap-5 items-start'>
        <div className='flex items-center gap-2 text-neutral-400 text-sm'>
          <EyeIcon className='size-5' />
          <span>views {post.views}</span>
        </div>
        <LikeButton
          isLiked={isLiked}
          likeCount={likeCount}
          userId={userId}
          postId={id}
        />
      </div>
    </div>
  );
}
