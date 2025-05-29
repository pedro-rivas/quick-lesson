import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

interface QuickButtonProps {
  onPress: () => void;
  disabled?: boolean;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
}

const QuickButton: React.FC<QuickButtonProps> = ({ onPress, disabled, title, style, textStyle, loading }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled ? styles.disabledButton : styles.enabledButton,
        style,
      ]}
    >
      {
        loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        )
      }
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0b57d0',
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  disabledButton: {
    opacity: 0.5,
  },
  enabledButton: {
    opacity: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuickButton; 