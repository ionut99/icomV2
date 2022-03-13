import React from "react";
import "../cssFiles/files.css";

import Navbar from "../components/Navbar";
import * as IoIcons from "react-icons/io";

function Files() {
  var filesList = [];
  for (let i = 0; i < 40; i++) {
    filesList.push({
      Type: "fisier",
      FileName: "Laboratorul 3",
      Modified: "Yesterday 19:38",
      ModifiedBy: "Ionut Pavel",
      Location: "/Arhitecturi de calcul paralel",
    });
  }
  return (
    <div className="main-window">
      <Navbar />
      <div className="list-files-section">
        <div className="files-details">
          <div className="type-sort">Type</div>
          <div className="name-location-sort">Name</div>
          <div className="modified-sort">Modified</div>
          <div className="modified-sort">Modified by</div>
          <div className="name-location-sort">Location</div>
          <div className="refresh">
            <IoIcons.IoIosRefresh size={25} />
          </div>
        </div>
        <div className="file-list">
          {filesList.map((filesList, index) => {
            return (
              <div
                className="file-element"
                key={index}
              >
                
                
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Files;
