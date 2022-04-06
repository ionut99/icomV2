import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SidebarData } from "../SidebarData";
import { IconContext } from "react-icons";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import { userLogoutAsync } from "../../asyncActions/authAsyncActions";
import { updateCurrentChannel } from "../../actions/userActions";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import Applogo from "../../images/white-logo.png";
import "./Navbar.css";

import { getUserAvatarAsync } from "../../asyncActions/authAsyncActions";

function Navbar() {
  const dispatch = useDispatch();
  const [sidebar, setSidebar] = useState(false);
  const [dropdownMenu, setdropdownMenu] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    uploadPicture: false,
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [discard, setDiscard] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const showdropdownMenu = () => setdropdownMenu(!dropdownMenu);

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  useEffect(() => {
    dispatch(getUserAvatarAsync(user.userId));
  }, [user.userId]);

  const { userAvatar } = authObj;

  const handleChangePicture = () => {
    setdropdownMenu(!dropdownMenu);
    setConfirmDialog({
      uploadPicture: true,
      isOpen: true,
      title: "Upload new profile photo",
      subTitle: "You can preview picture below:",
    });
  };

  // handle click event of the logout button
  function LogOut() {
    dispatch(userLogoutAsync());
    dispatch(updateCurrentChannel(null, "", []));
  }

  return (
    <>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        discard={discard}
        setDiscard={setDiscard}
      />
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <div className="left_section">
            <Link to="#" className="menu-bars">
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
            {/* <img className="logo_picture" src={Applogo} alt="logo jmecher" /> */}
          </div>

          <div className="right_section">
            <img
              className="user_picture"
              // user profile
              src={userAvatar}
              //src={"data:image/jpeg;base64," + userAvatar}
              alt="userAvatar jmecher"
              onClick={showdropdownMenu}
            />
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <FaIcons.FaBars />
              </Link>
              {/* <img className="logo_picture" src={Applogo} alt="logo jmecher" /> */}
            </li>
            <div className="group-nav-text"></div>
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
        <nav className={dropdownMenu ? "profile-menu active" : "profile-menu"}>
          <ul className="drop-menu-items">
            <div className="user-details">Sign in as {user.name}</div>

            <div className="dropdown-options">
              <input
                type="button"
                onClick={handleChangePicture}
                value="Change Profile Picture"
              />
            </div>
            <div className="dropdown-options">
              <input type="button" onClick={LogOut} value="Logout" />
            </div>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
