import db from '@/lib/db';
import { getSession } from '@/lib/session';
import { notFound } from 'next/navigation';

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

export default async function ChatRoom({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const room = await getRoom((await params).id);
  if (!room) {
    return notFound();
  }
  return <div>Chat</div>;
}
