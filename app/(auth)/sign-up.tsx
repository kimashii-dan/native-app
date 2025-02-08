import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "@/firebaseConfig/config";
import { db } from "@/firebaseConfig/config";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const signUp = async (data: FormData) => {
    setLoading(true);
    const { email, password, username } = data;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up", userCredential.user.email);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
      });

      console.log("User data stored in Firestore.");

      router.push("/(tabs)/home");
    } catch (error: any) {
      console.error("Sign-up error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-center">
      <View className="flex-1 justify-center items-center">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-[80%] gap-5"
        >
          <Text className="text-5xl text-center mb-8">Sign Up</Text>

          <View>
            <Text className="text-xl mb-2">Username</Text>
            <Controller
              control={control}
              name="username"
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your username"
                  className="p-5 border-black border-2 rounded-md"
                />
              )}
            />
            {errors.username && (
              <Text className="text-red-500">{errors.username.message}</Text>
            )}
          </View>

          <View>
            <Text className="text-xl mb-2">Email</Text>
            <Controller
              control={control}
              name="email"
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  className="p-5 border-black border-2 rounded-md"
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-500">{errors.email.message}</Text>
            )}
          </View>

          <View>
            <Text className="text-xl mb-2">Password</Text>
            <Controller
              control={control}
              name="password"
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your password"
                  secureTextEntry
                  className="p-5 border-black border-2 rounded-md"
                />
              )}
            />
            {errors.password && (
              <Text className="text-red-500">{errors.password.message}</Text>
            )}
          </View>

          <TouchableOpacity
            className="p-5 bg-black rounded-md items-center"
            onPress={handleSubmit(signUp)}
          >
            <Text className="text-white text-xl">Submit</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className="text-lg">Already have an account? </Text>
            <Link
              href="/(auth)/sign-in"
              className="text-lg underline text-blue-600"
            >
              Sign in
            </Link>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
