import React, { useState, useEffect } from "react";

import { getAvatarPictureAsync } from "../../asyncActions/authAsyncActions";
// import { useDispatch, useSelector } from "react-redux";
import "./avatar.css";
function Avatar(props) {
  const { userID, roomID, atuhUser } = props;

  //   const dispatch = useDispatch();
  //   const authObj = useSelector((state) => state.auth);
  //   const { user } = authObj;

  const [actualSrc, setActualSrc] = useState("placeholder image link");
  useEffect(() => {
    // const ac = new AbortController();
    let isMounted = true;

    const avatarSrc = async (userID, atuhUser) => {
      const ISroom = false;
      const avatarSrc = await getAvatarPictureAsync(userID, atuhUser, ISroom);
      if (avatarSrc !== "FAILED") {
        return avatarSrc;
      }
    };

    const avatarRoom = async (roomID, atuhUser) => {
      const ISroom = true;
      const avatarSrc = await getAvatarPictureAsync(roomID, atuhUser, ISroom);
      if (avatarSrc !== "FAILED") {
        return avatarSrc;
      }
    };

    if (
      roomID !== null &&
      roomID !== undefined &&
      atuhUser !== null &&
      atuhUser !== undefined
    ) {
      avatarRoom(roomID, atuhUser).then((result) => {
        if (isMounted) setActualSrc(result);
      });
    }

    if (
      userID !== null &&
      userID !== undefined &&
      atuhUser !== null &&
      atuhUser !== undefined
    ) {
      avatarSrc(userID, atuhUser).then((result) => {
        if (isMounted) setActualSrc(result);
      });
    }

    return () => {
      isMounted = false;
    };
    // return () => ac.abort(); // Abort both fetches on unmount
  }, [userID, roomID, atuhUser]);

  return (
    <div className="user_picture">
      <img
        className="user_picture_img"
        src={actualSrc}
        alt="userAvatar jmecher"
      />
    </div>
  );
}

export default Avatar;
