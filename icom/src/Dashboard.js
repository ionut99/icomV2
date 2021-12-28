import React from 'react';
import { getUser, removeUserSession } from './Utils/Common';

function Dashboard(props) {
  const user = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/login');
  }

  const handleChat = () => {
    props.history.push('/chat');
  }

  return (
    <div className='dashboard_menu'>
      <h2>Welcome {user.name}!</h2><br />
      <input className='action_button' type="button" onClick={handleChat} value="Chat" /><br /><br />
      <input className='action_button' type="button" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default Dashboard;