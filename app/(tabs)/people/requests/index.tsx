import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { IncomingFriendRequest, OutgoingFriendRequest } from "@/types";
import { PeopleService } from "@/services/people";
import Loading from "@/components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Plus, X, UserCircleIcon } from "lucide-react-native";
import { UserService } from "@/services/user";
import { auth } from "@/firebaseConfig/config";
import { setUser } from "@/store/authSlice";
import Toast from "react-native-toast-message";

export default function RequestsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) return null;
  const [incomingRequests, setIncomingRequests] = useState<
    IncomingFriendRequest[]
  >([]);
  const [outgoingRequests, setOutgoingRequests] = useState<
    OutgoingFriendRequest[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [incoming, outgoing] = await Promise.all([
          PeopleService.fetchIncomingFriendRequests(user),
          PeopleService.fetchOutgoingFriendRequests(user),
        ]);

        setIncomingRequests(incoming);
        setOutgoingRequests(outgoing);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const handleRequest = async (
    friendID: string,
    action: "accept" | "reject"
  ) => {
    if (!user) return;

    setIncomingRequests((prev) =>
      prev.filter((req) => req.sender.uid !== friendID)
    );

    Toast.show({
      type: "success",
      text1:
        action === "accept"
          ? "Friend request accepted"
          : "Friend request rejected",
      visibilityTime: 3000,
    });

    try {
      if (action === "accept") {
        await PeopleService.acceptFriendRequest(user, friendID);
      } else {
        await PeopleService.rejectFriendRequest(user, friendID);
      }

      const updatedUser = await UserService.getCurrentUser(auth.currentUser);
      dispatch(setUser(updatedUser));

      const [incoming, outgoing] = await Promise.all([
        PeopleService.fetchIncomingFriendRequests(updatedUser),
        PeopleService.fetchOutgoingFriendRequests(updatedUser),
      ]);
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      Toast.show({
        type: "error",
        text1: `Failed to ${action} request`,
        visibilityTime: 3000,
      });
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <View className="justify-center items-center py-8">
            <View className="w-[80%]">
              <Text className="text-3xl font-semibold">Incoming requests</Text>
            </View>
          </View>
          {incomingRequests.length === 0 ? (
            <View className="items-center">
              <Text>No requests</Text>
            </View>
          ) : (
            incomingRequests.map((item) => (
              <View key={item.requestID} className="items-center">
                <View className="w-[80%] p-7 bg-white rounded-xl mb-4">
                  <View className="flex-row justify-between">
                    <View className="flex-row gap-3 items-center">
                      {" "}
                      <UserCircleIcon width={40} height={40} />
                      <Text className="text-2xl font-semibold">
                        {item.sender.username}
                      </Text>
                    </View>

                    <View className="flex-row gap-2 items-center">
                      <TouchableOpacity
                        className="p-3 bg-black rounded-md items-center"
                        onPress={() => handleRequest(item.sender.uid, "accept")}
                      >
                        <Plus color="lightgreen" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="p-3 bg-black rounded-md  items-center"
                        onPress={() => handleRequest(item.sender.uid, "reject")}
                      >
                        <X color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View>
          <View className="justify-center items-center py-8">
            <View className="w-[80%]">
              <Text className="text-3xl font-semibold">Outgoing requests</Text>
            </View>
          </View>
          {outgoingRequests.length === 0 ? (
            <View className="items-center">
              <Text>No requests</Text>
            </View>
          ) : (
            outgoingRequests.map((item) => (
              <View key={item.requestID} className="items-center">
                <View className="flex-row items-center gap-5">
                  <UserCircleIcon width={40} height={40} />
                  <Text className="text-2xl font-semibold">
                    {item.receiver.username}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}
