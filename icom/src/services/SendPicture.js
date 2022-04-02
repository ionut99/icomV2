import { useDispatch, useSelector } from "react-redux";
import { updateUserAvatarPreview } from "../actions/authActions";
import { UpdateProfilePicture } from "../asyncActions/userAsyncActions";

import Resizer from "react-image-file-resizer";

function SendPicture() {
  const dispatch = useDispatch();
  const authObj = useSelector((state) => state.auth);
  const { user, userAvatar } = authObj;

  const SelectPicture = (File) => {
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
            dispatch(updateUserAvatarPreview(uri));
          },
          "base64"
        );
      } catch (err) {
        console.log(err);
      }
    }
    //
  };

  const UpdateAvatar = () => {
    dispatch(updateUserAvatarPreview(userAvatar));
  };

  const SaveAvatarPicture = (NewAvatar) => {
    console.log("pap");
    console.log(NewAvatar);
    dispatch(UpdateProfilePicture(user.userId, NewAvatar));
  };
  return { SelectPicture, UpdateAvatar, SaveAvatarPicture };
}

export default SendPicture;
