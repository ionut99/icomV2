import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

import { updateUserAvatar } from "../../actions/authActions";
import { UpdateProfilePicture } from "../../asyncActions/userAsyncActions";
import { getAvatarPictureAsync } from "../../asyncActions/authAsyncActions";
// import Avatar from "../Search/Avatar";

function UploadAvatar(props) {
  const { open, discard, setDiscard, handleClose } = props;

  const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);
  const { user, userAvatar } = authObj;

  const [userInfo, setuserInfo] = useState({
    file: [],
    filepreview: userAvatar,
  });

  // load preview photo
  useEffect(() => {
    let isMounted = true;

    const avatarSrc = async (userID) => {
      const avatarSrc = await getAvatarPictureAsync(userID, userID, false);
      if (avatarSrc !== "FAILED") {
        return avatarSrc;
      }
    };
    if (user.userId !== null && user.userId !== undefined) {
      avatarSrc(user.userId).then((result) => {
        if (isMounted) {
          setuserInfo({
            file: [],
            filepreview: result,
          });
          dispatch(updateUserAvatar(result));
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [user.userId, dispatch]);

  const [invalidImage, setinvalidImage] = useState(null);
  let reader = new FileReader();
  // select image function
  const handleInputChange = (event) => {
    const imageFile = event.target.files[0];
    const imageFilname = event.target.files[0].name;
    setDiscard(true);
    if (!imageFile) {
      setinvalidImage("Please select image.");
      return false;
    }

    if (!imageFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif)$/)) {
      setinvalidImage("Please select valid image JPG,JPEG,PNG");
      return false;
    }
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        //------------- Resize img code ----------------------------------
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 200;
        var MAX_HEIGHT = 200;
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        //var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        ctx.canvas.toBlob(
          (blob) => {
            const file = new File([blob], imageFilname, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            setuserInfo({
              ...userInfo,
              file: file,
              filepreview: URL.createObjectURL(imageFile),
            });
          },
          "image/jpeg",
          1
        );
        setinvalidImage(null);
      };
      img.onerror = () => {
        setinvalidImage("Invalid image content.");
        return false;
      };
      //debugger
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const handleConfirmation = () => {
    dispatch(UpdateProfilePicture(user.userId, userInfo.file));
    dispatch(updateUserAvatar(userInfo.filepreview));
    setDiscard(false);
    handleClose();
  };

  return (
    <div>
      <div className="upload-box" style={{ display: open ? "block" : "none" }}>
        <div className="image-preview">
          <img alt="Resize Img" src={userInfo.filepreview} />
          {/* <Avatar userID={user.userId} /> */}
        </div>
        <div className="upload-action">
          <label className="custom-file-upload">
            <input type="file" accept="image/*" onChange={handleInputChange} />
            Choose new profile
          </label>
        </div>
        <div
          style={{
            display: discard && open ? "block" : "none",
          }}
          className="typography-subtitle"
        >
          Save new profile picture?
        </div>
      </div>
      <div className="dialogAction">
        <div
          className="choose"
          style={{
            display: discard && open ? "block" : "none",
          }}
        >
          <input
            className="mybutton-close"
            type="button"
            value="No"
            onClick={handleClose}
          />
          <input
            className="mybutton-yes"
            type="button"
            value="Yes"
            onClick={handleConfirmation}
          />
        </div>
      </div>
    </div>
  );
}

export default UploadAvatar;
