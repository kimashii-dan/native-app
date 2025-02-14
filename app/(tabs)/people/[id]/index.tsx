import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FriendType } from "@/types";
import { UserCircleIcon } from "lucide-react-native";
import { PeopleService } from "@/services/people";
import Loading from "@/components/Loading";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { ChatService } from "@/services/chat";

export default function UserProfile() {
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) return;
  const { id } = useLocalSearchParams();
  const friendId = Array.isArray(id) ? id[0] : id;
  const [friend, setFriend] = useState<FriendType>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!friendId) return;
    const fetchFriend = async () => {
      try {
        const userData = await PeopleService.getUserById(friendId);
        console.log("userdata:", userData);
        setFriend(userData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriend();
  }, [friendId]);

  const handleMessage = async () => {
    if (!friend) return;
    const chatId = await ChatService.getOrCreateChat(user.uid, friend.uid);
    router.push({
      pathname: "/people/[id]/[chatId]",
      params: {
        id: friendId,
        chatId: chatId,
        username: friend.username,
      },
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!friend) {
    return (
      <SafeAreaView>
        <View>
          <Text>User not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="">
      <ScrollView>
        <View className="items-center py-8">
          <View className="w-[80%] gap-8">
            <View className="flex-row items-center gap-3">
              <UserCircleIcon width={60} height={60} />

              <Text className="text-3xl font-bold">{friend?.username}</Text>
            </View>

            <Text>Email: {friend?.email}</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={handleMessage}
                className="p-3 bg-black rounded-md w-1/3 items-center"
              >
                <Text className="text-white text-xl">Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
