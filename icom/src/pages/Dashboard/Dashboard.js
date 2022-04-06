import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import {
  verifyTokenAsync,
  // userLogoutAsync,
} from "../../asyncActions/authAsyncActions";
import { userLogout, verifyTokenEnd } from "../../actions/authActions";

import { setAuthToken } from "../../services/auth";
import { getUserListService } from "../../services/user";

import "./dashboard.css";

import UserAvatar from "../../images/userAvatar.png";

function Dashboard() {
  const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);

  const { user, token, expiredAt } = authObj;
  const [userList, setUserList] = useState([]);

  // handle click event of the logout button
  // function LogOut() {
  //   dispatch(userLogoutAsync());
  // }

  // get user list
  const getUserList = async () => {
    const result = await getUserListService();
    if (result.error) {
      dispatch(verifyTokenEnd());
      if (result.response && [401, 403].includes(result.response.status))
        dispatch(userLogout());
      return;
    }
    setUserList(result.data);
  };

  // set timer to renew token
  useEffect(() => {
    setAuthToken(token);
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    };
  }, [expiredAt, token, dispatch]);

  // get user list on page load
  useEffect(() => {
    getUserList();
  }, []);

  var teamlist = [];
  for (let i = 0; i < 20; i++) {
    teamlist.push("team " + i);
  }

  return (
    <div className="page">
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