import { useColorScheme } from "@/hooks/useColorScheme";
import "@/i18n";
import { changeAppLanguage, getBestLocale } from "@/i18n";
import { RootNavigator } from "@/navigation";
import { SessionProvider } from "@/providers/AuthContext";
import { ThemeProvider } from "@/providers/ThemeContext";
import { SplashScreenController } from "@/splash";
import { useAppStore } from "@/store/appStore";
import { useUserStore } from "@/store/userStore";
import { commonStyles as cs } from "@/styles/common";
import { DarkTheme, LightTheme } from "@/theme";
import { ThemeProvider as NativeThemeProvider } from "@react-navigation/native";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const { setLanguage, } = useAppStore()
  const userLanguage = useUserStore((s) => s.userPreferences.language);

  useEffect(() => {
    const systemLang = getBestLocale();
    const lang = userLanguage || systemLang;
    if(!userLanguage){
      setLanguage(lang);
    }
    changeAppLanguage(lang);
  }, []);

  return (
    <GestureHandlerRootView style={cs.f_1}>
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
