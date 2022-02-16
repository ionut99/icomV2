import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { userLoginAsync } from "./../asyncActions/authAsyncActions";
import "../cssFiles/login.css";
import avatar from "../images/loginAvatar.png";

function Login() {
  const authObj = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { userLoginLoading, loginError } = authObj;

  const email = useFormInput("");
  const password = useFormInput("");

  // handle button click of login form
  const handleLogin = () => {
    dispatch(userLoginAsync(email.value, password.value));
  };

  return (
    // <div>
    //     <div className='header'>
    //         Login<br /><br />
    //     </div>
    //   <div className='body'>
    //     <div>
    //         Email<br />
    //         <input type="text" {...email} autoComplete="new-password" />
    //     </div>
    //     <div style={{ marginTop: 10 }}>
    //         Password<br />
    //         <input type="password" {...password} autoComplete="new-password" />
    //     </div>
    //     <input
    //         type="button"
    //         style={{ marginTop: 10 }}
    //         value={userLoginLoading ? 'Loading...' : 'Login'}
    //         onClick={handleLogin}
    //         disabled={userLoginLoading} />
    //     {loginError && <div style={{ color: 'red', marginTop: 10 }}>{loginError}</div>}
    //   </div>
    // </div>
    <body>
      <div className="bg-img">
        <div class="content_login">
          <img className="avatar_picture" src={avatar} alt="avatar jmecher" />
          <form action="#">
            <div class="field">
              <span className="fa fa-user"></span>
              <input type="text" required placeholder="Email" />
            </div>
            <div class="field space">
              <span class="fa fa-lock"></span>
              <input
                type="password"
                class="pass-key"
                required
                placeholder="Password"
              />
              <span class="show">SHOW</span>
            </div>
            <div class="field">
              <input type="submit" value="LOGIN" />
            </div>
          </form>
        </div>
      </div>
    </body>
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
