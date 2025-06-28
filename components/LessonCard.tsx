import { Lesson } from "@/store/lessonStore";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import { formatDateShort } from "@/utils/date";
import React from "react";
import CountryFlag from "./CountryFlag";
import * as Layout from "./Layout";
import * as Text from "./Text";
import IconButton from "./buttons/IconButton";
import Pressable from "./buttons/Pressable";

interface LessonCardProps {
  lesson: Lesson;
  onPress: (lesson: Lesson) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onPress }) => {
  const handlePress = () => {
    onPress(lesson);
  };

  return (
    <Pressable onPress={handlePress}>
      <Layout.Column style={cs.flex1}>
        <Layout.Row
          alignItems={"center"}
          justifyContent={"space-between"}
          padding={spacing.s}
        >
          <Layout.Row flexShrink={1}>
            <CountryFlag countryCode={lesson.langCode} size={"small"} />
            <Layout.Column ml={spacing.s} style={cs.w_85_p}>
              <Text.Body semibold numberOfLines={2}>
                {lesson.title}
              </Text.Body>
              <Text.Detail style={cs.m_t_xs}>
                {`${formatDateShort(lesson.createdAt)}`}
              </Text.Detail>
            </Layout.Column>
          </Layout.Row>
          <IconButton onPress={handlePress} name={"keyboard-arrow-right"} />
        </Layout.Row>
      </Layout.Column>
    </Pressable>
  );
};

LessonCard.displayName = "LessonCard";

export default React.memo(LessonCard);
