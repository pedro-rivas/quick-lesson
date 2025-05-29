import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

// Get the type for AntDesign icon names
type AntDesignIconName = keyof typeof AntDesign.glyphMap;

interface QuickButtonIconProps {
  onPress: () => void;
  iconName: AntDesignIconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const QuickButtonIcon: React.FC<QuickButtonIconProps> = ({
  onPress,
  iconName,
  size = 24, // Default size
  color = '#666', // Default color
  style,
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <AntDesign name={iconName} size={size} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 16,
    // Example default background, can be overridden by style prop
    // backgroundColor: '#e0e0e0', 
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QuickButtonIcon; 