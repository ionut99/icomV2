import React from "react";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faClock } from "@fortawesome/free-solid-svg-icons";

export default function Timer() {
  const initialMinute = 0;
  const initialSeconds = 0;
  //
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    setTimeout(() => {
      if (seconds === 59) {
        setSeconds(0);
        setMinutes(minutes + 1);
      } else {
        setSeconds(seconds + 1);
      }
    }, 1000);
    return () => {};
  }, [minutes, seconds]);
  //
  return (
    <div className="time">
      <div className="icon">
        <FontAwesomeIcon icon={faClock} size="lg" />
      </div>
      <div className="time-clock">
        {minutes === 0 && seconds === 0 ? null : (
          <div>
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </div>
        )}
      </div>
    </div>
  );
}
