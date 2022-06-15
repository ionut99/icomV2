import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GitHub } from "@fortawesome/free-solid-svg-icons";

import GitIcon from "../../images/git.png";

import Navbar from "../../components/Navbar/Navbar";

import "./support.css";

function Support() {
  return (
    <div className="page">
      <Navbar />
      <div className="support-page">
        <div className="filter">
          <div className="content">
            <img src={GitIcon} />
            <div className="text-description">
              <p>
                For more details about this project click on the link below:
              </p>
              <a href="https://github.com/ionut99/icomV2">
                https://github.com/ionut99/icomV2
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
