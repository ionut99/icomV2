import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import { Button, Form, Dropdown } from "react-bootstrap";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddUser from "../../components/AddUserAccount/AddUserAccount";
import { adminSearchList } from "../../asyncActions/userAsyncActions";

import Avatar from "../../components/Search/Avatar";

import "./panel.css";

export default function ControlPanel() {
  // const dispatch = useDispatch();

  const [search_text, setSearch_text] = useState("");
  const [adminUserList, setAdminUserList] = useState([]);
  const [teamName, setTeamName] = useState("  Team Name  ");
  const [openDetails, setOpenDetails] = useState(false);
  //
  const [userDetails, setuserDetails] = useState({});

  const authObj = useSelector((state) => state.auth);
  const { user, expiredAt, token } = authObj;
  //
  const handleOpenDetails = (user) => {
    console.log(user);
    setuserDetails(user);
    setOpenDetails(true);
  };
  //
  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  //
  function SearchEnter(event) {
    if (event.key === "Enter") {
      getSearchUserList();
    }
  }
  //
  const getSearchUserList = async () => {
    const userList = await adminSearchList(search_text, user.userId);
    console.log(userList);
    setAdminUserList(userList);
  };

  useEffect(() => {
    getSearchUserList();
  }, [search_text]);

  //
  const SearchPerson = (event) => {
    setSearch_text(event.target.value);
  };
  //
  return (
    <div className="panel-page">
      <Navbar />
      <div className="panel-content">
        <div className="content">
          <div className="user-section">
            <Form className="search-bar">
              <Form.Control
                type="search"
                placeholder="Search"
                className="user-search"
                aria-label="Search"
                value={search_text}
                onChange={SearchPerson}
                onKeyDown={SearchEnter}
              />
              <AddUser />
              <Dropdown className="drop-menu">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {teamName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                    Another action
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Something else
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form>
            <div className="div-table">
              <div className="div-table-row-description">
                <div className="div-table-col">
                  <div className="empty-picture"></div>
                </div>
                <div className="div-table-col">
                  <p>Full Name</p>
                </div>
                <div className="div-table-col">
                  <p>Email</p>
                </div>
                <div className="div-table-col">
                  <p>Status</p>
                </div>
                <div className="div-table-col">
                  <p>Action</p>
                </div>
              </div>
              <div className="user-list">
                {adminUserList.map((user, index) => {
                  return (
                    <div
                      className="div-table-row"
                      key={index}
                      onClick={() => handleOpenDetails(user)}
                    >
                      <div className="div-table-col">
                        <div className="user_picture">
                          <Avatar userId={user.userId} roomId={null} />
                        </div>
                      </div>
                      <div className="div-table-col">
                        <p>{user.UserName}</p>
                      </div>
                      <div className="div-table-col">
                        <p>{user.email}</p>
                      </div>
                      <div className="div-table-col">
                        <p>{user.IsOnline}</p>
                      </div>
                      <div className="div-table-col">
                        <p>Delete / Edit</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="right-side">
            <div
              className="view-user-details"
              style={{ display: openDetails ? "block" : "none" }}
            >
              <div className="exit">
                <Button
                  className="close-button"
                  onClick={() => handleCloseDetails()}
                  variant="outline-danger"
                >
                  <FontAwesomeIcon icon={faClose} className="w-100 h-100" />
                </Button>
              </div>

              <div className="user-profile">
                <Avatar userId={userDetails.userId} roomId={null} />
              </div>
              <div className="user-data">
                <div>
                  Name: <p>{userDetails.UserName}</p>
                </div>
                <div>
                  Email: <p>{userDetails.email}</p>
                </div>
                <div>
                  Last seen: <p>{userDetails.LastOnline}</p>
                </div>
                <div>
                  Status: <p>{userDetails.IsOnline}</p>
                </div>
                <div>
                  Role: <p>{userDetails.IsAdmin}</p>
                </div>
                <div>
                  Teams involved: <p>team 1</p> <p>team 2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
