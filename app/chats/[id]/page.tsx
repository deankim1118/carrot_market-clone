import db from '@/lib/db';
import { getSession } from '@/lib/session';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import ChatMessagesList from '@/components/ChatMessagesList';

const getRoom = async (id: string) => {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id));
    if (!canSee) {
      return null;
    }
  }
  return room;
};

const getinitialMessages = async (chatRoomId: string) => {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
};

export type initialMessages = Prisma.PromiseReturnType<
  typeof getinitialMessages
>;

export default async function ChatRoom({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chatRoom = await getRoom(id);
  if (!chatRoom) {
    return notFound();
  }
  const initialMessages = await getinitialMessages(id);
  const session = await getSession();
  return (
    <ChatMessagesList userId={session.id!} initialMessages={initialMessages} />
  );
}
