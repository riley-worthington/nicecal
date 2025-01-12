import { useEffect, useState } from "react";
import { MINUTES_IN_A_DAY } from "~/constants";

const calculateOffset = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Calculate the offset for the current time
  const totalMinutes = hours * 60 + minutes + seconds / 60;
  const totalHeight = MINUTES_IN_A_DAY;
  return (totalMinutes / totalHeight) * 100;
};

/**
 * Hook that returns the current time offset in percentage and updates every 10 seconds
 * @returns {number} The current time offset in percentage
 */
export const useNowOffset = (): number => {
  const [nowOffset, setNowOffset] = useState<number>(calculateOffset());

  useEffect(() => {
    const updateTime = () => {
      const newOffset = calculateOffset();
      setNowOffset(newOffset);
    };

    updateTime(); // Set the initial position
    const interval = setInterval(updateTime, 1000 * 10); // Update every 10 seconds

    return () => clearInterval(interval); // Cleanup
  }, []);

  return nowOffset;
};
