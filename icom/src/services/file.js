import axios from "axios";
// import download from "js-file-download";
const { REACT_APP_API_URL } = process.env;

// get File List from folder
export const getFileList = async (folderId, userId) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/folder/getfiles`, {
      folderId,
      userId,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// uploading File for Storing
export const UploadNewStoringFile = async (folderId, userId, fileId, FILE) => {
  const formdata = new FormData();
  formdata.append("storedfile", FILE);
  formdata.append("folderId", folderId);
  formdata.append("userId", userId);
  formdata.append("fileId", fileId);
  try {
    return await axios.post(
      `${REACT_APP_API_URL}/document/newStoragefile`,
      formdata,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

//

//

// download file from server
export const DownloadFileService = async (fileId, userId) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/document/download`,
      {
        fileId,
        userId,
      },
      { responseType: "blob" }
    );

    return response;
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

//

//

// get specific document
export const getDocumentContentById = async (fileId, userId) => {
  try {
    return await axios.post(
      `${REACT_APP_API_URL}/document/getdocumentcontent`,
      {
        fileId,
        userId,
      }
    );
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// get message image preview
export const getPicturePreviewService = async (fileId, userId) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/document/image`,
      {
        fileId,
        userId,
      },
      { responseType: "blob" }
    );

    return response;
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// get document data
export const getDocumentFileService = async (FileName, FilePath) => {
  try {
    return await axios.post(`${REACT_APP_API_URL}/document/getdocument`, {
      FileName,
      FilePath,
    });
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};

// update user picture
export const updateProfilePictureService = async (userID, NewPicture) => {
  const formdata = new FormData();
  formdata.append("avatar", NewPicture);
  formdata.append("userID", userID);
  try {
    return await axios.post(
      `${REACT_APP_API_URL}/users/updatePicture`,
      formdata,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } catch (err) {
    return {
      error: true,
      response: err.response,
    };
  }
};
