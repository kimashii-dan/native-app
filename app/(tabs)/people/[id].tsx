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
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig/config";
import { User } from "@/store/authSlice";
import { UserCircleIcon } from "lucide-react-native";

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);

  const userId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser({ uid: userId, email: data.email, username: data.username });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
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
              onPress={() => {}}
              className="p-3 bg-blue-600 rounded-md w-1/3 items-center"
            >
              <Text className="text-white text-xl">Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
