import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//
import Avatar from "../../components/Avatar/Avatar";
//
import { getRoomUsersDetailsList } from "../../asyncActions/adminAsyncActions";
import { getChannelDetailsService } from "../../services/user";
//
export default function Team(props) {
  const { team } = props;

  //

  const [userList, setUsers] = useState([]);
  const [roomName, setRoomName] = useState(undefined);
  //
  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  useEffect(() => {
    const getUsers = async (userId, roomId) => {
      const usersList = await getRoomUsersDetailsList(userId, roomId);
      if (usersList !== undefined) setUsers(usersList);

      const roomDetails = await getChannelDetailsService(roomId, userId);

      if (roomDetails !== undefined) setRoomName(roomDetails.data["roomName"]);
      //
    };
    getUsers(user.userId, team.roomId);
  }, []);

  //
  return (
    <div className="team-unit">
      <div className="team-title">
        <p>{roomName}</p>
      </div>

      <div className="team-picture">
        <Avatar userId={user.userId} roomId={team.roomId} />
      </div>

      <div className="users-details">
        {userList.map((userEelement, index) => {
          return (
            <div className="author" key={index}>
              <Avatar userId={userEelement.userId} roomId={null} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
