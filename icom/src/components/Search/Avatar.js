import React, { useState, useEffect } from "react";
import { getAvatarPictureAsync } from "../../asyncActions/authAsyncActions";
import "./avatar.css";
import { Spinner } from "react-bootstrap";

function Avatar(props) {
  const { userId, roomId } = props;

  const [actualSrc, setActualSrc] = useState("");

  //
  const [loaded, setLoaded] = useState(false);

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

    setLoaded(true);

    return () => {
      isMounted = false;
    };
  }, [userId, roomId]);

  return (
    <>
      {loaded ? (
        <img src={actualSrc} alt="userAvatar jmecher" />
      ) : (
        <Spinner animation="border" />
      )}
    </>
  );
}

export default Avatar;
