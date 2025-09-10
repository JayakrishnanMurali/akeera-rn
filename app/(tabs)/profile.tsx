import React from "react";
import { View } from "react-native";
import { useTheme } from "@/src/theme";
import { Typography } from "@/components/ui";

export default function ProfileScreen() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
        padding: 16,
      }}
    >
      <Typography variant="h2" style={{ marginBottom: 8 }}>
        Profile
      </Typography>
      <Typography muted>Manage your account and settings.</Typography>
    </View>
  );
}

