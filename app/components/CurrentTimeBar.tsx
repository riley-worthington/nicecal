import { Box, Transition } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNowOffset } from "~/hooks/useNowOffset";

const CurrentTimeBar = () => {
  const nowOffset = useNowOffset();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Transition transition="fade" duration={500} mounted={mounted}>
      {(styles) => (
        <Box className="time-now" style={{ ...styles, top: `${nowOffset}%` }}>
          <div className="time-now-triangle"></div>
        </Box>
      )}
    </Transition>
  );
};

export default CurrentTimeBar;
