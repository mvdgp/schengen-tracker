import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  view: "list" | "calendar";
  onChangeView: (view: "list" | "calendar") => void;
  onAdd: () => void;
};

export default function BottomBar({ view, onChangeView, onAdd }: Props) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable
          style={styles.tabContainer}
          onPress={() => onChangeView("list")}
        >
          <Text style={[styles.tabText, view === "list" && styles.active]}>
            List
          </Text>
        </Pressable>

        <Pressable
          style={styles.tabContainer}
          onPress={() => onChangeView("calendar")}
        >
          <Text
            style={[
              styles.tabText,
              view === "calendar" && styles.active,
            ]}
          >
            Calendar
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={onAdd}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
      >
        <Text style={styles.addText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    height: 80,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    flex: 1,
  },
  tabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  active: {
    color: "#111827",
    fontWeight: "bold",
  },

  addButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonPressed: {
    backgroundColor: "#888",
  },
  addText: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
});
