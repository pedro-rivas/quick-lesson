import { LanguageCode } from "@/constants/languages";
import useSpeech from "@/hooks/useSeech";
import useTheme from "@/hooks/useTheme";
import { cs } from "@/styles/common";
import { scale } from "@/styles/scale";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";
import * as Text from "./Text";

const withTimeout = (cb: () => void) => setTimeout(cb, 10);

enum BUTTON_STATE {
  SELECTED,
  MATCHED,
  ERROR,
  HINT,
  DISABLED,
  NONE,
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const ANGLE = 4;
const TIME = 100;
const EASING = Easing.elastic(1.5);
const TIMES = 7;
const MATCH_DURATION = 700;
const SHIMMER_DURATION = 400;
const WORD_BUTTON_HEIGHT = scale.ms(50);
const COLOR_AN_DURATION = { duration: 100}

interface WordButtonProps {
  word: string;
  selected: boolean;
  matched: boolean;
  error: boolean;
  hint: boolean;
  disabled: boolean;
  onPress: (uri?: string) => void;
  collapsed?: boolean;
  langCode?: LanguageCode;
}

const WordButton = ({
  word,
  selected,
  matched,
  error,
  hint,
  disabled: isDisabled,
  collapsed,
  langCode,
  onPress,
}: WordButtonProps) => {
  const speech = useSpeech(word, langCode);
  const theme = useTheme();
  const lessonColors = theme.lesson;

  // shared value for rotation
  const rotation = useSharedValue(0);
  const shimmerTranslateX = useSharedValue(0);
  const btnWidth = useSharedValue(0);
  const disabled = useSharedValue(0);
  const sparkOpacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const btnHeight = useSharedValue(WORD_BUTTON_HEIGHT);
  const state = useSharedValue(BUTTON_STATE.NONE);

  const hintTimeout = React.useRef<number | null>(null);

  useEffect(() => {
    if (hint) {
      hintTimeout.current = setTimeout(() => {
        withTimeout(hintAnimation);
      }, 1000);
    }
    if (matched) {
      withTimeout(matchAnimation);
    }
    if (error) {
      withTimeout(errorAnimation);
    }

    if (isDisabled) {
      withTimeout(() => {
        disabled.value = 1;
      });
    }

    return cleanHintTimeout;
  }, [hint, matched, error, isDisabled]);

  useEffect(() => {
    if (hintTimeout.current) {
      clearTimeout(hintTimeout.current);
    }

    if (selected) {
      selectAnimation(true);
    } else {
      selectAnimation(false);
    }

    return cleanHintTimeout;
  }, [selected]);

  const cleanHintTimeout = useCallback(() => {
    if (hintTimeout.current) {
      clearTimeout(hintTimeout.current);
      hintTimeout.current = null;
    }
  }, []);

  const selectAnimation = useCallback((select: boolean) => {
    "worklet";
    state.value = select ? BUTTON_STATE.SELECTED : BUTTON_STATE.NONE;
  }, []);

  const matchAnimation = useCallback(() => {
    "worklet";
    state.value = BUTTON_STATE.MATCHED;

    // sparkOpacity.value = withSequence(
    //   withTiming(1, { duration: SHIMMER_DURATION/2, easing: Easing.linear }),
    //   withTiming(0, { duration: SHIMMER_DURATION/2, easing: Easing.linear }),
    // );

    // translateY.value = withSequence(
    //   withTiming(-10, { duration: 50, easing: Easing.linear }),
    //   withTiming(-12, { duration: 150, easing: Easing.linear }),
    //   withTiming(0, { duration: 150, easing: Easing.elastic(1.5) }),
    //   withTiming(-4, { duration: 50, easing: Easing.elastic(1.5) }),
    //   withTiming(0, { duration: 20, easing: Easing.elastic(1.5) }),
    // );

    // shimmerTranslateX.value = withDelay(100, withTiming(btnWidth.value, { duration: MATCH_DURATION}))

    disabled.value = withDelay(
      MATCH_DURATION,
      withTiming(1, { duration: 100, easing: Easing.linear })
    );

    state.value = withDelay(
      MATCH_DURATION,
      withTiming(BUTTON_STATE.NONE, { duration: 100, easing: Easing.linear })
    );
  }, []);

  const hintAnimation = useCallback(() => {
    "worklet";
    state.value = BUTTON_STATE.HINT;
    state.value = withDelay(
      1000,
      withTiming(BUTTON_STATE.NONE, { duration: 100 })
    );
    wobbleAnimation();
  }, []);

  const errorAnimation = useCallback(() => {
    "worklet";
    state.value = BUTTON_STATE.ERROR;
    state.value = withDelay(
      MATCH_DURATION,
      withTiming(BUTTON_STATE.NONE, { duration: 100 })
    );
  }, []);

  const wobbleAnimation = useCallback(() => {
    "worklet";
    rotation.value = withSequence(
      withTiming(-ANGLE, { duration: 50, easing: EASING }),
      withRepeat(
        withTiming(ANGLE, {
          duration: TIME,
          easing: EASING,
        }),
        TIMES,
        true
      ),
      withTiming(0, { duration: 50, easing: EASING })
    );
  }, []);

  const handlePress = useCallback(() => {
    "worklet";
    if (disabled.value) return;
    runOnJS(onPress)(speech.uri ? speech.uri : undefined);
    runOnJS(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    })();
  }, [onPress, speech.uri]);

  const getColor = useCallback(
    (state: BUTTON_STATE) => {
      "worklet";
      switch (state) {
        case BUTTON_STATE.ERROR:
          return lessonColors.error;
        case BUTTON_STATE.SELECTED:
          return lessonColors.selected;
        case BUTTON_STATE.MATCHED:
          return lessonColors.match;
        case BUTTON_STATE.HINT:
          return lessonColors.hint;
        default:
          return lessonColors.default;
      }
    },
    [lessonColors, theme]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: `${rotation.value}deg` },
      {
        translateY: translateY.value,
      },
    ],
    opacity: withTiming(disabled.value ? 0.4 : 1, COLOR_AN_DURATION),
    height: btnHeight.value,
    borderColor:  withTiming(getColor(state.value).border, COLOR_AN_DURATION),
    backgroundColor: withTiming(getColor(state.value).background, COLOR_AN_DURATION),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: withTiming(getColor(state.value).text, COLOR_AN_DURATION),
    zIndex: 2,
    fontSize: 16,
    fontWeight: "500",
  }));


  // const animatedShimmer = useAnimatedStyle(() => ({
  //   height:'100%',
  //   width: '100%',
  //   position: "absolute",
  //   zIndex: -1,
  //   backgroundColor:'white',
  //   opacity: 1,
  //   transform: [
  //     {
  //       translateX: shimmerTranslateX.value,
  //     },
  //     {
  //       skewX: `${-10}deg`,
  //     }
  //   ],
  // }));

  // const animatedSparkle = useAnimatedStyle(() => ({
  //   opacity: sparkOpacity.value,
  // }))

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      disabled={matched /*|| disabled*/}
      onLayout={(e) => {
        if (shimmerTranslateX.value === 0) {
          btnWidth.value = e.nativeEvent.layout.width;
          btnHeight.value = e.nativeEvent.layout.height;
          shimmerTranslateX.value = -e.nativeEvent.layout.width;
        }
      }}
      style={[cs.wordButton, !collapsed && cs.wordButtonGrow, animatedStyle]}
    >
      <Text.Animated style={animatedTextStyle}>{word}</Text.Animated>
      {/* <Animated.View style={animatedShimmer}/> */}
      {/* <Animated.View
        style={[{
          width: 12,
          height: 12,
          position: "absolute",
          top: '20%',
          left: '10%',
          backgroundColor:'white',
          borderRadius: 2,
          transform: [
            {
              skewX: `${20}deg`,

            },
            {
              skewY: `${-20}deg`,
            }
          ]
        }, animatedSparkle]}
      />

      <Animated.View
        style={[
          {
          width: 4,
          height: 4,
          position: "absolute",
          bottom: '20%',
          right: '20%',
          backgroundColor:'white',
          borderRadius: 1,
          transform: [
            {
              skewX: `${20}deg`,

            },
            {
              skewY: `${-20}deg`,
            }
          ]
        }, animatedSparkle
        ]}
      /> */}
    </AnimatedTouchableOpacity>
  );
};

WordButton.displayName = "WordButton";

export default React.memo(WordButton, (prevProps, nextProps) => {
  return (
    prevProps.selected === nextProps.selected &&
    prevProps.matched === nextProps.matched &&
    prevProps.error === nextProps.error &&
    prevProps.hint === nextProps.hint &&
    prevProps.disabled === nextProps.disabled
  );
});
