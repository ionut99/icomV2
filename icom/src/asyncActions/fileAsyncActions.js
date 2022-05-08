import { AddNewFileInDataBase } from "../services/file";
import { UploadNewStoringFile } from "../services/user";
import { addChildFile } from "../actions/userActions";
// Add New File into system
// export const AddNewFile =
//   (fileName, filePath, folderId, userId, createdAt) => async (dispatch) => {
//     const res_addFile = await AddNewFileInDataBase(
//       fileName,
//       filePath,
//       folderId,
//       userId,
//       createdAt
//     );

//     if (res_addFile.status !== 200) {
//       console.log("Erro add File to database");
//     }
//     // if folder addded with succes then add it to folderList
//     // if (res_addFile.status === 200) {
//     //   dispatch(
//     //     addChildFile(
//     //       res_addFile.data["fileId"],
//     //       fileName,
//     //       createdAt,
//     //       folderId,
//     //       res_addFile.data["fileType"],
//     //       userId,
//     //       res_addFile.data["fileSize"]
//     //     )
//     //   );
//     // }
//   };

// handle upload new file
export const UploadFileForStoring =
  (folderId, userId, createdTime, FILE) => async (dispatch) => {
    const res_addFile = await UploadNewStoringFile(
      folderId,
      userId,
      createdTime,
      FILE
    );
    if (res_addFile.status === 200) {
      dispatch(
        addChildFile(
          res_addFile.data["fileId"],
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
