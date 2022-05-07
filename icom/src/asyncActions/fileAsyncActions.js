import { AddNewFileInDataBase } from "../services/file";
import { UploadNewStoringFile } from "../services/user";
// Add New File into system
export const AddNewFile =
  (fileName, filePath, folderId, userId, createdAt) => async (dispatch) => {
    const varVerify = await AddNewFileInDataBase(
      fileName,
      filePath,
      folderId,
      userId,
      createdAt
    );
    // TO DO - display message
    //console.log(varVerify);
  };

// handle upload new file
export const UploadFileForStoring =
  (folderId, userId, createdTime, FILE) => async (dispatch) => {
    const varVerify = await UploadNewStoringFile(
      folderId,
      userId,
      createdTime,
      FILE
    );
    // TO DO - display message
    console.log(varVerify);
  };
