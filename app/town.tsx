// App.tsx

import { Canvas, Circle, Group, Rect } from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// your 10×8 map
const townMap = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,2,2,0,0,0,1],
  [1,0,1,0,2,2,0,1,0,1],
  [1,0,1,0,2,2,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
] as number[][];

export default function App() {
  const ROWS = townMap.length;
  const COLS = townMap[0].length;

  const tileSize = Math.min(width / COLS, height / ROWS);
  const heroRadius = tileSize * 0.4;

  const heroCol = useSharedValue(5);
  const heroRow = useSharedValue(4);

  // how long each tile-to-tile move should take
  const MOVE_DURATION = 300;

  // pixel positions, animating with linear timing
  const heroX = useDerivedValue(
    () =>
      withTiming(heroCol.value * tileSize, {
        duration: MOVE_DURATION,
        easing: Easing.linear,
      }),
    [tileSize]
  );
  const heroY = useDerivedValue(
    () =>
      withTiming(heroRow.value * tileSize, {
        duration: MOVE_DURATION,
        easing: Easing.linear,
      }),
    [tileSize]
  );

  const move = (dx: number, dy: number) => {
    const tx = heroCol.value + dx;
    const ty = heroRow.value + dy;
    if (
      ty >= 0 &&
      ty < ROWS &&
      tx >= 0 &&
      tx < COLS &&
      townMap[ty][tx] !== 1
    ) {
      heroCol.value = tx;
      heroRow.value = ty;
    }
  };

  // smooth, continuous wandering
  useEffect(() => {
    const directions: [number, number][] = [
      [0, -1],
      [-1, 0],
      [1, 0],
      [0, 1],
    ];

    const step = () => {
      // pick only the non‐wall moves
      const valid = directions.filter(([dx, dy]) => {
        const tx = heroCol.value + dx;
        const ty = heroRow.value + dy;
        return (
          ty >= 0 &&
          ty < ROWS &&
          tx >= 0 &&
          tx < COLS &&
          townMap[ty][tx] !== 1
        );
      });
      if (valid.length) {
        const [dx, dy] = valid[Math.floor(Math.random() * valid.length)];
        move(dx, dy);
      }
      // schedule the next step *exactly* when this one finishes
      setTimeout(step, MOVE_DURATION);
    };

    step();
    // no cleanup needed, we're not holding an interval handle—
    // the timeouts will just stop once the component unmounts
  }, []);

  return (
    <View style={styles.container}>
      <Canvas style={{ width, height }}>
        <Group>
          {townMap.map((row, y) =>
            row.map((tile, x) => (
              <Rect
                key={`${x}-${y}`}
                x={x * tileSize}
                y={y * tileSize}
                width={tileSize}
                height={tileSize}
                color={
                  tile === 1
                    ? "darkgray"
                    : tile === 2
                    ? "tan"
                    : "lightgreen"
                }
              />
            ))
          )}
          <Circle cx={heroX} cy={heroY} r={heroRadius} color="crimson" />
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
