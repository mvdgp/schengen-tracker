import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

type Props = {
  onPress: () => void;
};

export default function FabButton({ onPress }: Props) {
  return (
    <Pressable style={styles.fab} onPress={onPress}>
      <Text style={styles.fabText}>＋</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: { color: "#FFF", fontSize: 32 },
});
