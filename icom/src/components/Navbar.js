import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../cssFiles/Navbar.css";
import { IconContext } from "react-icons";

import Applogo from "../images/white-logo.png";
import UserAvatar from "../images/userAvatar.png";
import { useDispatch, useSelector } from "react-redux";
import { userLogoutAsync } from "./../asyncActions/authAsyncActions";

function Navbar() {
  // LOG OUT
  const dispatch = useDispatch();

  // handle click event of the logout button
  function LogOut() {
    dispatch(userLogoutAsync());
  }

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const [dropdownMenu, setdropdownMenu] = useState(false);

  const showdropdownMenu = () => setdropdownMenu(!dropdownMenu);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <div className="left_section">
            <Link to="#" className="menu-bars">
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
            <img className="logo_picture" src={Applogo} alt="logo jmecher" />
          </div>

          <div className="right_section">
            <img
              className="user_picture"
              src={UserAvatar}
              alt="userAvatar jmecher"
              onClick={showdropdownMenu}
            />
            <nav
              className={dropdownMenu ? "profile-menu active" : "profile-menu"}
            >
              <ul className="drop-menu-items">
                <div className="user-details">Sign in as {user.name}</div>

                <div className="dropdown-options">Profile</div>

                <div className="dropdown-options">
                  <div>
                  <input type="button" onClick={LogOut} value="Logout" />
                  </div>
                  
                </div>
              </ul>
            </nav>
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <FaIcons.FaBars />
              </Link>
              <img className="logo_picture" src={Applogo} alt="logo jmecher" />
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
