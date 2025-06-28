import useTranslation from "@/hooks/useTranslation";
import { useThemedStyles } from "@/providers/ThemeContext";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import React, { useEffect, useRef, useState } from "react";
import { TextProps as RNTextProps, Text, TextStyle } from "react-native";
import RNAnimated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
} from "react-native-reanimated";

interface TextProps extends RNTextProps {
  bold?: boolean;
  semibold?: boolean;
  color?: string;
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

export const Subheading = ({ style, ...props }: TextProps) => {
  return <H3 style={style} {...props} />;
};

export const H2 = ({ style, ...props }: TextProps) => {
  return <DefaultText style={[cs.h2, style]} {...props} />;
};

export const H3 = ({ style, ...props }: TextProps) => {
  return <DefaultText style={[cs.h3, style]} {...props} />;
};

export const H4 = ({ style, ...props }: TextProps) => {
  return <DefaultText style={[cs.h4, style]} {...props} />;
};

export const Body = ({ style, ...props }: TextProps) => {
  return <DefaultText style={[cs.bodyText, style]} {...props} />;
};

export const Caption = ({ style, ...props }: TextProps) => {
  return <DefaultText style={[cs.caption, style]} {...props} />;
};

export const Detail = ({ style, ...props }: TextProps) => {
  return <DefaultText style={[cs.detail, style]} {...props} />;
};

export const Link = ({ style, ...props }: TextProps) => {
  const themeStyles = useThemedStyles();
  return <Caption style={[themeStyles.link as TextStyle, style]} {...props} />;
};

const DefaultText = React.memo(({ style, ...props }: TextProps) => {
  return (
    <Text
      style={[
        {
          color: props.color,
          fontWeight: props.bold ? "bold" : props.semibold ? "600" : "normal",
        },
        style,
      ]}
      {...props}
    />
  );
});

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
          <RNAnimated.View style={{ height: spacing.s }} />
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
