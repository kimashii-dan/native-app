import { db } from "@/firebaseConfig/config";
import { ChatFriendType, ChatType, UserType } from "@/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { IMessage } from "react-native-gifted-chat";
import { PeopleService } from "./people";

export const ChatService = {
  fetchChatList: async (currentUserId: string): Promise<ChatFriendType[]> => {
    try {
      const chatsQuery = query(
        collection(db, "chats"),
        where("users", "array-contains", currentUserId),
        orderBy("lastUpdated", "desc")
      );
      const querySnapshot = await getDocs(chatsQuery);
      const chats = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const chatData = doc.data();
          const friendId = chatData.users.find(
            (id: string) => id !== currentUserId
          );
          const friend = await PeopleService.getUserById(friendId);
          return {
            chatId: chatData.chatId,
            users: chatData.users,
            friendDisplayName: friend.username,
            lastMessage: chatData.lastMessage,
            lastUpdated: chatData.lastUpdated?.toDate(),
          };
        })
      );

      return chats;
    } catch (error) {
      console.error("Error fetching chat list:", error);
      throw error;
    }
  },

  getOrCreateChat: async (
    userId: string,
    friendId: string
  ): Promise<string> => {
    const chatId = [userId, friendId].sort().join("_");
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        chatId,
        users: [userId, friendId],
        lastMessage: "",
        lastUpdated: Timestamp.now(),
      });
    }

    return chatId;
  },

  sendMessage: async (
    newMessages: IMessage[] = [],
    user: UserType | null,
    realChatId: string
  ) => {
    if (!realChatId || !user) return;
    const message = newMessages[0];
    const messagesRef = collection(db, "chats", realChatId, "messages");
    await addDoc(messagesRef, {
      text: message.text,
      senderId: user.uid,
      senderName: user.username || "Unknown",
      createdAt: Timestamp.now(),
    });
  },

  fetchMessages: (
    realChatId: string,
    setMessages: (messages: IMessage[]) => void
  ) => {
    const messagesRef = collection(db, "chats", realChatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: {
            _id: data.senderId,
            name: data.senderName,
          },
        } as IMessage;
      });
      setMessages(loadedMessages);
    });
  },
};
