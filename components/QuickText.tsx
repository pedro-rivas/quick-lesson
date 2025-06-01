import useTranslation from "@/hooks/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import { TextProps } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import * as QuickLayout from "./QuickLayout";

interface QuickTextProps extends TextProps {}

export const LandingHeader = ({ children, ...props }: QuickTextProps) => {
  return (
    <DefaultText
      style={{
        fontSize: 40,
        fontWeight: "bold",
        color: "white",
      }}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

export const Subheading = ({ children, ...props }: QuickTextProps) => {
  return (
    <DefaultText
      style={{
        fontSize: 20,
        fontWeight: "bold",
      }}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

export const BodyText = ({ children, ...props }: QuickTextProps) => {
  return (
    <DefaultText
      style={{
        fontSize: 16,
      }}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

const DefaultText = ({ children, ...props }: QuickTextProps) => {
  return (
    <Animated.Text style={props.style} {...props}>
      {children}
    </Animated.Text>
  );
};

const ANIMATED_TEXT_DURATION = 1000;

export const AnimatedText = ({
  text,
  ...props
}: { text: string[] } & TextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslation();
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    animatedText();

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  const animatedText = () => {
    interval.current = setInterval(() => {
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
      <DefaultText style={[props.style, { fontSize: 14, opacity: 0.8 }]}>
        {t("For")}
      </DefaultText>
      <QuickLayout.Spacer size="s" />
      <DefaultText
        key={currentIndex}
        entering={FadeInDown}
        exiting={FadeOutUp}
        {...props}
      >
        {text[currentIndex]}
      </DefaultText>
    </>
  );
};
