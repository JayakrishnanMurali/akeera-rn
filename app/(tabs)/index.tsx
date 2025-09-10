import { View } from "react-native";
import { Button, Card, Typography } from "@/components/ui";
import { useTheme } from "@/src/theme";

export default function ExploreIndex() {
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
      <Typography variant="h1" style={{ marginBottom: 8 }}>Akeera</Typography>
      <Typography variant="subtitle" muted style={{ marginBottom: 16 }}>
        Design system demo with Supabase green
      </Typography>

      <Card style={{ width: "90%", maxWidth: 480 }}>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Welcome
        </Typography>
        <Typography muted style={{ marginBottom: 16 }}>
          Buttons below use the accent color from the theme.
        </Typography>
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginRight: 12 }}>
            <Button>Primary</Button>
          </View>
          <View style={{ marginRight: 12 }}>
            <Button variant="outline">Outline</Button>
          </View>
          <Button variant="ghost">Ghost</Button>
        </View>
      </Card>
    </View>
  );
}

