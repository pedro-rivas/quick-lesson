import "react-native-url-polyfill/auto";

import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

export default function useAppSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const value = useMemo(
    () => ({ session, loading, setSession }),
    [session, loading]
  );

  return value;
}
