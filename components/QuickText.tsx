import React from "react";
import { Text, TextProps } from "react-native";

export const LandingHeader = ({ children, ...props }: TextProps) => {
  return (
    <DefaultText
      style={{
        fontSize: 34,
        fontWeight: "bold",
        color: "white",
      }}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

export const BodyText = ({ children, ...props }: TextProps) => {
  return (
    <DefaultText
      style={{
        fontSize: 16,
        color: "white",
      }}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

const DefaultText = ({ children, ...props }: TextProps) => {
  return (
    <Text style={props.style} {...props}>
      {children}
    </Text>
  );
};
