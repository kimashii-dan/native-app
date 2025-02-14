import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Slot } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig/config";
import { setUser, clearUser } from "../store/authSlice";
import { ActivityIndicator, View } from "react-native";
import { UserService } from "@/services/user";

export default function AppContent() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userData = await UserService.getCurrentUser(currentUser);
          dispatch(setUser(userData));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        dispatch(clearUser());
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
