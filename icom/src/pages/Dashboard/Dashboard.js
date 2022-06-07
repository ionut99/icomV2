import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

import Navbar from "../../components/Navbar/Navbar";
import UserAvatar from "../../images/userAvatar.png";

import "./dashboard.css";

function Dashboard() {
  // const dispatch = useDispatch();

  // const authObj = useSelector((state) => state.auth);
  // const { user } = authObj;

  var teamlist = [];
  for (let i = 0; i < 20; i++) {
    teamlist.push("team " + i);
  }

  return (
    <div className="page">
      <Navbar />
      <div className="home-page">
        <div className="teams-content">
          <div className="videos">
            {teamlist.map((teamlist, index) => {
              return (
                <div className="video" key={index}>
                  <p>{teamlist}</p>
                  <div className="thumbnail"></div>

                  <div className="details">
                    <div className="author">
                      <img src={UserAvatar} alt="" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
