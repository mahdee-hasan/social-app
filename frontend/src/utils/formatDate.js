import {
  format,
  isToday,
  isYesterday,
  isThisYear,
  differenceInDays,
  differenceInMinutes,
  differenceInHours,
} from "date-fns";

function formatDate(date) {
  const now = new Date();

  const diffMinutes = differenceInMinutes(now, date);
  const diffHours = differenceInHours(now, date);
  const diffDays = differenceInDays(now, date);

  // Case 1: Less than 1 minute
  if (diffMinutes < 1) {
    return "Just now";
  }
  if (diffHours < 1) {
    return `${diffMinutes}m`;
  }
  // Case 2: Less than 6 hours (only show hour count)
  if (diffHours < 6) {
    return `${diffHours}h`;
  }

  // Case 3: Today
  if (isToday(date)) {
    return `Today ${format(date, "hh:mm a")}`;
  }

  // Case 4: Yesterday
  if (isYesterday(date)) {
    return `Yesterday ${format(date, "hh:mm a")}`;
  }

  // Case 5: Within last 7 days
  if (diffDays < 7) {
    return `${format(date, "EEE hh:mm a")}`; // e.g., Mon 01:30 PM
  }

  // Case 6: Same year
  if (isThisYear(date)) {
    return format(date, "dd MMM hh:mm a");
  }

  // Case 7: Different year
  return format(date, "dd MMM yyyy hh:mm a");
}

export default formatDate;
