import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { UserCircleIcon } from "lucide-react-native";
import { AuthService } from "@/services/auth";
import Loading from "@/components/Loading";

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);

  const signOut = async () => {
    setLoading(true);
    try {
      await AuthService.signOut();
      console.log("User signed out");
    } catch (error: any) {
      console.log("Sign out error:", error.message);
    } finally {
      setLoading(false);
    }
  };

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
              onPress={signOut}
              className="p-3 bg-black rounded-md w-1/3 items-center"
            >
              <Text className="text-white text-xl">Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
