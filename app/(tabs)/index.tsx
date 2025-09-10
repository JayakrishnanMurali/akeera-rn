import { Button, Card, Typography } from "@/components/ui";
import { useTheme } from "@/src/theme";
import { FlatList, Image, View } from "react-native";
import { useTrending } from "@/src/features/explore/useTrending";

export default function ExploreIndex() {
  const { theme } = useTheme();
  const { data, isLoading, error, refetch, isRefetching } = useTrending(20);
  const items = data?.items ?? [];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
      }}
    >
      <Typography variant="h1" style={{ marginBottom: 12 }}>
        Explore
      </Typography>
      {error ? (
        <Card style={{ padding: 12, marginBottom: 12 }}>
          <Typography muted>Failed to load trending.</Typography>
          <View style={{ height: 8 }} />
          <Button onPress={() => refetch()}>Retry</Button>
        </Card>
      ) : null}
      <FlatList
        data={items}
        refreshing={isRefetching}
        onRefresh={refetch}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: "row" }}>
              {item.coverUrl ? (
                <Image
                  source={{ uri: item.coverUrl }}
                  style={{ width: 72, height: 96, borderRadius: theme.radii.md, marginRight: 12 }}
                />
              ) : null}
              <View style={{ flex: 1 }}>
                <Typography variant="h3">{item.title}</Typography>
                {item.description ? (
                  <Typography muted numberOfLines={2} style={{ marginTop: 6 }}>
                    {item.description}
                  </Typography>
                ) : null}
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          isLoading ? (
            <Typography muted>Loading trending…</Typography>
          ) : (
            <Typography muted>No items.</Typography>
          )
        }
      />
    </View>
  );
}
