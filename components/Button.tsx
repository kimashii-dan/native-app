import { TouchableOpacity, Text } from "react-native";

interface ButtonType {
  text: string;
  argument?: string;
  handleAction: (argument?: string) => void;
  width: number;
}
import "../globals.css";
export default function Button({
  text,
  handleAction,
  argument,
  width,
}: ButtonType) {
  return (
    <TouchableOpacity
      onPress={() => handleAction(argument)}
      className={`bg-black rounded-md items-center justify-center w-[${width}%] p-4`}
    >
      <Text className="text-white">{text}</Text>
    </TouchableOpacity>
  );
}
