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
    <SafeAreaView className="">
      <ScrollView>
        <View className="flex-1 justify-center items-center py-8">
          <View className="w-[80%] gap-5">
            <Text className="text-3xl">Profile</Text>
            <Text>Email: {user?.email}</Text>
            <Text>Username: {user?.username}</Text>
            <TouchableOpacity
              onPress={signOutUser}
              className="p-5 bg-black rounded-md items-center"
            >
              <Text className="text-white text-xl">Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
