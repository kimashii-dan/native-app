import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig/config";
import { User } from "@/store/authSlice";
import { router } from "expo-router";
import { UserCircleIcon } from "lucide-react-native";

export default function People() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);

        const usersList: User[] = usersSnapshot.docs
          .map((doc) => ({
            uid: doc.id,
            email: doc.data().email || null,
            username: doc.data().username || null,
          }))
          .filter((user) => user.uid !== currentUser?.uid);

        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
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
            ItemSeparatorComponent={() => <View className="h-10" />}
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
