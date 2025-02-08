import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Home() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <SafeAreaView className="">
      <ScrollView>
        <View className="flex-1 justify-center items-center py-8">
          <View className="w-[80%] ">
            <Text className="text-3xl">Welcome home, {user?.username}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
