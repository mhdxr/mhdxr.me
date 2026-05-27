/* eslint-disable react-hooks/exhaustive-deps */
import {
  type Database,
  getDatabase,
  onValue,
  ref,
  remove,
  set,
} from 'firebase/database';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { env, isFirebaseConfigured } from '@/common/libs/env';
import { firebase } from '@/common/libs/firebase';
import { MessageProps } from '@/common/types/chat';

import ChatAuth from './ChatAuth';
import ChatInput from './ChatInput';
import ChatList from './ChatList';

const Chat = ({ isWidget = false }: { isWidget?: boolean }) => {
  const { data: session } = useSession();

  const [messages, setMessages] = useState<MessageProps[]>([]);

  // `firebase` is `null` when the integration is unconfigured (e.g. CI,
  // previews, fresh local checkouts). Guard before calling `getDatabase`
  // so the guestbook fails closed with a friendly message instead of
  // throwing at module load time.
  const firebaseReady = isFirebaseConfigured() && firebase !== null;

  const database: Database | null = useMemo(
    () => (firebase ? getDatabase(firebase) : null),
    [],
  );
  const databaseChat = env.NEXT_PUBLIC_FIREBASE_CHAT_DB ?? '';

  const handleSendMessage = (message: string) => {
    if (!database || !databaseChat) return;
    const messageId = uuidv4();
    const messageRef = ref(database, `${databaseChat}/${messageId}`);

    set(messageRef, {
      id: messageId,
      name: session?.user?.name,
      email: session?.user?.email,
      image: session?.user?.image,
      message,
      created_at: new Date().toISOString(),
      is_show: true,
    });
  };

  const handleDeleteMessage = (id: string) => {
    if (!database || !databaseChat) return;
    const messageRef = ref(database, `${databaseChat}/${id}`);

    if (messageRef) {
      remove(messageRef);
    }
  };

  useEffect(() => {
    if (!database || !databaseChat) return;
    const messagesRef = ref(database, databaseChat);
    onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesArray = Object.values(messagesData) as MessageProps[];
        const sortedMessage = messagesArray.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateA.getTime() - dateB.getTime();
        });
        setMessages(sortedMessage);
      }
    });
  }, [database]);

  if (!firebaseReady) {
    return (
      <div
        role='status'
        className='rounded-xl border border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400'
      >
        Guestbook is not configured.
      </div>
    );
  }

  return (
    <>
      <ChatList
        isWidget={isWidget}
        messages={messages}
        onDeleteMessage={handleDeleteMessage}
      />
      {session ? (
        <ChatInput onSendMessage={handleSendMessage} isWidget={isWidget} />
      ) : (
        <ChatAuth isWidget={isWidget} />
      )}
    </>
  );
};

export default Chat;
