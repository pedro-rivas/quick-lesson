import useAppSession from "@/hooks/useAppSession";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { createContext, type PropsWithChildren, use, useMemo } from "react";

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

  const signIn = async (provider: "google" | "apple") => {
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
      if (session) setSession(session);
    }
  };

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
