import { useThemedStyles } from "@/providers/ThemeContext";
import { commonStyles as cs } from "@/styles/common";
import React from "react";
import { View as RNView } from "react-native";
import { LayoutProps } from "../Layout";
import * as Text from "../Text";
import { BUTTON_HEIGHT } from "../buttons/Button";
import IconButton, { IconButtonProps } from "../buttons/IconButton";

export const Row = React.memo(({ children, style, ...props }: LayoutProps) => {
  const ts = useThemedStyles();
  return (
    <RNView
      style={[
        cs.borderBottomWidth2,
        cs.layoutHeader,
        ts.borderBottomColor,
        style,
      ]}
      {...props}
    >
      {children}
    </RNView>
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

export const Icon = (props: IconButtonProps) => {
  return <IconButton {...props} />;
};

export const Title = ({ title }: { title: string }) => {
  return (
    <Text.H4 style={[cs.f_s_1, cs.m_h_m]} numberOfLines={1}>
      {title}
    </Text.H4>
  );
};

export const Spacer = ({ size = BUTTON_HEIGHT }: { size?: number }) => {
    return <RNView style={{ width: size, height: size }} />;
  }
