import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RangeCalendar, Input } from "@ui-kitten/components";
import { formatDate } from "../utils/date";
import Feather from '@expo/vector-icons/Feather';

type Props = {
  range: { startDate?: Date; endDate?: Date };
  onChange: (range: { startDate?: Date; endDate?: Date }) => void;
};

export default function DateRangePicker({ range, onChange }: Props) {
  const [showCalendar, setShowCalendar] = React.useState(false);

  const hasSelectedDates = !!range.startDate && !!range.endDate;

  const displayText = hasSelectedDates
    ? `${formatDate(range.startDate!)} → ${formatDate(range.endDate!)}`
    : "";

  const placeholderText = "Select trip dates...";

  const CalendarAccessory = () => (
    <TouchableOpacity onPress={() => setShowCalendar(prev => !prev)}>
      <Feather name="calendar" size={20} color="#8F9BB3" style={{ marginRight: 8 }} />
    </TouchableOpacity>
  );

  return (
    <View>
      <Input
        label=""
        value={displayText}
        placeholder={hasSelectedDates ? "" : placeholderText}
        placeholderTextColor="#8F9BB3"
        editable={false}
        caretHidden={true}
        showSoftInputOnFocus={false}
        onPressIn={() => setShowCalendar(prev => !prev)}
        accessoryRight={CalendarAccessory}
        style={styles.input}
      />

      {showCalendar && (
        <View style={styles.calendarWrapper}>
          <RangeCalendar
            range={range}
            onSelect={(r) => {
              onChange(r);
              if (r.startDate && r.endDate) setShowCalendar(false);
            }}
            min={new Date(1970, 0, 1)}
            style={{ width: "100%" }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
  },
  calendarWrapper: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    marginTop: 8,
  },
});
