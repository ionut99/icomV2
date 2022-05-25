import React from "react";

import Navbar from "../../components/Navbar/Navbar";

import "./panel.css";
export default function ControlPanel() {
  return (
    <div className="panel-page">
      <Navbar />
      <div className="panel-content"></div>
    </div>
  );
}
