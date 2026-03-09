export function getFormattedDate(date: string): string {
  return new Date(date).toLocaleDateString("en-EN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getFormattedDateTime(date: string): string {
  return new Date(date).toLocaleDateString("en-EN", {
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
}

export function getTime(date: string): string {
  return new Date(date).toLocaleTimeString("en-EN", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
}

export function getTimestamp(date: string): number {
  return new Date(date).getTime();
}
