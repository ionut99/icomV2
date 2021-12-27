import React from 'react';
import { getUser, removeUserSession } from './Utils/Common';

function Chat(props) {
  const user = getUser();

  return (
    <div className="app-messenger">
      <div className="header_mess">
          <div className="left">
              <div className='actions'>

                  <button>New message</button>
              </div>
          </div>
          <div className="content"><h2>Title</h2></div>
          <div className="right">
              <div className="user-bar">
                  <div className="profile-name">Toan Nguyen Dinh</div>
                  <div className="profile-image"><img className='photo' src={require('./images/avatar.png')} alt="profile"/></div>
              </div>
          </div>
      </div>
      <div className="main">
        <div className="sidebar-left">Left_sidebar</div>
        <div className="content">
            <div className='messages'>
                <div className='one_message'>
                    <div className='image_user_message'></div>
                    <div className='image_body'></div>
                </div>
            </div>
        </div>
            
        <div className="sidebar-right">Right_sidebar</div>
        </div>
    </div>
  );
}

export default Chat;


