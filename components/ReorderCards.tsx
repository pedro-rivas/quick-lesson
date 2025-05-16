import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const WORDS = ['Marc', 'horse', 'woman', 'I', 'American', 'An', 'speak'];

export default function FlipWordPicker() {
  const [origin, setOrigin] = useState(WORDS);
  const [dest,   setDest]   = useState<string[]>([]);

  const moveWord = (w: string) => {
    setOrigin((o) => o.filter((x) => x !== w));
    setDest((d)   => [...d, w]);
  };
  const putBack = (w: string) => {
    setDest((d)   => d.filter((x) => x !== w));
    setOrigin((o) => [...o, w]);
  };

  const renderList = (
    data: string[],
    onPress: (w: string) => void,
    extraStyle: object
  ) => (
    <Animated.View
      layout={Layout.springify()}
      style={[styles.list, extraStyle]}
    >
      {data.map((word) => (
        <Animated.View
          key={word}
          layout={Layout.springify()}
          transitionTag={word}
          style={styles.wordWrap}
        >
          <Pressable onPress={() => onPress(word)} style={styles.word}>
            <Text style={styles.wordText}>{word}</Text>
          </Pressable>
        </Animated.View>
      ))}
    </Animated.View>
  );

  return (
    <View style={styles.screen}>
      {/* destination */}
      {renderList(dest, putBack, styles.destination)}

      {/* origin */}
      {renderList(origin, moveWord, styles.origin)}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    backgroundColor: '#122023',
    alignItems: 'center',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 100,
    width: width - 48,
    padding: 8,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#596265',
    borderRadius: 12,
  },
  destination: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
  origin: {
    backgroundColor: '#263032',
  },
  wordWrap: {
    margin: 4,
  },
  word: {
    backgroundColor: '#596265',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  wordText: {
    color: '#fff',
    fontWeight: '700',
  },
});
