import React, { useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { getUser, removeUserSession } from './Utils/Common';
import avatar from './images/avatar.png'


function Chat(props) {
  const [error, setError] = useState(null);
  const user = getUser();

  axios.post('http://localhost:4000/users/chanel', { userid: user[0], param: "chanel" }).then(response => {
    console.log(response.data.message);
    }).catch(error => {
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });
  let messages = [];

  for(let i = 0; i<30;i++){
      let isMe = false;

      if(i % 2 === 0){
          isMe = true;
      }

       const newMsg = {
           author: `Author ${i}`,
           body: `The body of message ${i}`,
           avatar: avatar,
           me: isMe,
       }
       messages.push(newMsg);
  }

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
                  <div className="profile-name">{user.name}</div>
                  <div className="profile-image"><img className='photo' src={avatar} alt="profile"/></div>
              </div>
          </div>
      </div>
      <div className="main">
        <div className="sidebar-left">
            <div className='chanels'>
                <div className='chanel'>
                    <div className='user_image'>
                        <img src={avatar} alt=""/>
                    </div>
                    <div className='chanel_info'>
                        <h2>SHeeees</h2>
                        <p>Salut ...</p>
                    </div>

                </div>
                <div className='chanel'>
                    <div className='user_image'>
                        <img src={avatar} alt=""/>
                    </div>
                    <div className='chanel_info'>
                        <h2>SHeeees</h2>
                        <p>Salut ...</p>
                    </div>

                </div>
            </div>
        </div>
        <div className="content">
            <div className='messages'>
                {messages.map((messages, index) => {
                    return (
                        <div key={index} className={classNames('one_message', {'me': messages.me})}>
                            <div className='image_user_message'>
                                <img src={messages.avatar} alt="" />
                            </div>
                            <div className='message_body'>
                                <div className='message_author'>{messages.me ? 'You ' : messages.author} says:</div>
                                <div className='message_text'>
                                {messages.body}
                                </div>
                            </div>
                        </div>
                    )
                })}
                
            </div>
            <div className='messenger_input'>
                <div className='text_input'>
                    <textarea placeholder='Write your message...'/>
                </div>
                <div className='actions'>
                    <button>Send</button>
                </div>
            </div>
        </div>
            
        <div className="sidebar-right">
            <div className='title'><h2>Members</h2></div>
            <div className='members'>
                <div className='member'>
                    <div className='user_image'>
                        <img src={avatar} alt="" />
                    </div>
                    <div className='member_info'>
                        <h2>Pavel Ionut</h2>
                        <p>Joined: 3 days ago.</p>
                    </div>
                </div>

                <div className='member'>
                    <div className='user_image'>
                        <img src={avatar} alt="" />
                    </div>
                    <div className='member_info'>
                        <h2>Alex</h2>
                        <p>Joined: 3 days ago.</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
  );
}

export default Chat;


