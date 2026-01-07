import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { ApplicationProvider } from "@ui-kitten/components";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as eva from "@eva-design/eva";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from "react-native-safe-area-context";

import { Trip } from "./types";
import { checkForBreaches, countDaysLast180 } from "./utils/schengen";

import BreachStatus from "./components/BreachStatus";
import TripList from "./components/TripList";
import TripCalendar from "./components/TripCalendar";
import TripModal from "./components/TripModal";
import BottomBar from "./components/BottomBar";

const STORAGE_KEY = "@schengen_trips";
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTrips = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setTrips(JSON.parse(stored));
      setIsReady(true);
    };
    loadTrips();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  const breachResult = checkForBreaches(trips);
  const daysInLast180 = countDaysLast180(trips);

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setIsModalOpen(true);
  };

  const handleSave = (trip: Trip) => {
    setTrips((prev) =>
      editingTrip
        ? prev.map((t) => (t.id === editingTrip.id ? trip : t))
        : [...prev, trip]
    );
    setEditingTrip(null);
    setIsModalOpen(false);
  };

  if (!isReady) return null;

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <ScrollView contentContainerStyle={styles.container}>
              {/* ===== Title ===== */}
              <Text style={styles.title}>Schengen Tracker</Text>

              {/* ===== Title underline ===== */}
              <View style={styles.titleLine} />

              <BreachStatus
                daysInLast180={daysInLast180}
                breachResult={breachResult}
              />

              {view === "list" ? (
                <TripList
                  trips={trips}
                  onEdit={handleEdit}
                  onDelete={(id) =>
                    setTrips((prev) => prev.filter((t) => t.id !== id))
                  }
                />
              ) : (
                // Calendar wrapper matches BreachStatus width
                <View style={styles.calendarWrapper}>
                  <TripCalendar trips={trips} onEdit={handleEdit} />
                </View>
              )}
            </ScrollView>

            <BottomBar
              view={view}
              onChangeView={setView}
              onAdd={() => {
                setEditingTrip(null);
                setIsModalOpen(true);
              }}
            />

            <TripModal
              visible={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
              editingTrip={editingTrip}
            />
          </SafeAreaView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 160,
  },

  title: {
    fontSize: 28,
    marginTop: 12,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
  },

  titleLine: {
    alignSelf: "center",
    width: SCREEN_WIDTH * 0.33,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#2563EB",
    marginTop: 26,
    marginBottom: 26,
  },

  calendarWrapper: {
    width: SCREEN_WIDTH - 46,
    alignSelf: "center",
  },
});
