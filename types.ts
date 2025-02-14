import { Timestamp } from "firebase/firestore";

interface UserType {
  uid: string;
  email: string | null;
  username: string | null;
  friends: FriendType[];
}

interface FriendType {
  uid: string;
  email: string | null;
  username: string | null;
}

interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
}

interface ChatType {
  chatId: string;
  users: string[];
  lastMessage: string;
  lastUpdated: Timestamp;
}

interface ChatFriendType extends ChatType {
  friendDisplayName: string | null;
}

interface MessageType {
  text: string;
  createdAt: Timestamp;
  senderId: string;
  receiverId: string;
}

export {
  UserType,
  AuthState,
  ChatType,
  MessageType,
  FriendType,
  ChatFriendType,
};
