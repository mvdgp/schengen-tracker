export const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const toDate = (date: string) => new Date(`${date}T00:00:00`);

export const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(typeof date === "string" ? toDate(date) : date);

export const toLocalISODate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
