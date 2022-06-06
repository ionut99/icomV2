import { UploadNewStoringFile, DownloadFileService } from "../services/file";
import { addChildFile } from "../actions/folderActions";
// import { v4 as uuidv4 } from "uuid";

import {
  getDocumentFileService,
  getPicturePreviewService,
  updateProfilePictureService,
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
          FILE.type
        )
      );
    } else {
      console.log("Erro add File to database");
    }
  };

//

//

// handle download file
export const DownloadFileFromServer = (file, userId) => async (dispatch) => {
  DownloadFileService(file.fileId, userId).then(
    (res) => {
      console.log(res.data);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      if (typeof window.navigator.msSaveBlob === "function") {
        window.navigator.msSaveBlob(res.data, file.fileName);
      } else {
        link.setAttribute("download", file.fileName);
        document.body.appendChild(link);
        link.click();
      }
    },
    (error) => {
      alert("Something went wrong with file download!");
    }
  );
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

// handle getDocument
export const GetDocumentFile = (FileName, FilePath) => async (dispatch) => {
  const documentData = await getDocumentFileService(FileName, FilePath);
  // aici avem nevoie de verificari...
  const string = documentData.data;
  //dispatch(GetFileDocument(string));
  return string;
};

export const updateProfilePicture =
  (userID, NewPicture) => async (dispatch) => {
    const varVerify = await updateProfilePictureService(userID, NewPicture);
    // TO DO - display message
    console.log(varVerify);
  };
