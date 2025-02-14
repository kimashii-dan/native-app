import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import { FriendType } from "@/types";
import { router } from "expo-router";
import { UserCircleIcon } from "lucide-react-native";
import { PeopleService } from "@/services/people";
import Loading from "@/components/Loading";

export default function People() {
  const [users, setUsers] = useState<FriendType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await PeopleService.fetchAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!users) {
    return (
      <SafeAreaView>
        <View>
          <Text>Sorry</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="">
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        ListHeaderComponent={() => (
          <View className="justify-center items-center py-8 ">
            <View className="w-[80%]">
              <Text className="text-3xl font-semibold">
                People you might know
              </Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="items-center">
            <TouchableOpacity
              onPress={() => router.push(`/people/${item.uid}`)}
              className="w-[80%] p-7 bg-white rounded-xl mb-4"
            >
              <View className="flex-row items-center gap-5">
                <UserCircleIcon width={40} height={40} />
                <Text className="text-2xl font-semibold">{item.username}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
