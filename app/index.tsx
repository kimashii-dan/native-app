import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { Redirect, router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }
  return (
    <SafeAreaView className="justify-center items-center h-screen">
      <View className="w-[80%]  gap-8">
        <Text className="text-xl font-semibold">
          Real-time chat app with React Native, Expo, Firebase, Redux
        </Text>
        <TouchableOpacity onPress={() => router.push("/sign-in")}>
          <Text className="underline text-blue-500">Continue with email</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
