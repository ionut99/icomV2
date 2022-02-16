import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../cssFiles/Navbar.css";
import { IconContext } from "react-icons";

import logo from "../images/white-logo.png";

function Navbar() {
  
  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <nav className={"nav-menu"}>
          <ul className="nav-menu-items">
            <img className="logo_picture" src={logo} alt="logo jmecher" />
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    <div className="icon">{item.icon}</div>
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
