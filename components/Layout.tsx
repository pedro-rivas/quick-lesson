import useTheme from "@/hooks/useTheme";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import React from "react";
import { View as RNView, ViewProps } from "react-native";

interface LayoutProps extends ViewProps {
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  flex?: number;
  gap?: number;
  flexWrap?: "wrap" | "nowrap" | "wrap-reverse";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  flexShrink?: number;
  padding?: number;
  paddingHorizontal?: number;
  ml?: number;
  mr?: number;
  mt?: number;
  mb?: number;
}

export const Header = React.memo(
  ({ children, style, ...props }: LayoutProps) => {
    const theme = useTheme();
    return (
      <RNView
        style={[
          cs.borderBottomWidth2,
          {
            flexDirection: "row",
            height: 50,
            paddingHorizontal: spacing.m,
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomColor: theme.colors.border,
            width: "100%",
          },
          style,
        ]}
        {...props}
      >
        {children}
      </RNView>
    );
  }
);

export const Footer = ({ ...props }: LayoutProps) => {
  return <View flexDirection={"row"} padding={16} {...props} />;
};

export const View = ({ children, style, ...props }: LayoutProps) => {
  return (
    <RNView
      style={[
        {
          justifyContent: props.justifyContent,
          alignItems: props.alignItems,
          flex: props.flex,
          gap: props.gap,
          padding: props.padding,
          paddingHorizontal: props.paddingHorizontal,
          flexDirection: props.flexDirection || "column",
          marginLeft: props.ml,
          marginRight: props.mr,
          marginTop: props.mt,
          marginBottom: props.mb,
          flexShrink: props.flexShrink,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNView>
  );
};

export const Row = ({ ...props }: LayoutProps) => {
  return <View flexDirection={"row"} {...props} />;
};

export const Column = ({ ...props }: LayoutProps) => {
  return <View flexDirection={"column"} {...props} />;
};

const SPACER_SIZE = {
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const Spacer = ({ size = "m" }: { size?: keyof typeof SPACER_SIZE }) => {
  return (
    <RNView style={{ height: SPACER_SIZE[size], width: SPACER_SIZE[size] }} />
  );
};
