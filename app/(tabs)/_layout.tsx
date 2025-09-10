import { useTheme } from "@/src/theme";
import { Tabs } from "expo-router";
import { Bookmark, Home, Search, User } from "lucide-react-native";
import React from "react";

export default function TabsLayout() {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShown: false,
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: theme.mode === "dark" ? "#1A1A1A" : colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Home color={color} size={22} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Search color={color} size={22} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <Bookmark color={color} size={22} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <User color={color} size={22} strokeWidth={1.75} />
          ),
        }}
      />
    </Tabs>
  );
}
