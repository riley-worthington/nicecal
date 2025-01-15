import { Box, Transition } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNowOffset } from "~/hooks/useNowOffset";
import styles from "./CurrentTimeBar.module.css";

const CurrentTimeBar = () => {
  const nowOffset = useNowOffset();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Transition transition="fade" duration={500} mounted={mounted}>
      {(style) => (
        <Box
          className={styles["time-now"]}
          style={{ ...style, top: `${nowOffset}%` }}
        >
          <div className={styles["time-now-triangle"]}></div>
        </Box>
      )}
    </Transition>
  );
};

export default CurrentTimeBar;
