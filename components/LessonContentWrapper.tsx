import { useThemedStyles } from "@/providers/ThemeContext";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import React, { useCallback } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import Button, { BUTTON_HEIGHT } from "./buttons/Button";
import { FAB_THRESHOLD } from "./buttons/FAB";
import * as Layout from "./Layout";
import * as List from "./List";

interface LessonContentWrapperProps {
  title: string;
  buttonText: string;
  onButtonPress: () => void;
  children: React.ReactNode;
}

const LessonContentWrapper: React.FC<LessonContentWrapperProps> = ({
  title,
  buttonText,
  onButtonPress,
  children,
}) => {
  const themedStyles = useThemedStyles();

  const footerRef = React.useRef<Layout.Footer.LayoutFooterGradientRef>(null);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (event.nativeEvent.contentOffset.y > FAB_THRESHOLD / 2) {
        footerRef.current?.hide();
      } else {
        footerRef.current?.show();
      }
    },
    []
  );

  return (
    <Layout.Column style={cs.f_1}>
      <List.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={100}
        style={cs.p_h_m}
        showsVerticalScrollIndicator={false}
      >
        <Layout.Header.Section title={title} />
        <Layout.Column
          mb={spacing.m + BUTTON_HEIGHT}
          style={themedStyles.section}
        >
          {children}
        </Layout.Column>
      </List.ScrollView>
      <Layout.Footer.Gradient ref={footerRef}>
        <Button title={buttonText} onPress={onButtonPress} />
      </Layout.Footer.Gradient>
    </Layout.Column>
  );
};

LessonContentWrapper.displayName = "LessonContentWrapper";

export default React.memo(LessonContentWrapper);
