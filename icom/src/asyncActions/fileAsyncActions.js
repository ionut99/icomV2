import { UploadNewStoringFile, DownloadFileService } from "../services/file";
import { addChildFile } from "../actions/userActions";

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
          res_addFile.data["type"],
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
export const DownloadFileFromServer = (fileId, userId) => async (dispatch) => {
  // const res_addFile = await DownloadFileService(fileId, userId);
  // console.log(res_addFile);
  DownloadFileService(fileId, userId).then(
    (res) => {
      console.log(res.data);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      if (typeof window.navigator.msSaveBlob === "function") {
        window.navigator.msSaveBlob(res.data, "yy.png");
      } else {
        link.setAttribute("download", "yy.png");
        document.body.appendChild(link);
        link.click();
      }
    },
    (error) => {
      alert("Something went wrong");
    }
  );
};
