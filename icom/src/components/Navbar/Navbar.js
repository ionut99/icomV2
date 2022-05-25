import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconContext } from "react-icons";
import * as FaIcons from "react-icons/fa";
import { userLogoutAsync } from "../../asyncActions/authAsyncActions";
import { updateCurrentChannel } from "../../actions/userActions";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import Avatar from "../Search/Avatar";
import AddUser from "../AddUserAccount/AddUserAccount";
import ChangePassword from "../ChangePassword/ChangePassword";
import { Button } from "react-bootstrap";

import Sidebar from "./Sidebar";

import "./navbar.css";

function Navbar() {
  const ref = useRef();

  const dispatch = useDispatch();

  const authObj = useSelector((state) => state.auth);
  const { user, userAvatar } = authObj;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [discard, setDiscard] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    uploadPicture: false,
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const showSidebar = () => setSidebar(!sidebar);

  const handleChangePicture = () => {
    setIsMenuOpen(false);
    setConfirmDialog({
      uploadPicture: true,
      isOpen: true,
      title: "Upload new profile photo",
      subTitle: "You can preview picture below:",
    });
  };

  function LogOut() {
    dispatch(userLogoutAsync());
    dispatch(updateCurrentChannel(null, "", []));
  }

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        (isMenuOpen || sidebar) &&
        ref.current &&
        !ref.current.contains(e.target)
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
    <div className="wrapper" ref={ref}>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        discard={discard}
        setDiscard={setDiscard}
      />
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
            {/* {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path} onClick={showSidebar}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })} */}
            <Sidebar user={user} showSidebar={showSidebar} />
          </ul>
        </nav>
        <nav className={isMenuOpen ? "profile-menu active" : "profile-menu"}>
          <ul className="drop-menu-items">
            <div className="user-details">Sign in as {user.name}</div>

            <div className="dropdown-options">
              <Button
                className="user-menu-button"
                variant="btn btn-outline-primary btn-sm"
                onClick={handleChangePicture}
              >
                Change Avatar
              </Button>
            </div>
            <div className="dropdown-options">
              <ChangePassword
                Surname={user.surname}
                Name={user.name}
                Email={user.email}
              />
            </div>
            <div
              className="dropdown-options"
              style={{
                display: user.isAdmin ? "flex" : "none",
              }}
            >
              <AddUser />
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
