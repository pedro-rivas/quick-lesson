import { FlatListProps, FlatList as RNFlatList, ScrollView as RNScrollView, ScrollViewProps } from "react-native";

export const ScrollView = ({ children, ...props }: ScrollViewProps) => {
  return <RNScrollView {...props}>{children}</RNScrollView>;
};

export const FlatList = <T,>(props: FlatListProps<T>) => {
  return <RNFlatList {...props} />;
}
