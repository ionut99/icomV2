const multer = require("multer");
const path = require("path");
var fs = require("fs");
var uui = require("uuid");

const {
  UpdateAvatarPathData,
  GetUserDetailsData,
} = require("../../services/User");
//
const {
  InsertNewFileDataBase,
  InsertNewFileRelationDataBase,
} = require("../../services/Files");
//
const { handleResponse } = require("../../helpers/utils");
const { GetFolderDetails } = require("../../services/Folders");
const { checkFileExists, extractProfilePicturePath } = require("./files_utils");

// const { GetDocumentContentService } = require("../../services/Files");

const defaultAvatarPicure = path.join(
  __dirname,
  "../../../../",
  "users/default/default_avatar.png"
);

const { mimeTypes } = require("../../helpers/mimeType");

const storageFile = multer.diskStorage({
  destination: path.join(__dirname, "../../../../users/tempDir/"),
  filename: function (req, file, cb) {
    // null as first argument means no error
    cb(null, file.originalname);
  },
});

// change profile picture //
async function UpdateProfilePicture(req, res) {
  try {
    let upload = multer({ storage: storageFile }).single("avatar");
    upload(req, res, async (err) => {
      if (!req.file) {
        return handleResponse(
          req,
          res,
          413,
          "Please select an image to upload"
        );
      } else if (err instanceof multer.MulterError) {
        return handleResponse(req, res, 415, "Multer Error");
      } else if (err) {
        return handleResponse(
          req,
          res,
          413,
          "Please select an image to upload"
        );
      }
      // file details
      const fileName = req.file.originalname;

      const userID = req.body.userID;
      const userDetails = await GetUserDetailsData(userID);
      const results = JSON.parse(JSON.stringify(userDetails));

      // verific daca exista folderul unde se va salva avatarul
      const oldPath = path.join(
        __dirname,
        "../../../../users/tempDir/",
        fileName
      );
      const newPath = path.join(__dirname, "../../../../users/", userID);

      try {
        if (!(await checkFileExists(newPath))) {
          console.log("Nu exista folderr...");
          fs.mkdir(newPath, { recursive: true }, (err) => {
            if (err) {
              return console.error(err);
            }
            console.log("Directory created successfully!");
          });
        }
      } catch (err) {
        console.error(err);
      }
      const createdTime = Date.now();
      fs.rename(
        oldPath,
        newPath + "/" + createdTime + " " + fileName,
        async function (err) {
          if (err) {
            throw err;
          } else {
            console.log("Successfully stored new avatar");
          }
        }
      );

      // var pathToStore = newPath + "/" + createdTime + " " + fileName;
      var pathToStore = path.join(
        "users/" + userID + "/",
        createdTime + " " + fileName
      );
      pathToStore = pathToStore.replace(/\\/g, "\\\\");

      const result = await UpdateAvatarPathData(userID, pathToStore);
      if (result === "FAILED")
        return handleResponse(req, res, 412, " DataBase Error ");

      return handleResponse(req, res, 200, { UpdateProfilePicture: "SUCCESS" });
    });
  } catch (err) {
    //console.log(err);
    return handleResponse(req, res, 190, { UpdateProfilePicture: "FAILED" });
  }
}

// handle Upload New File
async function UploadNewStoredFile(req, res) {
  try {
    let upload = multer({ storage: storageFile }).single("storedfile");

    upload(req, res, async (err) => {
      if (!req.file) {
        console.log(req.file);
        return handleResponse(
          req,
          res,
          413,
          "Please select a real file to upload"
        );
      } else if (err instanceof multer.MulterError) {
        return handleResponse(req, res, 415, "Multer Error");
      } else if (err) {
        return handleResponse(req, res, 413, "Error when try to upload a file");
      }

      // file details
      const fileName = req.file.originalname;
      const fileType = req.file.mimetype;
      const fileSize = req.file.size;

      // server details
      const fileId = uui.v4();
      const folderId = req.body.folderId;
      const userId = req.body.userId;
      const createdTime = req.body.createdTime;

      const oldPath = path.join(__dirname, "../../../../users/tempDir/", fileName);
      const newPath = path.join(__dirname, "../../../../users/", userId);

      try {
        if (!(await checkFileExists(newPath))) {
          console.log("Nu exista folderr...");
          fs.mkdir(newPath, { recursive: true }, (err) => {
            if (err) {
              return console.error(err);
            }
            console.log("Directory created successfully!");
          });
        }
      } catch (err) {
        console.error(err);
      }

      fs.rename(oldPath, newPath + "/" + fileName, async function (err) {
        if (err) {
          throw err;
        } else {
          console.log("Successfully storage the file!");

          //Store File details in database
          var result = await InsertNewFileDataBase(
            fileId,
            mimeTypes[fileType],
            fileName,
            folderId,
            createdTime,
            userId,
            fileSize
          );

          if (result === "FAILED") {
            console.log("Error storage folder configuration!");
            return handleResponse(req, res, 412, " DataBase Error ");
          }

          if (folderId !== "root") {
            const parentFolder = await GetFolderDetails(folderId);

            if (parentFolder === "FAILED") {
              console.log("Error get details about folder!");
              return handleResponse(req, res, 412, " DataBase Error ");
            }
            // console.log(parentFolder[0].RoomIdBeneficiary);
            if (parentFolder[0].RoomIdBeneficiary !== null) {
              result = await InsertNewFileRelationDataBase(
                fileId,
                userId,
                parentFolder[0].RoomIdBeneficiary
              );
              if (result === "FAILED") {
                console.log("Error storage folder configuration!");
                return handleResponse(req, res, 412, " DataBase Error ");
              }
            } else {
              result = await InsertNewFileRelationDataBase(
                fileId,
                userId,
                null
              );
              if (result === "FAILED") {
                console.log("Error storage folder configuration!");
                return handleResponse(req, res, 412, " DataBase Error ");
              }
            }
          } else {
            result = await InsertNewFileRelationDataBase(fileId, userId, null);
            if (result === "FAILED") {
              console.log("Error storage folder configuration!");
              return handleResponse(req, res, 412, " DataBase Error ");
            }
          }

          return handleResponse(req, res, 200, {
            StorageFile: "SUCCESS",
            fileId: fileId,
            type: mimeTypes[fileType],
          });
        }
      });
    });
  } catch (err) {
    return handleResponse(req, res, 190, { StorageFile: "FAILED" });
  }
}

async function GetProfilePicture(req, res) {
  try {
    const userId = req.body.userId;
    const roomId = req.body.roomId;

    if (userId === null) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var currentAvatarPath = await extractProfilePicturePath(userId, roomId);

    if (currentAvatarPath === "") {
      currentAvatarPath = defaultAvatarPicure;
    } else {
      currentAvatarPath = path.join(__dirname, "../../../../", currentAvatarPath);
    }

    var options = {
      //root: path.join(__dirname, "public"),
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    };

    if (currentAvatarPath !== null && currentAvatarPath !== "") {
      res.sendFile(currentAvatarPath, options, function (error) {
        if (error) {
          console.error(error);
          return handleResponse(req, res, 410, "  Err send File  ");
        }
      });
    } else {
      console.error(" Empty Avatar ");
      return handleResponse(req, res, 410, "  Err send File  ");
    }
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 410, "  Err send File  ");
  }
}

// Get Child Folder List
async function GetDocumentContent(req, res) {
  const fileId = req.body.fileId;
  const userId = req.body.userId;

  ContentFile = [
    { insert: "Hello " },
    { insert: "World!", attributes: { bold: true } },
    { insert: "\n" },
  ];

  return handleResponse(req, res, 200, { ContentFile });
}

module.exports = {
  UpdateProfilePicture,
  GetProfilePicture,
  UploadNewStoredFile,
  GetDocumentContent,
};
