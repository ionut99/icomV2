import React, { useState, useEffect } from "react";

import { getAvatarPictureAsync } from "../../asyncActions/authAsyncActions";
// import { useDispatch, useSelector } from "react-redux";
import "./avatar.css";
function Avatar(props) {
  const { userId, roomId } = props;

  //   const dispatch = useDispatch();
  //   const authObj = useSelector((state) => state.auth);
  //   const { user } = authObj;

  const [actualSrc, setActualSrc] = useState("placeholder image link");
  useEffect(() => {
    if (userId == null && userId === undefined) return;
    let isMounted = true;

    const avatarSrc = async (userId) => {
      const avatarSrc = await getAvatarPictureAsync(userId, roomId);
      if (avatarSrc !== "FAILED") {
        return avatarSrc;
      }
    };

    avatarSrc(userId).then((result) => {
      if (isMounted) setActualSrc(result);
    });

    return () => {
      isMounted = false;
    };
  }, [userId, roomId]);

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
