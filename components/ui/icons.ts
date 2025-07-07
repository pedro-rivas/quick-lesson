import { Platform } from "react-native";

const isIOS = Platform.OS === "ios";

const icons = {
  "arrow-back": isIOS ? "chevron.left" : "arrow-back",
  delete: "delete",
  language: "language",
  "check-circle": "check-circle",
  "radio-button-unchecked": "radio-button-unchecked",
  "keyboard-arrow-right": 'keyboard-arrow-right',
  "add-circle": "add-circle",
  'close': 'close',
};

export type IconSymbolName = keyof typeof icons;

export default icons;
