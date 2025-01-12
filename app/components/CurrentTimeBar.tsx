import { useNowOffset } from "~/hooks/useNowOffset";

const CurrentTimeBar = () => {
  const nowOffset = useNowOffset();

  return (
    <div className="time-now" style={{ top: `${nowOffset}%` }}>
      <div className="time-now-triangle"></div>
    </div>
  );
};

export default CurrentTimeBar;
