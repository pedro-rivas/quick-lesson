import { useThemedStyles } from "@/providers/ThemeContext";
import { commonStyles as cs } from "@/styles/common";
import React, { useCallback, useMemo } from "react";
import {
  CellRendererProps,
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
  <T,>({ style, ...props }: FlatListProps<T>) => {
    const themedStyles = useThemedStyles();

    const itemsCount = useMemo(() => props.data?.length || 0, [props.data]);

    const keyExtractor = useCallback(
      (item: T & { id: string }, index: number) => {
        return item?.id || index.toString();
      },
      []
    );

    const CellRendererComponent = useCallback(({
      children,
      style,
      index,
      ...props
    }: CellRendererProps<T>) => {
      return (
        <View
          style={[
            themedStyles.sectionListBorder,
            index === 0 && cs.borderTopRadius16,
            index === itemsCount - 1 && cs.borderBottomRadius16,
            style,
          ]}
          {...props}
        >
          {children}
        </View>
      );
    }, [themedStyles, itemsCount]);

    return (
      <RNFlatList<T>
        style={style}
        initialNumToRender={props.initialNumToRender || 10}
        CellRendererComponent={CellRendererComponent}
        windowSize={props.windowSize || 7}
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
