import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { verifyTokenAsync } from "../../asyncActions/authAsyncActions";

import { setAuthToken } from "../../services/auth";
import Navbar from "../../components/Navbar/Navbar";

import "./dashboard.css";

import UserAvatar from "../../images/userAvatar.png";

function Dashboard() {
  const dispatch = useDispatch();

  const authObj = useSelector((state) => state.auth);
  const { token, expiredAt } = authObj;

  useEffect(() => {
    setAuthToken(token);
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    };
  }, [expiredAt, token, dispatch]);

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
