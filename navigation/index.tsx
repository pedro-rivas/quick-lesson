import { useSession } from "@/providers/AuthContext";
import { Stack } from "expo-router";

export function RootNavigator() {
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
