import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

interface QuickButtonProps {
  onPress: () => void;
  disabled?: boolean;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  secondary?: boolean;
}

const QuickButton: React.FC<QuickButtonProps> = ({
  onPress,
  disabled,
  title,
  style,
  textStyle,
  loading,
  secondary,
}) => {
  const buttonStyle = secondary ? styles.secondaryButton : styles.button;
  const buttonTextStyle = secondary ? styles.secondaryButtonText : styles.buttonText;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        buttonStyle,
        disabled ? styles.disabledButton : styles.enabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[buttonTextStyle, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0b57d0",
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  disabledButton: {
    opacity: 0.5,
  },
  enabledButton: {
    opacity: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#23b1fc",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default QuickButton;
