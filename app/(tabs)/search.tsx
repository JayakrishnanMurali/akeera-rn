import React from "react";
import { View } from "react-native";
import { useTheme } from "@/src/theme";
import { Typography } from "@/components/ui";

export default function SearchScreen() {
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
        Search
      </Typography>
      <Typography muted>Find content across the catalog.</Typography>
    </View>
  );
}

