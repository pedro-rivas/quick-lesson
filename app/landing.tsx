// App.tsx
import { Canvas, Circle, Rect } from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// see https://www.uisources.com/explainer/duolingo-onboarding

const { width: screenWidth } = Dimensions.get('window');

type CloudProps = {
  top?: number;
  delay?: number;
  size?: number;
  duration?: number;
};

const Cloud: React.FC<CloudProps> = ({
  top = 0,
  delay = 0,
  size = 120,
  duration = 25000,
}) => {
  const x = useSharedValue(-size);

  useEffect(() => {
    x.value = withDelay(
      delay,
      withRepeat(
        withTiming(screenWidth + size, { duration }),
        -1,
        false
      )
    );
  }, [delay, size, duration]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
    overflow: 'visible' as const,
  }));

  const bodyHeight = size * 0.5;
  const topMargin = size * 0.07;
  const canvasH = bodyHeight + topMargin;
  const R = size * 0.17;          // radius of side bumps
  const centerR = size * 0.22;    // radius of center bump
  const cloudColor = '#94d5ff';

  // compute rect so its top aligns to the bottom of the small bumps:
  const rectY =
    topMargin + (bodyHeight * 0.55 + R) - bodyHeight * 0.35;
  const rectHeight = bodyHeight * 0.35;
  const rectX = size * 0.08;              // leftmost bump left-edge
  const rectW = size * 0.92 - rectX;      // spans to rightmost bump right-edge

  return (
    <Animated.View
      style={[
        { position: 'absolute', top, overflow: 'visible' },
        style,
      ]}
    >
      <Canvas style={{ width: size, height: canvasH }}>
        {/* flat bottom exactly under the smaller bumps */}
        <Rect
          x={rectX}
          y={rectY}
          width={rectW}
          height={rectHeight}
          color={cloudColor}
        />
        {/* left bump */}
        <Circle
          cx={size * 0.25}
          cy={topMargin + bodyHeight * 0.55}
          r={R}
          color={cloudColor}
        />
        {/* center bump */}
        <Circle
          cx={size * 0.5}
          cy={topMargin + bodyHeight * 0.3}
          r={centerR}
          color={cloudColor}
        />
        {/* right bump */}
        <Circle
          cx={size * 0.75}
          cy={topMargin + bodyHeight * 0.55}
          r={R}
          color={cloudColor}
        />
      </Canvas>
    </Animated.View>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <Cloud top={60} size={100} delay={0} duration={15000} />
      <Cloud top={140} size={80} delay={3000} duration={25000} />
      <Cloud top={250} size={400} delay={6000} duration={35000} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23b1fc',
    overflow: 'visible',
  },
});
