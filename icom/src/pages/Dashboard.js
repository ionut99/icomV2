import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { verifyTokenAsync, userLogoutAsync } from "./../asyncActions/authAsyncActions";

import { setAuthToken } from './../services/auth';

function Dashboard() {

  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth);

  const { user, token, expiredAt } = authObj;

  // handle click event of the logout button
  const handleLogout = () => {
    dispatch(userLogoutAsync());
  }


  // set timer to renew token
  useEffect(() => {
    setAuthToken(token);
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    }
  }, [expiredAt, token])

  return (
    <div>
      <div className='header'>
        Welcome {user.name} {user.surname}!<br /><br />
      </div>
      <div className='body'>
        <input type="button" onClick={handleLogout} value="Logout" /><br /><br />
        </div>
    </div>
  );
}

export default Dashboard;