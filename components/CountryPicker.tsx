import React from "react";
import { Modal, Pressable, View, Text, FlatList, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  countries: string[];
  selectedCountry?: string;
  onSelect: (country: string) => void;
  onClose: () => void;
};

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

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return "";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

export default function CountryPicker({
  visible,
  countries,
  selectedCountry,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.card}>
          {selectedCountry && (
            <View style={styles.selected}>
              <Text style={styles.selectedText}>
                {getFlagEmoji(COUNTRY_CODES[selectedCountry])} {selectedCountry}
              </Text>
              <Text style={styles.chevron}>˅</Text>
            </View>
          )}
          <FlatList
            data={countries}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable style={styles.option} onPress={() => onSelect(item)}>
                <Text style={styles.optionText}>
                  {getFlagEmoji(COUNTRY_CODES[item])} {item}
                </Text>
              </Pressable>
            )}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled
          />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    maxHeight: 300,
    overflow: "hidden",
  },
  selected: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "600",
  },
  chevron: {
    fontSize: 16,
    color: "#D1D5DB",
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  optionText: {
    fontSize: 16,
  },
});
