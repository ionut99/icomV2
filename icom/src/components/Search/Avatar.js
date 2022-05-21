import React, { useState, useEffect } from "react";
import { getAvatarPictureAsync } from "../../asyncActions/authAsyncActions";
import "./avatar.css";
function Avatar(props) {
  const { userId, roomId } = props;

  const [actualSrc, setActualSrc] = useState("");
  useEffect(() => {
    if (userId === null) return;
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

  return <img src={actualSrc} alt="userAvatar jmecher" />;
}

export default Avatar;
