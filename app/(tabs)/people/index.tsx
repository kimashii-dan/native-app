import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import UserType from "@/types/userType";
import { router } from "expo-router";
import { UserCircleIcon } from "lucide-react-native";
import { PeopleService } from "@/services/people";
import Loading from "@/components/Loading";

export default function People() {
  const [users, setUsers] = useState<UserType[]>([]);
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

  return (
    <SafeAreaView className="">
      <View className=" justify-center items-center py-8">
        <View className="w-[80%] gap-8">
          <Text className="text-3xl font-semibold">People you might know</Text>
          <FlatList
            scrollEnabled={false}
            data={users}
            keyExtractor={(item) => item.uid}
            ItemSeparatorComponent={() => <View className="h-9" />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/people/${item.uid}`)}
                className="p-7 bg-white rounded-xl "
              >
                <View className="  flex-row items-center justify-start gap-5">
                  <UserCircleIcon width={40} height={40} />
                  <Text className="text-2xl font-semibold">
                    {item.username}
                  </Text>
                  <View></View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
