import { UploadNewStoringFile, DownloadFileService } from "../services/file";
import { addChildFile } from "../actions/folderActions";

import {
  getPicturePreviewService,
  updateProfilePictureService,
  SaveFileStateService,
} from "../services/file";

// handle upload new file
export const UploadFileForStoring =
  (folderId, userId, createdTime, fileId, FILE) => async (dispatch) => {
    const res_addFile = await UploadNewStoringFile(
      folderId,
      userId,
      fileId,
      FILE
    );
    if (res_addFile.status === 200) {
      dispatch(
        addChildFile(
          fileId,
          FILE.name,
          createdTime,
          folderId,
          FILE.type,
          userId,
          FILE.size
        )
      );
    } else {
      console.log("Erro add File to database");
    }
  };

//

// handle download file
export const DownloadFileFromServer = async (fileId, fileName, userId) => {
  try {
    DownloadFileService(fileId, userId)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        if (typeof window.navigator.msSaveBlob === "function") {
          window.navigator.msSaveBlob(res.data, fileName);
        } else {
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch((error) => {
        alert("Something went wrong with file download!");
        throw error;
      });
  } catch (error) {
    throw error;
  }
};

export const getPicturePreview = async (fileId, userId) => {
  const resultBlob = await getPicturePreviewService(fileId, userId);
  //
  return new Promise((resolve) => {
    //

    if (resultBlob.error === true || userId === undefined) {
      return resolve("failed");
    }
    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(resultBlob.data);
    fileReaderInstance.onload = () => {
      const base64data = fileReaderInstance.result;
      return resolve(base64data);
    };
  });
};

export const updateProfilePicture =
  (userId, newPicture) => async (dispatch) => {
    const varVerify = await updateProfilePictureService(userId, newPicture);
    // TO DO - display message
    console.log(varVerify);
  };

// // save editor text file

export const saveTextFileAsync =
  (userId, fileId, folderId, fileName, fileSize, fileContent, createdTime) =>
  async (dispatch) => {
    //

    const res_saveText = await SaveFileStateService(
      userId,
      folderId,
      fileId,
      fileName,
      fileSize,
      fileContent
    );
    //
    if (res_saveText.status === 200) {
      if (res_saveText.data.SaveTextFile) {
        dispatch(
          addChildFile(
            fileId,
            fileName,
            createdTime,
            folderId,
            "text/plain",
            userId,
            fileSize
          )
        );
      }
    } else {
      console.log("Erro add File to database");
    }
  };
