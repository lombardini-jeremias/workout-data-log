import { Text, type TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "card"
    | "cardText";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "card" ? styles.card : undefined,
        type === "cardText" ? styles.cardText : undefined,
        type === "errorText" ? styles.errorText : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
  card: {
    backgroundColor: "#151718",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#9BA1A6",
    borderWidth: 1,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#cf6679",
    textAlign: "center",
  },
});
