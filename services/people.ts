import { auth, db } from "@/firebaseConfig/config";
import { FriendType, UserType } from "@/types";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const PeopleService = {
  fetchAllUsers: async (): Promise<FriendType[]> => {
    try {
      const currentUser = auth.currentUser;
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);

      const usersList: FriendType[] = usersSnapshot.docs
        .map((doc) => ({
          uid: doc.id,
          email: doc.data().email || null,
          username: doc.data().username || null,
        }))
        .filter((user) => user.uid !== currentUser?.uid);

      return usersList;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getUserById: async (uid: string): Promise<FriendType> => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      const data = userDocSnap.data();

      if (!data) {
        throw new Error("User document not found");
      }

      const userData: FriendType = {
        uid,
        email: data.email || null,
        username: data.username || null,
      };

      return userData;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },
};
