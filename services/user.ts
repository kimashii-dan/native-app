import { db } from "@/firebaseConfig/config";
import UserType from "@/types/userType";
import { User } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

export const UserService = {
  getCurrentUser: async (currentUser: User | null): Promise<UserType> => {
    if (!currentUser) {
      throw new Error("401: Unauthorized bro");
    }

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      const data = userDocSnap.data();

      if (!data) {
        throw new Error("User document not found");
      }

      const userData: UserType = {
        uid: currentUser.uid,
        email: currentUser.email,
        username: data.username || null,
      };

      return userData;
    } catch (error) {
      console.error("Error fetching user document:", error);
      throw error;
    }
  },
};
