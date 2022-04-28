const multer = require("multer");
const path = require("path");
var fs = require("fs");

const {
  UpdateAvatarPathData,
  GetUserDetails,
  GetRoomDetails,
  GetPrivateRoomOtherUserDetails,
} = require("../services/User");
const { handleResponse } = require("../helpers/utils");
const { ReadFile } = require("../services/Files");
const { dir } = require("console");

const defaultAvatarPicure = path.join(
  __dirname,
  "../../../",
  "users/images/avatar/default.png"
);

const storageAvatar = multer.diskStorage({
  destination: path.join(__dirname, "../../../users/images/", "avatar"),
  filename: function (req, file, cb) {
    // null as first argument means no error
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// return messages from a room
async function GetDocument(req, res) {
  // const roomID = req.body.ChannelID;

  // if (roomID === null) {
  //   return handleResponse(req, res, 410, "Invalid Request Parameters ");
  // }

  // var messageRoomList = await GetRoomMessagesData(roomID);
  // console.log("Buna aici este un docuemnt de trimis");
  return handleResponse(req, res, 200, "de aici incepe sesiunea");
}

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

      const userDetails = await GetUserDetails(userID);
      const results = JSON.parse(JSON.stringify(userDetails));
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

// handle Upload New File
async function UploadNewStoredFile(req, res) {
  try {
    var storageFile = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "../tempDir/");
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    });

    let upload = multer({ storage: storageAvatar }).single("storedfile");

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

      const fileName = req.body.fileName;
      const filePath = req.body.filePath;
      const folderId = req.body.folderId;
      const userId = req.body.userId;
      const createdAt = req.body.createdAt;

      console.log(
        "fisierul pe care vrem sa l incarcam are urmatoarele caractaristici: "
      );
      console.log(fileName);
      console.log(filePath);
      console.log(folderId);
      console.log(userId);
      console.log(createdAt);
      
      return handleResponse(req, res, 200, { UpdateProfilePicture: "SUCCESS" });
    });
  } catch (err) {
    //console.log(err);
    return handleResponse(req, res, 190, { UpdateProfilePicture: "FAILED" });
  }
}

async function GetProfilePicture(req, res) {
  try {
    const ID = req.body.ID;
    const atuhUser = req.body.atuhUser;
    const ISroom = req.body.ISroom;

    if (
      ID === null ||
      ID === undefined ||
      ISroom === undefined ||
      ISroom === null ||
      atuhUser === undefined ||
      atuhUser === null
    ) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var currentAvatarPath = "";

    if (!ISroom) {
      const userDetails = await GetUserDetails(ID);
      if (userDetails === "FAILED") {
        throw new Error("  Err Get User Details  ");
      }
      const results = JSON.parse(JSON.stringify(userDetails));
      if (results[0].Avatar != undefined) {
        currentAvatarPath = results[0].Avatar;
      }
    } else {
      // TO DO - find user from Room OR... if is public room we display

      const roomDetails = await GetRoomDetails(ID);
      if (roomDetails === "FAILED") {
        throw new Error("  Err Get Room Details  ");
      }
      const results = JSON.parse(JSON.stringify(roomDetails));
      if (results[0].Private > 0) {
        const theOtherUser = await GetPrivateRoomOtherUserDetails(ID, atuhUser);
        if (theOtherUser === "FAILED") {
          throw new Error("  Err Other User Details  ");
        }
        const theOtherUserJson = JSON.parse(JSON.stringify(theOtherUser));

        const userDetails = await GetUserDetails(theOtherUserJson[0].UserID);
        if (userDetails === "FAILED") {
          throw new Error("  Err Get User Details  ");
        }

        const results = JSON.parse(JSON.stringify(userDetails));
        if (results[0].Avatar != undefined) {
          currentAvatarPath = results[0].Avatar;
        }
      } else {
        // to do pentru grupuri...
      }
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
      // console.log("calea este: ");
      // console.log(currentAvatarPath);

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

module.exports = {
  GetDocument,
  UpdateProfilePicture,
  GetProfilePicture,
  UploadNewStoredFile,
};
