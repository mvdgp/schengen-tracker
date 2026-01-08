import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Calendar } from "@ui-kitten/components";
import { Trip } from "../types";

type Props = {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
};

type CalendarDayInfo = {
  date: Date;
  bounding?: boolean;
};

// Helper: convert Date → local YYYY-MM-DD (NO UTC)
const toLocalDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Helper: normalize to local midnight
const normalizeDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export default function TripCalendar({ trips, onEdit }: Props) {
  // Group trips by local YYYY-MM-DD
  const tripsByDate = useMemo(() => {
    const map: Record<string, Trip[]> = {};

    trips.forEach((trip) => {
      const start = normalizeDate(new Date(trip.start));
      const end = normalizeDate(new Date(trip.end));

      for (
        let d = new Date(start);
        d <= end;
        d.setDate(d.getDate() + 1)
      ) {
        const key = toLocalDateKey(d);
        if (!map[key]) map[key] = [];
        map[key].push(trip);
      }
    });

    return map;
  }, [trips]);

  const renderDay = (info: CalendarDayInfo, style: any) => {
    const date = normalizeDate(info.date);
    const key = toLocalDateKey(date);
    const dayTrips = tripsByDate[key];

    return (
      <View style={[styles.dayCell, style?.container]}>
        <Text style={styles.dayNumber}>{date.getDate()}</Text>

        {dayTrips?.map((trip) => (
          <Pressable
            key={trip.id}
            style={styles.tripBadge}
            onPress={() => onEdit(trip)}
          >
            <Text style={styles.tripText} numberOfLines={1}>
              {trip.name}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  return <Calendar renderDay={renderDay} />;
}

const styles = StyleSheet.create({
  dayCell: {
    minHeight: 64,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  dayNumber: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },

  tripBadge: {
    backgroundColor: "#2563EB",
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 2,
    width: "90%",
  },

  tripText: {
    fontSize: 10,
    color: "#FFF",
    textAlign: "center",
  },
});
