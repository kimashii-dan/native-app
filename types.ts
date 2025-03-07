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

interface IncomingFriendRequest {
  requestID: string;
  sender: FriendType;
}

interface OutgoingFriendRequest {
  requestID: string;
  receiver: FriendType;
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

interface FriendRequest {
  requestID: string;
  senderID: string;
  receiverID: string;
  createdAt: Timestamp;
}

export {
  UserType,
  AuthState,
  ChatType,
  MessageType,
  FriendType,
  ChatFriendType,
  FriendRequest,
  IncomingFriendRequest,
  OutgoingFriendRequest,
};
