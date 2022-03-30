import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { UpdateProfilePicture } from "../asyncActions/userAsyncActions";
import Resizer from "react-image-file-resizer";

const SendPicture = () => {
  const dispatch = useDispatch();

  const authObj = useSelector((state) => state.auth);
  const { user } = authObj;

  const [resizedImage, setResizedImage] = useState("");

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
            setResizedImage(uri);
          },
          "base64",
          250,
          250
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  const UploadePicture = (resizedImage) => {
    dispatch(UpdateProfilePicture(user.userId, resizedImage));
  };
  return { setResizedImage, UploadePicture, fileChangeHandler, resizedImage };
};

export default SendPicture;
