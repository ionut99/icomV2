import React, { useState, useEffect } from "react";
import { getAvatarPictureAsync } from "../../asyncActions/authAsyncActions";
import { Spinner } from "react-bootstrap";

import defaultAvatar from "../../images/defaultAvatar.png";
import "./avatar.css";

function Avatar(props) {
  const { userId, roomId } = props;
  const [actualSrc, setActualSrc] = useState("");
  //
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (userId === null) return;
    //
    let isMounted = true;

    getAvatarPictureAsync(userId, roomId).then((result) => {
      if (isMounted) {
        if (result === undefined) {
          setActualSrc(defaultAvatar);
        } else {
          setActualSrc(result);
        }
        setLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [userId, roomId]);

  return (
    <>
      {loaded ? (
        <img src={actualSrc} alt="cool avatar" />
      ) : (
        <Spinner animation="border" />
      )}
    </>
  );
}

export default Avatar;
