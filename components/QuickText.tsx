import React, { useEffect, useState } from "react";
import { TextProps } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

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
    <Animated.Text style={props.style} {...props}>
      {children}
    </Animated.Text>
  );
};

const ANIMATED_TEXT_DURATION = 1000;

export const AnimatedText = ({ text }: { text: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    animatedText();
  }, []);

  const animatedText = () => {
    setInterval(() => {
      setCurrentIndex((currentIndex) => {
        if (currentIndex === text.length - 1) {
          return 0;
        }
        return currentIndex + 1;
      });
    }, ANIMATED_TEXT_DURATION);
  };

  return (
    <>
      <DefaultText key={currentIndex} entering={FadeInDown} exiting={FadeOutUp}>
        {text[currentIndex]}
      </DefaultText>
    </>
  );
};
