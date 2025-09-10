import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import AppSplash from "../components/AppSplash";
import { ThemeProvider } from "../src/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulate any startup work (e.g., fonts, config). Keep quick for now.
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const onLayout = useCallback(async () => {
    // Hide the native splash as soon as our JS splash (or app) has layout.
    try {
      await SplashScreen.hideAsync();
    } catch {}
  }, []);

  return (
    <ThemeProvider>
      <View style={{ flex: 1 }} onLayout={onLayout}>
        {ready ? <Stack /> : <AppSplash />}
      </View>
    </ThemeProvider>
  );
}
