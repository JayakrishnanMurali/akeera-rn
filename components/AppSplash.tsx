import { BookOpen } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../src/theme";
import Typography from "./ui/Typography";

export default function AppSplash() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
      }}
    >
      <BookOpen color={colors.accent} size={72} strokeWidth={1.75} />
      <Typography
        variant="h2"
        weight="bold"
        style={{ color: colors.accent, marginTop: spacing.md }}
      >
        akeera.
      </Typography>
    </View>
  );
}
