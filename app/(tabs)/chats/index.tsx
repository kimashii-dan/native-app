import Loading from "@/components/Loading";
import { ChatService } from "@/services/chat";
import { RootState } from "@/store/store";
import { ChatFriendType } from "@/types";
import { router } from "expo-router";
import { Timestamp } from "firebase/firestore";
import { UserCircleIcon } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

export default function Chats() {
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) return;
  const [chats, setChats] = useState<ChatFriendType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;

    const unsubscribe = ChatService.fetchChatList(user.uid, (newChats) => {
      setChats(newChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const handleMessage = (
    id: string,
    chatId: string,
    friendUsername: string | null
  ) => {
    router.push({
      pathname: "/chats/[id]/[chatId]",
      params: {
        id,
        chatId: chatId,
        username: friendUsername,
      },
    });
  };

  return (
    <SafeAreaView>
      <View className="justify-center items-center py-8 ">
        <View className="w-[80%]">
          <Text className="text-3xl font-semibold">Chats</Text>
        </View>
      </View>
      {chats.length === 0 ? (
        <View className="justify-center items-center h-screen">
          <View className="h-[40%]">
            <Text>No chats found</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.chatId}
          renderItem={({ item }) => {
            const correctId =
              item.users[1] === user.uid ? item.users[0] : item.users[1];
            return (
              <View className="items-center">
                <TouchableOpacity
                  onPress={() =>
                    handleMessage(
                      correctId,
                      item.chatId,
                      item.friendDisplayName
                    )
                  }
                  className="w-[80%] p-7 bg-white rounded-xl mb-4"
                >
                  <View className="flex-row items-end justify-between">
                    <View className="flex-row gap-3 items-center">
                      <UserCircleIcon width={40} height={40} />
                      <View>
                        <Text className="text-2xl font-semibold">
                          {item.friendDisplayName}
                        </Text>
                        <Text className=" text-gray-500">
                          {item.lastMessage}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text className=" text-gray-500">
                        {item.lastUpdated.toDate().toDateString() ===
                        new Date().toDateString()
                          ? item.lastUpdated.toDate().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : item.lastUpdated.toDate().toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
