import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Slot } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig/config";
import { setUser, clearUser } from "../store/authSlice";
import { ActivityIndicator, View } from "react-native";
import { doc, getDoc } from "firebase/firestore";

export default function AppContent() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          let username = "";
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            username = data.username;
          }

          const userData = {
            uid: currentUser.uid,
            email: currentUser.email,
            username,
          };

          dispatch(setUser(userData));
        } catch (error) {
          console.error("Error fetching user document:", error);
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
      }
      setLoading(false);
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
