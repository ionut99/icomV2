const multer = require("multer");
const path = require("path");
var fs = require("fs");
var uui = require("uuid");

const {
  UpdateAvatarPathData,
  GetUserDetailsData,
  GetRoomDetails,
  GetPrivateRoomOtherUserDetails,
} = require("../services/User");

const {
  InsertNewFileDataBase,
  InsertNewFileRelationDataBase,
} = require("../services/Files");

const { GetFolderDetails } = require("../services/Folders");
const { handleResponse } = require("../helpers/utils");

const { GetDocumentContentService } = require("../services/Files");

const { dir } = require("console");

const defaultAvatarPicure = path.join(
  __dirname,
  "../../../",
  "users/images/avatar/default.png"
);

const { mimeTypes } = require("../helpers/mimeType");

const storageAvatar = multer.diskStorage({
  destination: path.join(__dirname, "../../../users/images/", "avatar"),
  filename: function (req, file, cb) {
    // null as first argument means no error
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const storageFile = multer.diskStorage({
  destination: path.join(__dirname, "../../../users/tempDir/"),
  filename: function (req, file, cb) {
    // null as first argument means no error
    cb(null, file.originalname);
  },
});

async function UpdateProfilePicture(req, res) {
  try {
    let upload = multer({ storage: storageAvatar }).single("avatar");
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
      const userID = req.body.userID;
      //must to delete old avatar photo befor upload next one

      const userDetails = await GetUserDetailsData(userID);
      const results = JSON.parse(JSON.stringify(userDetails));
      // console.log("Detalii despre useri:");
      // console.log(results);
      const currentAvatarPath = results[0].Avatar;

      if (
        currentAvatarPath !== null &&
        currentAvatarPath !== defaultAvatarPicure
      ) {
        fs.unlinkSync(currentAvatarPath, function (err) {
          if (err) throw err;
          // if no error, file has been deleted successfully
          console.log("File deleted!");
        });
      }

      // pathToStore = req.file.path.replace(/\\/g, "\\\\");
      var pathToStore = path.join("users/images/avatar/", req.file.filename);
      pathToStore = pathToStore.replace(/\\/g, "\\\\");
      // console.log(pathToStore);

      const result = await UpdateAvatarPathData(userID, pathToStore);
      if (result === "FAILED") {
        return handleResponse(req, res, 412, " DataBase Error ");
      }

      return handleResponse(req, res, 200, { UpdateProfilePicture: "SUCCESS" });
    });
  } catch (err) {
    //console.log(err);
    return handleResponse(req, res, 190, { UpdateProfilePicture: "FAILED" });
  }
}

// returns a promise which resolves true if file exists:
function checkFileExists(filepath) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.constants.F_OK, (error) => {
      resolve(!error);
    });
  });
}

// handle Upload New File
async function UploadNewStoredFile(req, res) {
  try {
    let upload = multer({ storage: storageFile }).single("storedfile");

    upload(req, res, async (err) => {
      // console.log("fisier:");
      // console.log(req.file);

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

      const oldPath = path.join(__dirname, "../../../users/tempDir/", fileName);
      const newPath = path.join(__dirname, "../../../users/", userId);

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

    if (userId === null || userId === undefined) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var currentAvatarPath = "";

    if (roomId == null || roomId == undefined) {
      const userDetails = await GetUserDetailsData(userId);
      if (userDetails === "FAILED") {
        throw new Error("  Err Get User Details  ");
      }
      const results = JSON.parse(JSON.stringify(userDetails));
      if (results[0].Avatar != undefined) {
        currentAvatarPath = results[0].Avatar;
      }
    } else if (userId != null && roomId != null) {
      currentAvatarPath = "";
    }

    if (currentAvatarPath === "") {
      currentAvatarPath = defaultAvatarPicure;
    } else {
      currentAvatarPath = path.join(__dirname, "../../../", currentAvatarPath);
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
          // throw new Error("  Err send File  ");
          //return handleResponse(req, res, 410, " Err send File ");
          console.error(error);
          return handleResponse(req, res, 410, "  Err send File  ");
        }
      });
    } else {
      // throw new Error(" EmptyAvatar ");
      //return handleResponse(req, res, 513, "EmptyAvatar");
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

  // var ContentFile = await GetDocumentContentService(fileId, userId);
  // if (ContentFile === "FAILED") {
  //   return handleResponse(req, res, 412, " DataBase Error ");
  // }

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
