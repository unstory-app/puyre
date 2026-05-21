import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

// Initialize TimeAgo with English locale
if (typeof window !== "undefined") {
  try {
    TimeAgo.addDefaultLocale(en);
  } catch {
    // Locale already added
  }
}

export default TimeAgo;

// Simple time ago formatter that doesn't use RAF
export function formatTimeAgo(date: Date): string {
  if (typeof window === "undefined") {
    // Server-side: return a static string
    return "just now";
  }

  try {
    const timeAgo = new TimeAgo("en-US");
    return timeAgo.format(date);
  } catch {
    // Fallback
    return "recently";
  }
}
