import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import UserType from "@/types/userType";
import { UserCircleIcon } from "lucide-react-native";
import { PeopleService } from "@/services/people";
import Loading from "@/components/Loading";

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<UserType>();
  const [loading, setLoading] = useState<boolean>(true);

  const userId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await PeopleService.getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="h-screen">
      <ScrollView>
        <View className="items-center py-8">
          <View className="w-[80%] gap-8">
            <View className="flex-row items-center gap-3">
              <UserCircleIcon width={60} height={60} />

              <Text className="text-3xl font-bold">{user?.username}</Text>
            </View>

            <Text>Email: {user?.email}</Text>

            <TouchableOpacity
              onPress={() => {}}
              className="p-3 bg-black rounded-md w-1/3 items-center"
            >
              <Text className="text-white text-xl">Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
