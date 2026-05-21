import { useEffect, useState } from "react";
import { formatTimeAgo } from "../lib/time-ago";

interface TimeAgoProps {
  date: Date;
}

export default function TimeAgo({ date }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState(() => formatTimeAgo(date));

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  return <span>{timeAgo}</span>;
}