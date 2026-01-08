import React, { useRef, useState, useMemo } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Trip } from "../types";
import { formatDate } from "../utils/date";

type Props = {
  trips: Trip[];
  breachTripIds: string[]; // trips that directly trigger the breach
  breachTripSegmentIds?: string[]; // all trips in 180-day breach segments
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
};

const DAYS_180_MS = 180 * 24 * 60 * 60 * 1000;

export default function TripList({
  trips,
  breachTripIds,
  breachTripSegmentIds = [],
  onEdit,
  onDelete,
}: Props) {
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());
  const openSwipeableId = useRef<string | null>(null);

  const [sortAscending, setSortAscending] = useState(false);
  const [showOlderTrips, setShowOlderTrips] = useState(false);

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const now = Date.now();

  const tripsInBreachSegment = useMemo(
    () => new Set(breachTripSegmentIds),
    [breachTripSegmentIds]
  );

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
      const diff = new Date(a.start).getTime() - new Date(b.start).getTime();
      return sortAscending ? diff : -diff;
    });
  }, [trips, sortAscending]);

  const {
    ongoingTrips,
    upcomingTrips,
    recentPastTrips,
    archivedTrips,
  } = useMemo(() => {
    const ongoing: Trip[] = [];
    const upcoming: Trip[] = [];
    const recentPast: Trip[] = [];
    const archived: Trip[] = [];

    sortedTrips.forEach((trip) => {
      const startDate = new Date(trip.start).getTime();
      const endDate = new Date(trip.end).getTime();

      if (startDate <= todayStart && endDate >= todayStart) {
        ongoing.push(trip);
        return;
      }

      if (startDate > todayStart) {
        upcoming.push(trip);
        return;
      }

      if (now - endDate >= DAYS_180_MS) {
        archived.push(trip);
      } else {
        recentPast.push(trip);
      }
    });

    return {
      ongoingTrips: ongoing,
      upcomingTrips: upcoming,
      recentPastTrips: recentPast,
      archivedTrips: archived,
    };
  }, [sortedTrips, todayStart, now]);

  const renderTrip = (trip: Trip, isArchived: boolean) => {
    const hasBreach = breachTripIds.includes(trip.id); // Direct breach
    const isInBreachSegment = tripsInBreachSegment.has(trip.id); // Part of same segment

    return (
      <Swipeable
        key={trip.id}
        ref={(ref) => {
          if (ref) swipeableRefs.current.set(trip.id, ref);
          else swipeableRefs.current.delete(trip.id);
        }}
        renderLeftActions={() => renderLeftActions(trip)}
        renderRightActions={() => renderRightActions(trip.id)}
        onSwipeableWillOpen={() => {
          if (openSwipeableId.current && openSwipeableId.current !== trip.id) {
            swipeableRefs.current.get(openSwipeableId.current)?.close();
          }
          openSwipeableId.current = trip.id;
        }}
        onSwipeableWillClose={() => {
          if (openSwipeableId.current === trip.id) {
            openSwipeableId.current = null;
          }
        }}
      >
        <Pressable
          onPress={() => onEdit(trip)}
          style={[styles.tripRow, hasBreach && styles.breachRowBackground]} // Background only for direct breach
        >
          <View style={styles.tripContent}>
            <View style={styles.tripText}>
              <Text
                style={[
                  styles.bold,
                  isArchived && styles.archivedText,
                  isInBreachSegment && styles.breachText, // Red text for segment trips
                ]}
              >
                {trip.name}
              </Text>
              <Text
                style={[
                  styles.smallText,
                  isArchived && styles.archivedText,
                  isInBreachSegment && styles.breachText, // Red text for segment trips
                ]}
              >
                {trip.country} · {formatDate(trip.start)} → {formatDate(trip.end)}
              </Text>
            </View>

            {hasBreach && (
              <View style={styles.breachIcon}>
                <Text style={styles.breachIconText}>!</Text>
              </View>
            )}
          </View>
        </Pressable>
      </Swipeable>
    );
  };

  return (
    <View style={{ marginBottom: 16, marginTop: 16 }}>
      {upcomingTrips.length > 0 && (
        <>
          <Text style={styles.subSectionTitle}>UPCOMING</Text>
          {upcomingTrips.map((trip) => renderTrip(trip, false))}
        </>
      )}

      {ongoingTrips.length > 0 && (
        <>
          <Text style={styles.subSectionTitle}>ONGOING</Text>
          {ongoingTrips.map((trip) => renderTrip(trip, false))}
        </>
      )}

      {recentPastTrips.length > 0 && (
        <>
          <Text style={styles.subSectionTitle}>PAST</Text>
          {recentPastTrips.map((trip) => renderTrip(trip, false))}
        </>
      )}

      {archivedTrips.length > 0 && (
        <Pressable
          onPress={() => setShowOlderTrips((prev) => !prev)}
          style={styles.toggleOlderButton}
        >
          <Text style={styles.toggleOlderText}>
            {showOlderTrips ? "Hide older trips" : "Show older trips"}
          </Text>
        </Pressable>
      )}

      {showOlderTrips && archivedTrips.map((trip) => renderTrip(trip, true))}
    </View>
  );
}

const styles = StyleSheet.create({
  tripRow: {
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F3F4F6",
  },
  breachRowBackground: { backgroundColor: "#FEE2E2" }, // Direct breach background
  tripContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tripText: { flexShrink: 1 },
  bold: { fontWeight: "600" },
  smallText: { color: "#4B5563", marginTop: 4 },
  breachText: { color: "#DC2626" }, // Red text for segment trips
  archivedText: { color: "#9CA3AF" },
  breachIcon: { width: 22, height: 22, justifyContent: "center", alignItems: "center" },
  breachIconText: { color: "#DC2626", fontWeight: "900", fontSize: 16 },
  toggleOlderButton: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  toggleOlderText: { color: "#2563EB", fontWeight: "600" },
  swipeAction: { width: 80, justifyContent: "center", alignItems: "center" },
  swipeText: { color: "#FFF", fontWeight: "600" },
  deleteAction: { backgroundColor: "#DC2626" },
  editAction: { backgroundColor: "#2563EB" },
  subSectionTitle: { marginTop: 16, marginBottom: 8, fontSize: 16, fontWeight: "600", color: "#888" },
});
