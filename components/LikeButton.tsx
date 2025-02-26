'use client';
import { HandThumbUpIcon } from '@heroicons/react/24/solid';
import { dislikePost, likePost } from '@/app/posts/[id]/action';
import { useOptimistic } from 'react';

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  userId: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  userId,
  postId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (prevState) => ({
      isLiked: !prevState.isLiked,
      likeCount: prevState.isLiked
        ? prevState.likeCount - 1
        : prevState.likeCount + 1,
    }),
  );

  const onClick = async () => {
    reducerFn(undefined);
    if (state.isLiked) {
      await dislikePost({ userId, postId });
    } else {
      await likePost({ userId, postId });
    }
  };

  return (
    <form action={onClick}>
      <button
        className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 hover:bg-neutral-800 transition-colors ${
          state.isLiked
            ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-400'
            : ''
        }`}
      >
        <HandThumbUpIcon className='size-5' />
        <span>Likes ({state.likeCount})</span>
      </button>
    </form>
  );
}
