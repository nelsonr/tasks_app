export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-EN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString("en-EN", {
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
}

export function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString("en-EN", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
}

export function getTimestamp(date: string): number {
  return new Date(date).getTime();
}
