import useTheme from "@/hooks/useTheme";
import React, { useCallback, useMemo } from "react";
import {
  FlatListProps,
  FlatList as RNFlatList,
  ScrollView as RNScrollView,
  ScrollViewProps,
  View,
} from "react-native";

export const ScrollView = ({ children, ...props }: ScrollViewProps) => {
  return <RNScrollView {...props}>{children}</RNScrollView>;
};

export const FlatList = <T,>(props: FlatListProps<T>) => {
  return <RNFlatList {...props} />;
};

export const Section = React.memo(
  <T,>({ style, contentContainerStyle, ...props }: FlatListProps<T>) => {
    const theme = useTheme();

    const styles = useMemo(
      () => ({
        style: [style],
        contentContainerStyle: [
          theme.cs.sectionList,
          {
            borderColor: theme.colors.border,
          },
          contentContainerStyle,
        ],
        itemSeparator: { height: 2, backgroundColor: theme.colors.border },
      }),
      [theme]
    );

    const itemSeparator = useMemo(() => {
      return () => <View style={styles.itemSeparator} />;
    }, [styles.itemSeparator]);

    const keyExtractor = useCallback(
      (item: T & { id: string }, index: number) => {
        return item?.id || index.toString();
      },
      []
    );

    return (
      <RNFlatList<T>
        style={styles.style}
        contentContainerStyle={styles.contentContainerStyle}
        ItemSeparatorComponent={itemSeparator}
        initialNumToRender={10}
        windowSize={7}
        // @ts-ignore
        keyExtractor={props.keyExtractor || keyExtractor}
        {...props}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.renderItem === nextProps.renderItem
) as <T>(props: FlatListProps<T>) => React.ReactElement;
