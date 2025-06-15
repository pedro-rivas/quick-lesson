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
  padding?: number;
}

export const View = ({ children, ...props }: LayoutProps) => {
  return (
    <RNView
      style={{
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        flex: props.flex,
        gap: props.gap,
      }}
      {...props}
    >
      {children}
    </RNView>
  );
};

export const Header = React.memo(({ children, style, ...props }: LayoutProps) => {
  return (
    <RNView
      style={[
        {
          flexDirection: 'row',
          height: 50,
          paddingHorizontal: 16,
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#ebebeb',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNView>
  );
})

export const Row = ({ children, style, ...props }: LayoutProps) => {
  return (
    <RNView
      style={[{
        flexDirection: "row",
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        flex: props.flex,
        gap: props.gap,
        padding: props.padding,
      }, style]}
      {...props}
    >
      {children}
    </RNView>
  );
};

export const Column = ({ children, style, ...props }: LayoutProps) => {
  return (
    <RNView
      style={[
        {
          flexDirection: "column",
          justifyContent: props.justifyContent,
          alignItems: props.alignItems,
          flex: props.flex,
          gap: props.gap,
          flexWrap: props.flexWrap,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNView>
  );
};


const SPACER_SIZE = {
  s: 8,
  m: 16,
  l: 24,
};

export const Spacer = ({
  size = "m",
}: {
  size?: keyof typeof SPACER_SIZE;
}) => {
  return <RNView style={{ height: SPACER_SIZE[size], width: SPACER_SIZE[size] }} />;
};
