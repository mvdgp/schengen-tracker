import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  active: "list" | "calendar";
  onChange: (view: "list" | "calendar") => void;
};

export default function ViewToggleTabs({ active, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.tab, active === "list" && styles.activeTab]}
        onPress={() => onChange("list")}
      >
        <Text style={[styles.text, active === "list" && styles.activeText]}>
          List
        </Text>
      </Pressable>

      <Pressable
        style={[styles.tab, active === "calendar" && styles.activeTab]}
        onPress={() => onChange("calendar")}
      >
        <Text style={[styles.text, active === "calendar" && styles.activeText]}>
          Calendar
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#2563EB",
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  activeText: {
    color: "#FFF",
  },
});
