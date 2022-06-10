import React from "react";
import MousePointer from "./MousePointer";

const AppUsers = ({ presences }) => {
  return (
    <>
      {Object.keys(presences).map((presenceId) => {
        const presence = presences[presenceId];
        console.log(presence);
        const userColor = presence.color;
        let left = 0;
        let top = 0;
        if (presence.mousePointer && presence.mousePointer.left != null) {
          const container = document.querySelector("#editor-container");
          if (container) {
            const containerRect = container.getBoundingClientRect();
            top = containerRect.top + presence.mousePointer.top + "px";
            left = containerRect.left + presence.mousePointer.left + "px";
          }
        }

        return (
          <div className="online-item" key={presenceId}>
            <svg
              width="10"
              fill={userColor}
              focusable="false"
              viewBox="0 0 10 10"
              aria-hidden="true"
              title="fontSize small"
            >
              <circle cx="5" cy="5" r="5"></circle>
            </svg>
            {presence.userName}
            {presence.mousePointer && presence.mousePointer.left != null && (
              <div id="cursor" className="cursor-block" style={{ left, top }}>
                <MousePointer color={userColor} />
                <div className="cursor-name-container">
                  <div
                    className="cursor-name"
                    style={{ backgroundColor: userColor }}
                  >
                    {presence.userName}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default AppUsers;
