import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import { Button, Form } from "react-bootstrap";
import AddUser from "../../components/AddUserAccount/AddUserAccount";
import { adminSearchList } from "../../asyncActions/userAsyncActions";

import Avatar from "../../components/Search/Avatar";

import "./panel.css";
export default function ControlPanel() {
  const dispatch = useDispatch();

  const [search_text, setSearch_text] = useState("");
  const [adminUserList, setAdminUserList] = useState([]);

  const authObj = useSelector((state) => state.auth);
  const { user, expiredAt, token } = authObj;

  //
  function SearchEnter(event) {
    if (event.key === "Enter") {
      getSearchUserList();
    }
  }
  //
  const getSearchUserList = async () => {
    const userList = await adminSearchList(search_text, user.userId);

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
            </Form>

            <div className="user_element_list">
              {adminUserList.map((user, index) => {
                return (
                  <div className="user_element" key={index}>
                    <div className="user_picture">
                      <Avatar userId={user.userId} roomId={null} />
                    </div>
                    <div>{user.UserName}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <AddUser />
        </div>
      </div>
    </div>
  );
}
