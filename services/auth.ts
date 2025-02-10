import { auth, db } from "@/firebaseConfig/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const AuthService = {
  signIn: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  signUp: async (
    email: string,
    password: string,
    username: string
  ): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
      });
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
