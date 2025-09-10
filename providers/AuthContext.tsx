import { getUser } from "@/api/db/user";
import useAppSession from "@/hooks/useAppSession";
import { supabase } from "@/lib/supabase";
import { UserState, useUserStore } from "@/store/userStore";
import { Session } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  createContext,
  type PropsWithChildren,
  use,
  useCallback,
  useMemo,
} from "react";

const redirectTo = makeRedirectUri();

const AuthContext = createContext<{
  session: Session | null;
  loading: boolean;
  signIn: (provider: "google" | "apple") => Promise<void>;
}>({
  session: null,
  loading: true,
  signIn: async () => {},
});

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;
  if (!access_token) return;
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

export function SessionProvider({ children }: PropsWithChildren) {
  const { session, loading, setSession } = useAppSession();
  const { updateUserState } = useUserStore();

  const signIn = useCallback(async (provider: "google" | "apple") => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    const res = await WebBrowser.openAuthSessionAsync(
      data?.url ?? "",
      redirectTo
    );

    if (res.type === "success") {
      const { url } = res;
      const session = await createSessionFromUrl(url);
      if (session) {
        const user = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.full_name || "",
          picture: session.user.user_metadata.avatar_url || "",
          auth: {
            provider: session.user.app_metadata.provider,
          },
        } as UserState;

        const realUser = await getUser(user.email!);

        // TODO:set user language if useer exists

        updateUserState(realUser || user);
        setSession(session);

        router.replace(realUser?.onboardingCompleted ? "/(home)" : '/account/choose-native-language');
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      loading,
      signIn,
    }),
    [session, loading]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}
