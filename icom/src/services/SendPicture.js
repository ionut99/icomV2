import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { UpdateProfilePicture } from "../asyncActions/userAsyncActions";
import Resizer from "react-image-file-resizer";

import { updateUserAvatar } from "./../actions/authActions";

const SendPicture = () => {
  const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);
  const { user, userAvatar } = authObj;

  const fileChangeHandler = (File) => {
    var fileInput = false;
    if (File) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          File,
          200,
          200,
          "JPEG",
          100,
          0,
          (uri) => {
            //console.log(uri);
            //this.setState({ newImage: uri });
            //setResizedImage(uri);
            dispatch(updateUserAvatar(uri));
          },
          "base64"
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  const UploadePicture = () => {
    dispatch(UpdateProfilePicture(user.userId, userAvatar));
  };
  return { UploadePicture, fileChangeHandler };
};

export default SendPicture;
