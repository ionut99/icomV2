import React from "react";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as SiIcons from "react-icons/si";
import * as RiIcons from "react-icons/ri";

//
import { Link } from "react-router-dom";
//

export const SidebarData = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Messages",
    path: "/chat",
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: "nav-text",
  },
  {
    title: "Files",
    path: "/storage",
    icon: <SiIcons.SiFiles />,
    cName: "nav-text",
  },
  {
    title: "Users",
    path: "/controlpanel",
    icon: <RiIcons.RiUserSettingsLine />,
    cName: "nav-text",
  },
  {
    title: "Support",
    path: "/support",
    icon: <IoIcons.IoMdHelpCircle />,
    cName: "nav-text",
  },
];

export default function Sidebar(props) {
  const { user, showSidebar } = props;
  return (
    <div>
      <li className={SidebarData[0].cName}>
        <Link to={SidebarData[0].path} onClick={showSidebar}>
          {SidebarData[0].icon}
          <span>{SidebarData[0].title}</span>
        </Link>
      </li>
      <li className={SidebarData[1].cName}>
        <Link to={SidebarData[1].path} onClick={showSidebar}>
          {SidebarData[1].icon}
          <span>{SidebarData[1].title}</span>
        </Link>
      </li>
      <li className={SidebarData[2].cName}>
        <Link to={SidebarData[2].path} onClick={showSidebar}>
          {SidebarData[2].icon}
          <span>{SidebarData[2].title}</span>
        </Link>
      </li>
      <li
        className={SidebarData[3].cName}
        style={{
          display: user.isAdmin ? "block" : "none",
        }}
      >
        <Link to={SidebarData[3].path} onClick={showSidebar}>
          {SidebarData[3].icon}
          <span>{SidebarData[3].title}</span>
        </Link>
      </li>
      <li className={SidebarData[4].cName}>
        <Link to={SidebarData[4].path} onClick={showSidebar}>
          {SidebarData[4].icon}
          <span>{SidebarData[4].title}</span>
        </Link>
      </li>
    </div>
  );
}
