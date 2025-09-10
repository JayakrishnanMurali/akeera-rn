import { Typography } from "@/components/ui";
import { useTheme } from "@/src/theme";
import { View } from "react-native";

export default function ExploreIndex() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <Typography variant="h1">Hey</Typography>
    </View>
  );
}
