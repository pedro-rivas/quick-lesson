import i18next from "i18next";
import { Alert } from "react-native";

export const recordError = (tag: string, error: any) => {
  if (__DEV__) {
    console.error("__DEV__: ", tag, " => ", error);
  }

  Alert.alert(i18next.t("Something went wrong"), error.message);
};

export const log = (...args: any[]) => {
  if (__DEV__) {
    console.log("[*_*]: ", ...args);
  }
};
