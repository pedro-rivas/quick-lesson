import { Dimensions } from "react-native";

// see https://material.io/blog/device-metrics

const { width, height } = Dimensions.get("window");

const [shortDimension, _] = width < height ? [width, height] : [height, width];

const guidelineBaseWidth = 350;

type Scale = (size: number) => number;

/**
 * Scale for padding, margin,
 * @param size
 * @returns
 */
const _scale: Scale = (size) => (shortDimension / guidelineBaseWidth) * size;

const ms = (size: number, factor = 0.5) => size + (_scale(size) - size) * factor;

export const scale = {
  ms,
}
