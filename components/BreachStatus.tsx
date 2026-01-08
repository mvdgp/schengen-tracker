import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { formatDate } from "../utils/date";
import { TripBreachSegment } from "../utils/schengen";

type Props = {
  daysInLast180: number;
  breachResult: {
    hasBreach: boolean;
    breachSegments: TripBreachSegment[];
  };
};

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function getBreachTripIds(breachSegments: TripBreachSegment[]) {
  // Returns an array of all trip IDs in breach segments
  return breachSegments.map((s) => s.trip.id);
}

function getDaysColor(days: number) {
  if (days <= 90) return "#16A34A";
  if (days <= 120) return "#FACC15";
  if (days <= 150) return "#F97316";
  if (days < 180) return "#DC2626";
  return "#B91C1C";
}

export default function BreachStatus({ daysInLast180, breachResult }: Props) {
  const daysColor = getDaysColor(daysInLast180);

  return (
    <View style={styles.card}>
      {/* ================== Schengen Status ================== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schengen Status</Text>
        <View style={styles.statusRow}>
          <Text style={[styles.value, { color: daysColor }]}>{daysInLast180}</Text>
          <Text style={[styles.value, { color: "#111827" }]}> / 180 </Text>
          <Text style={styles.label}>days spent</Text>
        </View>
      </View>

      {/* ================== Breach Status ================== */}
      <View style={styles.section}>
        <View style={styles.statusRow}>
          <Text style={styles.sectionTitle}>Breach Status</Text>
          <Text
            style={[
              styles.statusIndicator,
              breachResult.hasBreach ? styles.red : styles.green,
            ]}
          >
            {breachResult.hasBreach ? "✗" : "✓"}
          </Text>
        </View>

        {breachResult.hasBreach ? (
          breachResult.breachSegments.map((s) => (
            <View key={s.trip.id} style={styles.breachItem}>
              <Text style={styles.detailText}>
                {s.trip.name}: {formatDate(s.breachStart)} → {formatDate(s.breachEnd)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.label}>Looks like you're good!</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
    minHeight: SCREEN_HEIGHT * 0.25,
    justifyContent: "space-around",
  },

  section: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  statusIndicator: {
    fontSize: 24,
    fontWeight: "800",
    marginLeft: 8,
    lineHeight: 24,
    textAlignVertical: "center",
  },

  green: { color: "#16A34A" },
  red: { color: "#DC2626" },

  label: {
    fontSize: 16,
    color: "#111827",
    textAlign: "center",
  },

  value: {
    fontWeight: "600",
    fontSize: 16,
  },

  detailText: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 2,
    textAlign: "center",
  },

  breachItem: {
    marginTop: 4,
    alignItems: "center",
  },
});
