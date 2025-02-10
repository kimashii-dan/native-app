import { RootState } from "@/store/store";
import { Redirect, Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { User, Home, Users } from "lucide-react-native";
export default function TabsLayout() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Home color={focused ? "blue" : "black"} />
          ),
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: "People",
          tabBarIcon: ({ focused }) => (
            <Users color={focused ? "blue" : "black"} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <User color={focused ? "blue" : "black"} />
          ),
        }}
      />
    </Tabs>
  );
}
