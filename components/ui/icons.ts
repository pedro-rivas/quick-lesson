import { Platform } from "react-native";

const isIOS = Platform.OS === "ios";

const icons ={
  "arrow-back": isIOS ? "chevron.left" : "arrow-back",
  "delete": "delete",
};

export type IconSymbolName = keyof typeof icons;

export default icons;