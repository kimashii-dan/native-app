import React from "react";
import { Stack } from "expo-router";

export default function PeopleLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]/index"
        options={{
          headerShown: false,
          headerTitle: "Profile",
        }}
      />
      <Stack.Screen
        name="[id]/[chatId]/index"
        options={({ route }) => {
          const { username } = route.params as { username?: string };
          return { title: username ?? "Chat" };
        }}
      />
    </Stack>
  );
}
