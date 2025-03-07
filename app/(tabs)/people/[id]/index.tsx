import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FriendRequest, FriendType } from "@/types";
import { UserCircleIcon } from "lucide-react-native";
import { PeopleService } from "@/services/people";
import Loading from "@/components/Loading";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { ChatService } from "@/services/chat";
import { setUser } from "@/store/authSlice";
import { UserService } from "@/services/user";
import { auth } from "@/firebaseConfig/config";
import Toast from "react-native-toast-message";
import { Check } from "lucide-react-native";

export default function UserProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) return null;
  const { id } = useLocalSearchParams();
  const friendId = Array.isArray(id) ? id[0] : id;
  const [friend, setFriend] = useState<FriendType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [requestStatus, setRequestStatus] = useState<
    "pending" | "not-sent" | "friends"
  >("not-sent");

  useEffect(() => {
    if (!friendId) return;

    const fetchFriend = async () => {
      try {
        const friendFromStore = user.friends.find(
          (friend: FriendType) => friend.uid === friendId
        );

        const [userData, requestData] = await Promise.all([
          friendFromStore
            ? Promise.resolve(friendFromStore)
            : PeopleService.getUserById(friendId),
          PeopleService.getFriendRequestById(user, friendId),
        ]);

        setFriend(userData);

        if (user.friends.some((f: FriendType) => f.uid === userData.uid)) {
          setRequestStatus("friends");
        } else {
          setRequestStatus(requestData ? "pending" : "not-sent");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriend();
  }, [friendId, user]);

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

  const handleAddFriend = useCallback(async () => {
    if (!friend || !user) return;

    setRequestStatus("pending");
    try {
      await PeopleService.sendFriendRequest(user, friend.uid);
      Toast.show({
        type: "success",
        text1: "Friend request sent",
        visibilityTime: 3000,
      });

      const updatedUser = await UserService.getCurrentUser(auth.currentUser);
      dispatch(setUser(updatedUser));
    } catch (error) {
      console.error("Failed to send friend request:", error);
      Toast.show({
        type: "error",
        text1: "Failed to send friend request",
        visibilityTime: 3000,
      });

      setRequestStatus("not-sent");
    }
  }, [friend, user, dispatch]);

  const renderFriendStatus = useCallback(() => {
    switch (requestStatus) {
      case "friends":
        return (
          <View className="items-center justify-center bg-black p-3 rounded-md flex-row gap-2">
            <Text className=" text-white">Your friend</Text>
            <Check />
          </View>
        );
      case "pending":
        return (
          <View className=" items-center justify-center">
            <Text className=" text-xl">Pending...</Text>
          </View>
        );
      default:
        return (
          <TouchableOpacity
            onPress={handleAddFriend}
            className="p-3 bg-black rounded-md w-1/3 items-center"
          >
            <Text className="text-white text-xl">Add</Text>
          </TouchableOpacity>
        );
    }
  }, [requestStatus, handleAddFriend]);

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
    <SafeAreaView>
      <ScrollView>
        <View className="items-center py-8">
          <View className="w-[80%] gap-8">
            <View className="flex-row items-center gap-3">
              <UserCircleIcon width={60} height={60} />
              <Text className="text-3xl font-bold">{friend.username}</Text>
            </View>
            <Text>Email: {friend.email}</Text>
            <View className="flex-row justify-between">
              {renderFriendStatus()}
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
      <Toast />
    </SafeAreaView>
  );
}
