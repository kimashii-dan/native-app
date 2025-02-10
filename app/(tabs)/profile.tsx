import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { signOut } from "@firebase/auth";
import { auth } from "@/firebaseConfig/config";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { UserCircleIcon } from "lucide-react-native";

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      console.log("User signed out");
      router.push("/");
    } catch (error: any) {
      console.error("Sign-out error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
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
              onPress={signOutUser}
              className="p-3 bg-black rounded-md w-1/3 items-center mt-5"
            >
              <Text className="text-white text-xl">Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
