import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import { TextProps as RNTextProps, Text } from "react-native";
import RNAnimated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
} from "react-native-reanimated";
import * as Layout from "./Layout";

interface TextProps extends RNTextProps {
  bold?: boolean;
}

export const LandingHeader = ({ children, style, ...props }: TextProps) => {
  return (
    <DefaultText
      style={[
        {
          fontSize: 40,
          fontWeight: "bold",
          color: "white",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

export const Header = ({ children, style, ...props }: TextProps) => {
  return (
    <DefaultText
      style={[
        {
          fontSize: 18,
          fontWeight: "bold",
          color: "#222",
          flexShrink: 1,
          marginHorizontal: 16,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

export const Subheading = ({ children, style, ...props }: TextProps) => {
  return (
    <DefaultText
      style={[
        {
          fontSize: 20,
          fontWeight: "bold",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

export const H2 = ({ children, style, ...props }: TextProps) => {
  return (
    <DefaultText
      style={[
        {
          fontSize: 24,
          fontWeight: "bold",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

export const H3 = ({ children, style, ...props }: TextProps) => {
  return (
    <DefaultText
      style={[
        {
          fontSize: 20,
          fontWeight: "bold",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

export const H4 = ({ children, style, ...props }: TextProps) => {
  return (
    <DefaultText
      style={[
        {
          fontSize: 18,
          fontWeight: "bold",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

export const Body = ({ children, style, ...props }: TextProps) => {
  return (
    <DefaultText
      style={[
        {
          fontSize: 16,
          fontWeight: props.bold ? "bold" : "normal",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

export const Caption = ({ children, style, ...props }: TextProps) => {
  return (
    <DefaultText
      style={[
        {
          fontSize: 14,
          fontWeight: props.bold ? "bold" : "normal",
          color: "#5A6672",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </DefaultText>
  );
};

export const Link = ({ children, style, ...props }: TextProps) => {
  const theme = useTheme();
  return (
    <Caption
      style={[
        {
          color: theme.colors.primary,
          textDecorationLine: "underline",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Caption>
  );
};

const DefaultText = ({ children, ...props }: TextProps) => {
  return (
    <Text style={props.style} {...props}>
      {children}
    </Text>
  );
};

export const Animated = (
  props: React.ComponentProps<typeof RNAnimated.Text>
) => {
  return <RNAnimated.Text {...props} />;
};

const ANIMATED_TEXT_DURATION = 1000;
const TEXT_ANIMATION = {
  default: {
    entering: FadeInDown,
    exiting: FadeOutUp,
  },
  fade: {
    entering: FadeIn,
    exiting: FadeOut,
  },
};

export const AnimatedText = ({
  text,
  texOnly = false,
  speed = ANIMATED_TEXT_DURATION,
  animation = "default",
  ...props
}: {
  text: string[];
  texOnly?: boolean;
  speed?: number;
  animation?: "default" | "fade";
} & TextProps) => {
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
    }, speed);
  };

  const { entering, exiting } = TEXT_ANIMATION[animation];

  return (
    <>
      {texOnly ? null : (
        <>
          <Animated style={[props.style, { fontSize: 14, opacity: 0.8 }]}>
            {t("For")}
          </Animated>
          <Layout.Spacer size="s" />
        </>
      )}

      <Animated
        key={currentIndex}
        // @ts-ignore
        entering={entering}
        exiting={exiting}
        {...props}
      >
        {text[currentIndex]}
      </Animated>
    </>
  );
};
