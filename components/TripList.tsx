import React, { useRef, useState, useMemo } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Trip } from "../types";
import { formatDate } from "../utils/date";

type Props = {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
};

const DAYS_180_MS = 180 * 24 * 60 * 60 * 1000;

export default function TripList({ trips, onEdit, onDelete }: Props) {
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());
  const openSwipeableId = useRef<string | null>(null);

  const [sortAscending, setSortAscending] = useState(false);
  const [showOlderTrips, setShowOlderTrips] = useState(false);

  const now = Date.now();

  const renderRightActions = (id: string) => (
    <Pressable
      style={[styles.swipeAction, styles.deleteAction]}
      onPress={() => onDelete(id)}
    >
      <Text style={styles.swipeText}>Delete</Text>
    </Pressable>
  );

  const renderLeftActions = (trip: Trip) => (
    <Pressable
      style={[styles.swipeAction, styles.editAction]}
      onPress={() => onEdit(trip)}
    >
      <Text style={styles.swipeText}>Edit</Text>
    </Pressable>
  );

  const sortedTrips = useMemo(() => {
    return [...trips].sort((a, b) => {
      const diff =
        new Date(a.start).getTime() - new Date(b.start).getTime();
      return sortAscending ? diff : -diff;
    });
  }, [trips, sortAscending]);

  const { recentTrips, olderTrips } = useMemo(() => {
    const recent: Trip[] = [];
    const older: Trip[] = [];

    sortedTrips.forEach((trip) => {
      const endedAt = new Date(trip.end).getTime();
      if (now - endedAt > DAYS_180_MS) {
        older.push(trip);
      } else {
        recent.push(trip);
      }
    });

    return { recentTrips: recent, olderTrips: older };
  }, [sortedTrips, now]);

  const renderTrip = (trip: Trip, isOlder: boolean) => (
    <Swipeable
      key={trip.id}
      ref={(ref) => {
        if (ref) swipeableRefs.current.set(trip.id, ref);
        else swipeableRefs.current.delete(trip.id);
      }}
      renderLeftActions={() => renderLeftActions(trip)}
      renderRightActions={() => renderRightActions(trip.id)}
      onSwipeableWillOpen={() => {
        if (
          openSwipeableId.current &&
          openSwipeableId.current !== trip.id
        ) {
          const prevRef =
            swipeableRefs.current.get(openSwipeableId.current);
          prevRef?.close();
        }
        openSwipeableId.current = trip.id;
      }}
      onSwipeableWillClose={() => {
        if (openSwipeableId.current === trip.id) {
          openSwipeableId.current = null;
        }
      }}
    >
      <Pressable onPress={() => onEdit(trip)} style={styles.tripRow}>
        <Text style={[styles.bold, isOlder && styles.olderText]}>
          {trip.name}
        </Text>
        <Text style={[styles.smallText, isOlder && styles.olderText]}>
          {trip.country} · {formatDate(trip.start)} →{" "}
          {formatDate(trip.end)}
        </Text>
      </Pressable>
    </Swipeable>
  );

  return (
    <View style={{ marginBottom: 16, marginTop: 16 }}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Trips</Text>

        <Pressable
          style={styles.sortButton}
          onPress={() => setSortAscending((prev) => !prev)}
        >
          <Text style={styles.sortButtonText}>
            {sortAscending ? "↑ Oldest first" : "↓ Newest first"}
          </Text>
        </Pressable>
      </View>

      {/* Recent trips */}
      {recentTrips.map((trip) => renderTrip(trip, false))}

      {/* Toggle between lists */}
      {olderTrips.length > 0 && (
        <Pressable
          onPress={() => setShowOlderTrips((prev) => !prev)}
          style={styles.toggleOlderButton}
        >
          <Text style={styles.toggleOlderText}>
            {showOlderTrips ? "Hide older trips" : "Show older trips"}
          </Text>
        </Pressable>
      )}

      {/* Older trips */}
      {showOlderTrips &&
        olderTrips.map((trip) => renderTrip(trip, true))}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 32,
  },

  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#2563EB",
    borderRadius: 2,
  },

  sortButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  tripRow: {
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F3F4F6",
  },

  bold: {
    fontWeight: "600",
  },

  smallText: {
    color: "#4B5563",
    marginTop: 4,
  },

  olderText: {
    color: "#9CA3AF",
  },

  toggleOlderButton: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },

  toggleOlderText: {
    color: "#2563EB",
    fontWeight: "600",
  },

  swipeAction: {
    width: 80,
    justifyContent: "center",
    alignItems: "center"
  },

  swipeText: {
    color: "#FFF",
    fontWeight: "600",
  },

  deleteAction: {
    backgroundColor: "#DC2626",
  },

  editAction: {
    backgroundColor: "#2563EB",
  },
});
