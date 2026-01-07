import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Trip } from "../types";
import DateRangePicker from "./DateRangePicker";
import { toLocalISODate } from "../utils/date";
import { Select, SelectItem, IndexPath, Input } from "@ui-kitten/components";

// ------------------------- Props type -------------------------
type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (trip: Trip) => void;
  editingTrip?: Trip | null;
};

// ------------------------- Country Data -------------------------
const COUNTRIES = [
  "Austria","Belgium","Bulgaria","Croatia","Czechia","Denmark","Estonia","Finland","France","Germany","Greece",
  "Hungary","Iceland","Italy","Latvia","Liechtenstein","Lithuania","Luxembourg","Malta","Netherlands","Norway",
  "Poland","Portugal","Romania","Slovakia","Slovenia","Spain","Sweden","Switzerland",
];

const COUNTRY_CODES: Record<string, string> = {
  Austria: "AT",
  Belgium: "BE",
  Bulgaria: "BG",
  Croatia: "HR",
  Czechia: "CZ",
  Denmark: "DK",
  Estonia: "EE",
  Finland: "FI",
  France: "FR",
  Germany: "DE",
  Greece: "GR",
  Hungary: "HU",
  Iceland: "IS",
  Italy: "IT",
  Latvia: "LV",
  Liechtenstein: "LI",
  Lithuania: "LT",
  Luxembourg: "LU",
  Malta: "MT",
  Netherlands: "NL",
  Norway: "NO",
  Poland: "PL",
  Portugal: "PT",
  Romania: "RO",
  Slovakia: "SK",
  Slovenia: "SI",
  Spain: "ES",
  Sweden: "SE",
  Switzerland: "CH",
};

// Generate flag emoji
const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return "";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

// ------------------------- Component -------------------------
export default function TripModal({ visible, onClose, onSave, editingTrip }: Props) {
  const [name, setName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[] | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{ startDate?: Date; endDate?: Date }>({});

  useEffect(() => {
    if (editingTrip) {
      setName(editingTrip.name);
      const idx = COUNTRIES.indexOf(editingTrip.country);
      setSelectedIndex(idx >= 0 ? new IndexPath(idx) : undefined);

      setDateRange({
        startDate: new Date(editingTrip.start),
        endDate: new Date(editingTrip.end),
      });
    } else {
      setName("");
      setSelectedIndex(undefined);
      setDateRange({});
    }
  }, [editingTrip, visible]);

  const handleSave = () => {
    if (!name || selectedIndex === undefined || !dateRange.startDate || !dateRange.endDate) return;

    const country = COUNTRIES[(selectedIndex as IndexPath).row];

    const safeStart =
      dateRange.startDate <= dateRange.endDate ? dateRange.startDate : dateRange.endDate;
    const safeEnd =
      dateRange.endDate >= dateRange.startDate ? dateRange.endDate : dateRange.startDate;

    onSave({
      id:
        editingTrip?.id ||
        Math.random().toString(36).slice(2) + Date.now().toString(36),
      name,
      country,
      start: toLocalISODate(safeStart),
      end: toLocalISODate(safeEnd),
    });
  };

  const displayValue =
    selectedIndex !== undefined
      ? `${getFlagEmoji(COUNTRY_CODES[COUNTRIES[(selectedIndex as IndexPath).row]])} ${
          COUNTRIES[(selectedIndex as IndexPath).row]
        }`
      : "";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {editingTrip ? "Edit Trip" : "Add Trip"}
              </Text>

              {/* Trip Name */}
              <Text style={{ marginBottom: 4 }}>Trip Name</Text>
              <Input
                label=""
                placeholder="Name your trip..."
                value={name}
                onChangeText={setName}
                style={{ marginBottom: 8 }}
              />

              {/* Country Select */}
              <Text style={{ marginBottom: 4 }}>Country</Text>
              <Select
                placeholder="Select country..."
                selectedIndex={selectedIndex}
                value={displayValue}
                onSelect={(index) => setSelectedIndex(index as IndexPath)}
                style={styles.select}
              >
                {COUNTRIES.map((c) => (
                  <SelectItem
                    key={c}
                    title={`${getFlagEmoji(COUNTRY_CODES[c])} ${c}`}
                  />
                ))}
              </Select>

              {/* Date Range Picker */}
              <Text style={{ marginTop: 12, marginBottom: 4 }}>Trip Dates</Text>
              <DateRangePicker range={dateRange} onChange={setDateRange} />

              {/* Actions */}
              <View style={styles.modalActions}>
                <Pressable style={[styles.button, styles.secondaryButton]} onPress={onClose}>
                  <Text>Cancel</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={handleSave}>
                  <Text style={styles.buttonText}>
                    {editingTrip ? "Save" : "Add"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ------------------------- Styles -------------------------
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: { backgroundColor: "#FFF", padding: 16, borderRadius: 16 },
  modalTitle: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  select: { marginBottom: 8 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 16 },
  button: { backgroundColor: "#2563EB", padding: 10, borderRadius: 8 },
  secondaryButton: { backgroundColor: "#E5E7EB" },
  buttonText: { color: "#FFF", fontWeight: "600" },
});
