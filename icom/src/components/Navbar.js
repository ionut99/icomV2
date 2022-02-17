import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../cssFiles/Navbar.css";
import { IconContext } from "react-icons";

import Applogo from "../images/white-logo.png";
import UserAvatar from "../images/userAvatar.png";

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

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
              className="avatar_picture"
              src={UserAvatar}
              alt="userAvatar jmecher"
              onClick={showSidebar}
            />
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
