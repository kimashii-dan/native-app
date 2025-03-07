import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { FriendType } from "@/types";
import { router } from "expo-router";
import { UserCircleIcon } from "lucide-react-native";
import { PeopleService } from "@/services/people";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
export default function People() {
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) return null;

  const [users, setUsers] = useState<FriendType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const notFriends = await PeopleService.fetchNotFriends(user);
        setUsers(notFriends);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (!users) {
    return (
      <SafeAreaView>
        <View>
          <Text>Error fetching users</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-screen">
      <ScrollView>
        <View>
          <View className="justify-center items-center py-8">
            <View className="w-[80%] flex flex-row justify-between">
              <Text className="text-3xl font-semibold">Your Friends</Text>
              <TouchableOpacity
                className="p-3 bg-black rounded-md  items-center"
                onPress={() => router.push("/people/requests")}
              >
                <Text className="text-white">Requests</Text>
              </TouchableOpacity>
            </View>
          </View>
          {user.friends.length === 0 ? (
            <View className="items-center">
              <Text>No friends yet. Start adding some!</Text>
            </View>
          ) : (
            user.friends.map((friend) => (
              <View key={friend.uid} className="items-center">
                <TouchableOpacity
                  onPress={() => router.push(`/people/${friend.uid}`)}
                  className="w-[80%] p-7 bg-white rounded-xl mb-4"
                >
                  <View className="flex-row items-center gap-5">
                    <UserCircleIcon width={40} height={40} />
                    <Text className="text-2xl font-semibold">
                      {friend.username}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {users.length === 0 ? (
          <View></View>
        ) : (
          <View>
            <View className="justify-center items-center py-8">
              <View className="w-[80%]">
                <Text className="text-3xl font-semibold">
                  People you might know
                </Text>
              </View>
            </View>
            {users.map((item) => (
              <View key={item.uid} className="items-center">
                <TouchableOpacity
                  onPress={() => router.push(`/people/${item.uid}`)}
                  className="w-[80%] p-7 bg-white rounded-xl mb-4"
                >
                  <View className="flex-row items-center gap-5">
                    <UserCircleIcon width={40} height={40} />
                    <Text className="text-2xl font-semibold">
                      {item.username}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
