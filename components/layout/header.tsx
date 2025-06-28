import { useThemedStyles } from "@/providers/ThemeContext";
import { commonStyles as cs } from "@/styles/common";
import React from "react";
import { View as RNView } from "react-native";
import * as Layout from "../Layout";
import { LayoutProps } from "../Layout";
import * as Text from "../Text";

export const Row = React.memo(({ children, style, ...props }: LayoutProps) => {
  const ts = useThemedStyles();
  return (
    <Layout.Row
      alignItems="center"
      justifyContent="space-between"
      style={[
        cs.borderBottomWidth2,
        cs.layoutHeader,
        ts.borderBottomColor,
        style,
      ]}
      {...props}
    >
      {children}
    </Layout.Row>
  );
});

export const Section = React.memo(
  ({ style, title, ...props }: LayoutProps & { title: string }) => {
    return (
      <RNView style={[cs.p_v_m, style]} {...props}>
        <Text.H4 bold>{title}</Text.H4>
      </RNView>
    );
  }
);
