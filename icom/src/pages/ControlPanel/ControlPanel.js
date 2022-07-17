import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import { Button, Form, Dropdown } from "react-bootstrap";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddUser from "../../components/AddUserAccount/AddUserAccount";
import {
  getUsersDetailsList,
  getGroupsDetails,
  getRoomUsersDetailsList,
} from "../../asyncActions/adminAsyncActions";
//
// import { verifyTokenAsync } from "../../asyncActions/authAsyncActions";
// import { setAuthToken } from "../../services/auth";
//
import Avatar from "../../components/Avatar/Avatar";
//
// import moment from "moment";
//
import "./panel.css";
//
export default function ControlPanel() {
  //
  // const dispatch = useDispatch();
  //
  const [search_text, setSearch_text] = useState("");
  const [adminUserList, setAdminUserList] = useState([]);
  //
  const [selectedTeam, setSelectedTeam] = useState({
    name: "Group Name",
    teamId: undefined,
  });

  const [teamsList, setTeamsList] = useState([]);
  //
  const [openDetails, setOpenDetails] = useState(false);
  //
  const [userDetails, setuserDetails] = useState({});

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;
  //

  const getSearchUserList = async (search_text, userId) => {
    const userList = await getUsersDetailsList(search_text, userId);
    if (userList !== undefined) setAdminUserList(userList);
  };

  const getTeamUserList = async (userId, roomId) => {
    const userList = await getRoomUsersDetailsList(userId, roomId);
    if (userList !== undefined) setAdminUserList(userList);
  };
  //
  function SearchEnter(event) {
    if (event.key === "Enter") {
      getSearchUserList(search_text, user.userId);
    }
  }
  //
  //
  const SearchPerson = (event) => {
    setSearch_text(event.target.value);
    setSelectedTeam({
      name: "Group Name",
      teamId: undefined,
    });
  };
  //

  const handleOpenDetails = (user) => {
    setuserDetails(user);
    setOpenDetails(true);
  };
  //
  const handleCloseDetails = () => {
    setOpenDetails(false);
  };
  //
  const handleFilterTeam = (userId, roomName, roomId) => {
    // setOpenDetails(false);
    setSearch_text("");
    getTeamUserList(userId, roomId);
    setSelectedTeam({
      name: roomName,
      teamId: roomId,
    });
  };

  useEffect(() => {
    getSearchUserList(search_text, user.userId);
  }, [search_text]);

  // get details about groups
  useEffect(() => {
    const getGroups = async (userId) => {
      const groupList = await getGroupsDetails(userId);
      if (groupList !== undefined) setTeamsList(groupList);
    };
    getGroups(user.userId);
  }, []);
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
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  className="select-group"
                >
                  {selectedTeam.name}
                </Dropdown.Toggle>

                <Dropdown.Menu className="group-option">
                  {teamsList.map((team, index) => {
                    return (
                      <Dropdown.Item
                        href="#/action-1"
                        key={index}
                        className="option"
                        onClick={() =>
                          handleFilterTeam(user.userId, team.name, team.roomId)
                        }
                      >
                        <div className="div-option">
                          <div className="team-name">
                            <p>{team.name}</p>
                          </div>
                          <div className="team-part">Users: {team.part}</div>
                        </div>
                      </Dropdown.Item>
                    );
                  })}
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
                        <p>{user.userName}</p>
                      </div>
                      <div className="div-table-col">
                        <p>{user.email}</p>
                      </div>
                      <div className="div-table-col">
                        <p>{user.isOnline}</p>
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
                  Name: <p>{userDetails.userName}</p>
                </div>
                <div>
                  Email: <p>{userDetails.email}</p>
                </div>
                <div>
                  Last seen: <p>{userDetails.lastOnline}</p>
                </div>
                <div>
                  Status: <p>{userDetails.isOnline}</p>
                </div>
                <div>
                  Role: <p>{userDetails.isAdmin}</p>
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
