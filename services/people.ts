import { db } from "@/firebaseConfig/config";
import { FriendType, FriendRequest, UserType } from "@/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  Timestamp,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

export const PeopleService = {
  fetchNotFriends: async (currentUser: UserType): Promise<FriendType[]> => {
    try {
      if (!currentUser) throw new Error("Unauthorized");

      const friendUIDs = new Set(
        currentUser.friends.map((friend) => friend.uid)
      );

      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);

      const usersList: FriendType[] = usersSnapshot.docs
        .map((doc) => ({
          uid: doc.id,
          email: doc.data().email || null,
          username: doc.data().username || null,
        }))
        .filter((user) => {
          return user.uid !== currentUser.uid && !friendUIDs.has(user.uid);
        });

      return usersList;
    } catch (error: any) {
      console.error("Error fetching all users:", error);
      throw new Error(error.message);
    }
  },

  getUserById: async (uid: string): Promise<FriendType> => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      const data = userDocSnap.data();
      if (!data) {
        throw new Error(`User document not found for uid: ${uid}`);
      }
      const userData: FriendType = {
        uid,
        email: data.email || null,
        username: data.username || null,
      };
      return userData;
    } catch (error) {
      console.error(`Error fetching user with id ${uid}:`, error);
      throw error;
    }
  },

  fetchFriends: async (currentUser: UserType): Promise<FriendType[]> => {
    try {
      if (!currentUser) throw new Error("Unauthorized");

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.data();

      if (!userData?.friends?.length) {
        return [];
      }

      const friendsPromises = userData.friends.map(
        async (friendUID: string) => {
          const friendDoc = await getDoc(doc(db, "users", friendUID));
          if (friendDoc.exists()) {
            return {
              uid: friendDoc.id,
              email: friendDoc.data().email,
              username: friendDoc.data().username,
            };
          }
        }
      );

      const friendsList = await Promise.all(friendsPromises);

      return friendsList;
    } catch (error) {
      console.error("Error fetching friends list:", error);
      throw error;
    }
  },

  sendFriendRequest: async (
    currentUser: UserType,
    receiverID: string
  ): Promise<void> => {
    try {
      if (!currentUser) throw new Error("Unauthorized");

      const requestID = [currentUser.uid, receiverID].sort().join("_");
      const friendRequestRef = doc(db, "friendRequests", requestID);

      const existingRequest = await getDoc(friendRequestRef);
      if (existingRequest.exists()) {
        const data = existingRequest.data();
        if (data.senderID === currentUser.uid) {
          throw new Error("You already sent a request to this user.");
        } else {
          throw new Error("This user already sent you a request.");
        }
      }

      await setDoc(friendRequestRef, {
        requestID,
        senderID: currentUser.uid,
        receiverID: receiverID,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
      throw error;
    }
  },

  acceptFriendRequest: async (
    currentUser: UserType,
    senderID: string
  ): Promise<void> => {
    try {
      if (!currentUser) throw new Error("Unauthorized");

      const senderRef = doc(db, "users", senderID);
      const senderSnap = await getDoc(senderRef);
      const data = senderSnap.data();
      if (!data) {
        throw new Error(`User document not found for uid: ${senderID}`);
      }
      const senderData: FriendType = {
        uid: senderID,
        email: data.email || null,
        username: data.username || null,
      };

      const receiverRef = doc(db, "users", currentUser.uid);
      const currentUserData: FriendType = {
        uid: currentUser.uid,
        email: currentUser.email,
        username: currentUser.username,
      };
      await Promise.all([
        updateDoc(senderRef, {
          friends: arrayUnion(currentUserData),
        }),
        updateDoc(receiverRef, {
          friends: arrayUnion(senderData),
        }),
      ]);

      const requestID = [senderID, currentUser.uid].sort().join("_");
      const friendRequestRef = doc(db, "friendRequests", requestID);
      await deleteDoc(friendRequestRef);
    } catch (error) {
      console.error("Error accepting friend request:", error);
      throw error;
    }
  },

  rejectFriendRequest: async (
    currentUser: UserType,
    senderID: string
  ): Promise<void> => {
    try {
      if (!currentUser) throw new Error("Unauthorized");
      const requestID = [senderID, currentUser.uid].sort().join("_");
      const friendRequestRef = doc(db, "friendRequests", requestID);
      await deleteDoc(friendRequestRef);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      throw error;
    }
  },

  fetchIncomingFriendRequests: async (
    currentUser: UserType
  ): Promise<{ requestID: string; sender: FriendType }[]> => {
    try {
      if (!currentUser) throw new Error("Unauthorized");

      const friendRequestsCollection = collection(db, "friendRequests");
      const q = query(
        friendRequestsCollection,
        where("receiverID", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      const requests = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const requestID = docSnap.id;
          const { senderID } = docSnap.data();
          const sender = await PeopleService.getUserById(senderID);

          return { requestID, sender };
        })
      );

      return requests;
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      throw error;
    }
  },

  fetchOutgoingFriendRequests: async (
    currentUser: UserType
  ): Promise<{ requestID: string; receiver: FriendType }[]> => {
    try {
      if (!currentUser) throw new Error("Unauthorized");

      const friendRequestsCollection = collection(db, "friendRequests");
      const q = query(
        friendRequestsCollection,
        where("senderID", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      const requests = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const requestID = docSnap.id;
          const { receiverID } = docSnap.data();
          const receiver = await PeopleService.getUserById(receiverID);

          return { requestID, receiver };
        })
      );

      return requests;
    } catch (error) {
      console.error("Error fetching sent friend requests:", error);
      throw error;
    }
  },

  getFriendRequestById: async (
    currentUser: UserType,
    friendID: string
  ): Promise<FriendRequest | null> => {
    try {
      if (!currentUser) throw new Error("Unauthorized");

      const requestID = [currentUser.uid, friendID].sort().join("_");
      const friendRequestRef = doc(db, "friendRequests", requestID);
      const docSnap = await getDoc(friendRequestRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      return {
        requestID: docSnap.id,
        senderID: data.senderID,
        receiverID: data.receiverID,
        createdAt: data.createdAt,
      };
    } catch (error) {
      console.error("Error fetching friend request:", error);
      throw error;
    }
  },
};
