import React, { useState, useRef, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
//
import { IconContext } from "react-icons";
import * as FaIcons from "react-icons/fa";
import { Button } from "react-bootstrap";
//
import { userLogoutAsync } from "../../asyncActions/authAsyncActions";
import { updateCurrentChannel } from "../../actions/userActions";
import ChangePassword from "../ChangePassword/ChangePassword";
import ChangeAvatar from "../ChangeAvatar/ChangeAvatar";
import Avatar from "../Avatar/Avatar";

import { connectChatChannels } from "../../asyncActions/authAsyncActions";
import { connectSocket } from "../../actions/authActions";
import Sidebar from "./Sidebar";
import "./navbar.css";

function Navbar() {
  const navbarRef = useRef();
  const dispatch = useDispatch();
  //
  const authObj = useSelector((state) => state.auth);
  const { user, chatConnected } = authObj;
  //

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  function LogOut() {
    dispatch(userLogoutAsync());
    dispatch(updateCurrentChannel(null, "", []));
  }

  useEffect(() => {
    if (chatConnected == true) return;

    dispatch(connectChatChannels(user.userId, false));
    return () => {
      dispatch(connectSocket());
    };
  }, []);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        (isMenuOpen || sidebar) &&
        navbarRef.current &&
        !navbarRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
        setSidebar(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isMenuOpen, sidebar]);

  return (
    <div className="wrapper" ref={navbarRef}>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="my-my-navbar">
          <div className="left_section">
            <div className="menu-bars">
              <FaIcons.FaBars onClick={showSidebar} />
            </div>
            {/* <img className="logo_picture" src={Applogo} alt="logo jmecher" /> */}
          </div>

          <div className="right_section">
            <div
              onClick={() => setIsMenuOpen((oldState) => !oldState)}
              style={{ cursor: "pointer" }}
            >
              <div className="user_picture">
                <Avatar userId={user.userId} roomId={null} />
              </div>
            </div>
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="my-nav-menu-items">
            <li className="navbar-toggle">
              <div className="menu-bars">
                <FaIcons.FaBars onClick={showSidebar} />
              </div>
              {/* <img className="logo_picture" src={Applogo} alt="logo jmecher" /> */}
            </li>
            <div className="group-nav-text"></div>
            <Sidebar user={user} showSidebar={showSidebar} />
          </ul>
        </nav>
        <nav className={isMenuOpen ? "profile-menu active" : "profile-menu"}>
          <ul className="drop-menu-items">
            <div className="user-details">Sign in as {user.name}</div>

            <div className="dropdown-options">
              <ChangeAvatar userId={user.userId} />
            </div>
            <div className="dropdown-options">
              <ChangePassword
                Surname={user.surname}
                Name={user.name}
                Email={user.email}
              />
            </div>
            <div className="dropdown-options">
              <Button
                className="user-menu-button"
                variant="btn btn-outline-danger btn-sm"
                onClick={LogOut}
              >
                Logout
              </Button>
            </div>
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  );
}

export default Navbar;
