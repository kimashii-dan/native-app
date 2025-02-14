import Loading from "@/components/Loading";
import { ChatService } from "@/services/chat";
import { RootState } from "@/store/store";
import { ChatFriendType } from "@/types";
import { useState, useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { useSelector } from "react-redux";

export default function Chats() {
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) return;
  const [chats, setChats] = useState<ChatFriendType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const myChats = await ChatService.fetchChatList(user.uid);
        setChats(myChats);
        console.log(myChats);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (!chats) {
    return (
      <SafeAreaView>
        <View>
          <Text>No chats found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      {chats.map((chat) => (
        <View key={chat.chatId}>
          <Text>{chat.friendDisplayName}</Text>
          <Text>{chat.lastMessage}</Text>
        </View>
      ))}
    </SafeAreaView>
  );
}
