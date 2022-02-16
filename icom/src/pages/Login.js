import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { userLoginAsync } from "./../asyncActions/authAsyncActions";
import "../cssFiles/login.css";
import avatar from "../images/loginAvatar.png";

import showPwdImg from "../show-password.svg";
import hidePwdImg from "../hide-password.svg";

function Login() {
  const authObj = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { userLoginLoading, loginError } = authObj;

  const email = useFormInput("");
  const password = useFormInput("");

  // last update
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  // last update

  // handle button click of login form
  const handleLogin = () => {
    dispatch(userLoginAsync(email.value, password.value));
  };

  return (
    <div className="bg-img">
      <div className="content_login">
        <img className="avatar_picture" src={avatar} alt="avatar jmecher" />
        <form action="#">
          <div className="field">
            <span className="fa fa-user"></span>
            <input
              type="text"
              {...email}
              autoComplete="new-password"
              required
              placeholder="Email"
            />
          </div>
          <div className="field space">
            <span className="fa fa-lock"></span>
            <input
              {...password}
              autoComplete="new-password"
              type={isRevealPwd ? "text" : "password"}
              className="pass-key"
              required
              placeholder="Password"
            />
            <img className="PwdImg"
              title={isRevealPwd ? "Hide password" : "Show password"}
              src={isRevealPwd ? hidePwdImg : showPwdImg}
              alt="visibility"
              onClick={() => setIsRevealPwd((prevState) => !prevState)}
            />
          </div>
          {loginError && (
            <div style={{ color: "red", marginTop: 30 }}>{loginError}</div>
          )}
          <div className="field">
            <input
              type="submit"
              value={userLoginLoading ? "Loading..." : "LOGIN"}
              onClick={handleLogin}
              disabled={userLoginLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

// custom hook to manage the form input
const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default Login;
