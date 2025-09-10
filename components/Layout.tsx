import { scale } from "@/styles/scale";
import React from "react";
import { View as RNView, ViewProps } from "react-native";

export * as Footer from "./layout/footer";
export * as Header from "./layout/header";

export interface LayoutProps extends ViewProps {
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
  pv?: number;
  ph?: number;
  pl?: number;
  pr?: number;
  pb?: number;
  ml?: number;
  mr?: number;
  mt?: number;
  mb?: number;
  mh?: number;
}

export const View = React.memo(({ children, style, ...props }: LayoutProps) => {
  return (
    <RNView
      style={[
        {
          justifyContent: props.justifyContent,
          alignItems: props.alignItems,
          flex: props.flex,
          gap: props.gap,
          flexDirection: props.flexDirection || "column",
          marginLeft: props.ml,
          marginRight: props.mr,
          marginTop: props.mt,
          marginBottom: props.mb,
          marginHorizontal: props.mh,
          flexShrink: props.flexShrink,
          padding: props.padding,
          paddingHorizontal: props.paddingHorizontal || props.ph,
          paddingVertical: props.pv,
          paddingLeft: props.pl,
          paddingRight: props.pr,
          paddingBottom: props.pb,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNView>
  );
})

export const Row = ({ ...props }: LayoutProps) => {
  return <View flexDirection={"row"} {...props} />;
};

export const Column = ({ ...props }: LayoutProps) => {
  return <View flexDirection={"column"} {...props} />;
};

const SPACER_SIZE = {
  s: scale.ms(8),
  m: scale.ms(16),
  l: scale.ms(24),
  xl: scale.ms(32),
  xxl: scale.ms(40),
};

export const Spacer = ({ size = "m" }: { size?: keyof typeof SPACER_SIZE }) => {
  return (
    <RNView style={{ height: SPACER_SIZE[size], width: SPACER_SIZE[size] }} />
  );
};
