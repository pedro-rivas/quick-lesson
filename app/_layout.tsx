import { useColorScheme } from "@/hooks/useColorScheme";
import "@/i18n";
import { getBestLocale } from "@/i18n";
import { RootNavigator } from "@/navigation";
import { SessionProvider } from "@/providers/AuthContext";
import { ThemeProvider } from "@/providers/ThemeContext";
import { SplashScreenController } from "@/splash";
import { useUserStore } from "@/store/userStore";
import { DarkTheme, LightTheme } from "@/theme";
import { ThemeProvider as NativeThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { setLanguage, setPreferredLanguage } = useUserStore();

  useEffect(() => {
    const lang = getBestLocale();
    setLanguage(lang);
    setPreferredLanguage(lang);
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <StatusBar
        backgroundColor={colorScheme === "dark" ? "black" : "white"}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <NativeThemeProvider
        value={colorScheme === "dark" ? DarkTheme : LightTheme}
      >
        <ThemeProvider>
          <SessionProvider>
            <SplashScreenController />
            <RootNavigator />
          </SessionProvider>
        </ThemeProvider>
      </NativeThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});
