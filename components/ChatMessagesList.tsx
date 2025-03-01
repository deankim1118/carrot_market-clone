'use client';

import { initialMessages } from '@/app/chats/[id]/page';
import { useState } from 'react';
import Image from 'next/image';
import { formatToTimeAgoDetailVersion } from '../lib/utils';
import { UserIcon } from '@heroicons/react/24/solid';

interface ChatMessageListProps {
  initialMessages: initialMessages;
  userId: number;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);

  return (
    <div className='p-8 w-full min-h-screen flex flex-col justify-end bg-slate-400 *:text-neutral-600'>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-4 mb-4 items-start ${
            message.userId === userId && 'justify-end'
          } `}
        >
          {message.userId === userId ? null : message.user.avatar ? (
            <Image
              src={message.user.avatar}
              width='50'
              height='50'
              alt='user avater'
              className='rounded-full'
            />
          ) : (
            <UserIcon className='size-12 rounded-full bg-slate-500 p-1.5' />
          )}
          <div
            className={`flex flex-col p-px gap-2 ${
              message.userId === userId && 'items-end'
            }`}
          >
            {message.userId !== userId && <span>{message.user.username}</span>}
            <div className={'flex gap-2 items-end'}>
              {message.userId !== userId ? (
                <>
                  <span className='bg-white text-black rounded-lg p-2'>
                    {message.payload}
                  </span>
                  <span className='text-xs'>
                    {formatToTimeAgoDetailVersion(
                      message.created_at.toString(),
                    )}
                  </span>
                </>
              ) : (
                <>
                  <span className='text-xs'>
                    {formatToTimeAgoDetailVersion(
                      message.created_at.toString(),
                    )}
                  </span>
                  <span className='bg-yellow-300 text-black rounded-lg p-2'>
                    {message.payload}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
