import { useColorScheme } from "@/hooks/useColorScheme";
import "@/i18n";
import { SessionProvider, useSession } from "@/providers/AuthContext";
import { SplashScreenController } from "@/splash";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "react-native-reanimated";

const DarkTheme = {
  ...NavigationDarkTheme,
  borderWidth: 1.5,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#121212",
    primary: "#0b57d0",
  },
}

const LightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: "#fff",
    primary: "#0b57d0",
  },
  borderWidth: 1.5,
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : LightTheme}>
        <SessionProvider>
          <SplashScreenController />
          <RootNavigator />
        </SessionProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});
// Separate this into a new component so it can access the SessionProvider context later
function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(home)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="landing" />
      </Stack.Protected>
    </Stack>
  );
}
