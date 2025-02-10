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
import { Link } from "expo-router";
import { AuthService } from "@/services/auth";
import Loading from "@/components/Loading";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const signIn = async (credentials: FormData) => {
    setLoading(true);
    const { email, password } = credentials;
    try {
      const response = await AuthService.signIn(email, password);
      console.log("User signed in", response.email);
    } catch (error: any) {
      console.log("Sign in error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 justify-center bg-white">
      <View className="flex-1 justify-center items-center">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-[80%] gap-5"
        >
          <Text className="text-5xl">Sign in</Text>

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
            onPress={handleSubmit(signIn)}
          >
            <Text className="text-white text-xl">Submit</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className="text-lg">Don't have an account? </Text>
            <Link href="/sign-up" className="text-lg underline text-blue-600">
              Sign up
            </Link>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
