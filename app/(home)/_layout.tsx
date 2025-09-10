import { useUserStore } from "@/store/userStore";
import { Redirect, Slot } from "expo-router";

export default function HomeLayout() {

  const onboardingCompleted = useUserStore((s) => s.user.onboardingCompleted);

  if(!onboardingCompleted){
    return <Redirect href="/account/choose-native-language" />
  }

  return <Slot screenOptions={{ headerShown: false }} />;
}