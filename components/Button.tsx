import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { StyleProp, TextStyle, TouchableOpacity } from "react-native";

export const Icon = ({
  name,
  style,
  color = "black",
  size = 24,
  onPress,
  disabled,
}: {
  name: IconSymbolName;
  style?: StyleProp<TextStyle>;
  color?: string;
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <IconSymbol
        name={name} //{'arrow.backward'}
        size={size}
        color={color}
        style={style}
      />
    </TouchableOpacity>
  );
};
