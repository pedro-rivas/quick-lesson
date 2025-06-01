import { ScrollView as RNScrollView, ScrollViewProps } from "react-native";

export const ScrollView = ({ children, ...props }: ScrollViewProps) => {
  return <RNScrollView {...props}>{children}</RNScrollView>;
};
