import { Trip } from "../types";
import { toDate, toLocalISODate, MS_PER_DAY } from "./date";

/* ==================== SCHENGEN LOGIC ==================== */

export type TripBreachSegment = {
  trip: Trip;
  breachStart: Date;
  breachEnd: Date;
};

const DAYS_180_MS = 180 * MS_PER_DAY;

function filterRelevantTrips(trips: Trip[]): Trip[] {
  const now = Date.now();
  return trips.filter((trip) => {
    const tripEnd = toDate(trip.end).getTime();
    return now - tripEnd <= DAYS_180_MS;
  });
}

export function checkForBreaches(trips: Trip[]) {
  const relevantTrips = filterRelevantTrips(trips);

  const days: { date: Date; trip: Trip }[] = [];

  for (const trip of relevantTrips) {
    const start = toDate(trip.start);
    const end = toDate(trip.end);

    for (
      let d = new Date(start);
      d <= end;
      d = new Date(d.getTime() + MS_PER_DAY)
    ) {
      days.push({ date: d, trip });
    }
  }

  days.sort((a, b) => a.date.getTime() - b.date.getTime());

  let windowStart = 0;
  let maxOver = 0;
  const breachDays: typeof days = [];

  for (let i = 0; i < days.length; i++) {
    const current = days[i].date.getTime();

    while (
      windowStart < days.length &&
      days[windowStart].date.getTime() <
        current - 179 * MS_PER_DAY
    ) {
      windowStart++;
    }

    const daysInWindow = i - windowStart + 1;

    if (daysInWindow > 90) {
      const illegal = daysInWindow - 90;
      maxOver = Math.max(maxOver, illegal);
      breachDays.push(
        ...days.slice(i - illegal + 1, i + 1)
      );
    }
  }

  const segments = new Map<string, TripBreachSegment>();

  for (const { date, trip } of breachDays) {
    const seg = segments.get(trip.id);
    if (!seg) {
      segments.set(trip.id, {
        trip,
        breachStart: date,
        breachEnd: date,
      });
    } else {
      if (date < seg.breachStart) seg.breachStart = date;
      if (date > seg.breachEnd) seg.breachEnd = date;
    }
  }

  return {
    hasBreach: maxOver > 0,
    daysOverLimit: maxOver,
    breachSegments: [...segments.values()],
  };
}

export function countDaysLast180(trips: Trip[]) {
  const relevantTrips = filterRelevantTrips(trips);

  const today = new Date();
  const startWindow = new Date(
    today.getTime() - 179 * MS_PER_DAY
  );

  const daysSet = new Set<string>();

  for (const trip of relevantTrips) {
    const tripStart = toDate(trip.start);
    const tripEnd = toDate(trip.end);

    for (
      let d = new Date(tripStart);
      d <= tripEnd;
      d = new Date(d.getTime() + MS_PER_DAY)
    ) {
      if (d >= startWindow && d <= today) {
        daysSet.add(toLocalISODate(d));
      }
    }
  }

  return daysSet.size;
}