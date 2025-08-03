import { commonStyles } from "@/styles/common";
import React, { forwardRef } from "react";
import { View } from "react-native";
import PagerView, {
  PagerViewOnPageScrollEventData,
  PagerViewOnPageSelectedEventData,
  PageScrollStateChangedNativeEventData,
} from "react-native-pager-view";
import Animated, {
  runOnJS,
  SharedValue,
  useEvent,
  useHandler,
  useSharedValue,
} from "react-native-reanimated";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export interface PagerRef {
  setPage: (index: number) => void;
}

export interface RenderTabBarFnProps {
  selectedPage: number;
  onSelect?: (index: number) => void;
  dragProgress: SharedValue<number>; 
  dragState: SharedValue<"idle" | "dragging" | "settling">;
}

export type RenderTabBarFn = (props: RenderTabBarFnProps) => React.ReactElement;

interface PagerProps {
  initialPage: number;
  renderTabBar?: RenderTabBarFn;
  onPageScrollStateChanged?: (
    pageScrollState: "idle" | "dragging" | "settling"
  ) => void;
  onPageSelected?: (nextPosition: number) => void;
}

const Pager = forwardRef<PagerRef, React.PropsWithChildren<PagerProps>>(
  (
    {
      initialPage,
      children,
      renderTabBar,
      onPageScrollStateChanged: parentOnPageScrollStateChanged,
      onPageSelected: parentOnPageSelected,
    }: React.PropsWithChildren<PagerProps>,
    ref
  ) => {
    const [selectedPage, setSelectedPage] = React.useState(initialPage);
    const pagerView = React.useRef<PagerView>(null);

    React.useImperativeHandle(ref, () => ({
      setPage: (index: number) => {
        pagerView.current?.setPage(index);
      },
    }));

    const onPageSelectedJSThread = React.useCallback(
      (nextPosition: number) => {
        setSelectedPage(nextPosition);
        parentOnPageSelected?.(nextPosition);
      },
      [setSelectedPage, parentOnPageSelected]
    );

    const onTabBarSelect = React.useCallback(
      (index: number) => {
        pagerView.current?.setPage(index);
      },
      [pagerView]
    );

    const dragState = useSharedValue<"idle" | "settling" | "dragging">("idle");
    const dragProgress = useSharedValue(selectedPage);
    const didInit = useSharedValue(false);
    const handlePageScroll = usePagerHandlers(
      {
        onPageScroll(e: PagerViewOnPageScrollEventData) {
          "worklet";
          if (didInit.get() === false) {
            // On iOS, there's a spurious scroll event with 0 position
            // even if a different page was supplied as the initial page.
            // Ignore it and wait for the first confirmed selection instead.
            return;
          }
          dragProgress.set(e.offset + e.position);
        },
        onPageScrollStateChanged(e: PageScrollStateChangedNativeEventData) {
          "worklet";

          if (dragState.get() === "idle" && e.pageScrollState === "settling") {
            // This is a programmatic scroll on Android.
            // Stay "idle" to match iOS and avoid confusing downstream code.
            return;
          }
          dragState.set(e.pageScrollState);
          parentOnPageScrollStateChanged?.(e.pageScrollState);
        },
        onPageSelected(e: PagerViewOnPageSelectedEventData) {
          "worklet";
          didInit.set(true);
          runOnJS(onPageSelectedJSThread)(e.position);
        },
      },
      [parentOnPageScrollStateChanged]
    );

    return (
      <View style={commonStyles.flex1}>
        {renderTabBar?.({
          selectedPage,
          onSelect: onTabBarSelect,
          dragProgress,
          dragState,
        })}

        <AnimatedPagerView
          ref={pagerView}
          style={commonStyles.flex1}
          initialPage={initialPage}
          onPageScroll={handlePageScroll}
        >
          {children}
        </AnimatedPagerView>
      </View>
    );
  }
);

Pager.displayName = "Pager";

export default Pager;

function usePagerHandlers(
  handlers: {
    onPageScroll: (e: PagerViewOnPageScrollEventData) => void;
    onPageScrollStateChanged: (
      e: PageScrollStateChangedNativeEventData
    ) => void;
    onPageSelected: (e: PagerViewOnPageSelectedEventData) => void;
  },
  dependencies: unknown[]
) {
  const { doDependenciesDiffer } = useHandler(handlers as any, dependencies);
  const subscribeForEvents = [
    "onPageScroll",
    "onPageScrollStateChanged",
    "onPageSelected",
  ];
  return useEvent(
    (event) => {
      "worklet";
      const { onPageScroll, onPageScrollStateChanged, onPageSelected } =
        handlers;
      if (event.eventName.endsWith("onPageScroll")) {
        onPageScroll(event as any as PagerViewOnPageScrollEventData);
      } else if (event.eventName.endsWith("onPageScrollStateChanged")) {
        onPageScrollStateChanged(
          event as any as PageScrollStateChangedNativeEventData
        );
      } else if (event.eventName.endsWith("onPageSelected")) {
        onPageSelected(event as any as PagerViewOnPageSelectedEventData);
      }
    },
    subscribeForEvents,
    doDependenciesDiffer
  );
}
