const multer = require("multer");
const path = require("path");
var fs = require("fs");

const { UpdateAvatarPathData, GetUserDetails } = require("../services/User");
const { handleResponse } = require("../helpers/utils");
const { ReadFile } = require("../services/Files");

const storage = multer.diskStorage({
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
    let upload = multer({ storage: storage }).single("avatar");
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

      if (currentAvatarPath.length > 0) {
        fs.unlinkSync(currentAvatarPath, function (err) {
          if (err) throw err;
          // if no error, file has been deleted successfully
          console.log("File deleted!");
        });
      }

      pathToStore = req.file.path.replace(/\\/g, "\\\\");
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

async function GetProfilePicture(req, res) {
  const userID = req.body.userID;

  if (userID === null) {
    return handleResponse(req, res, 410, "Invalid Request Parameters ");
  }

  const userDetails = await GetUserDetails(userID);
  const results = JSON.parse(JSON.stringify(userDetails));
  const currentAvatarPath = results[0].Avatar;

  //   if (currentAvatarPath.length > 0) {
  //     var extension = path.extname(currentAvatarPath);
  //     var fileName = path.basename(currentAvatarPath);
  //     var contentType = "image/" + extension.replace(".", "");

  //     // res.writeHead(200, {
  //     //   "Content-Type": contentType,
  //     // });

  //     // read file..
  //     //const pictureContent = await ReadFile(currentAvatarPath);
  //     //console.log(pictureContent);
  //     // if (pictureContent === "FAILED") {
  //     //   return handleResponse(req, res, 404, " Error Loading Profile Picture ");
  //     // }
  //     res.send({
  //       fileName: fileName,
  //       contentType: contentType,
  //       pictureContent: pictureContent,
  //     });
  //   }

  var options = {
    //root: path.join(__dirname, "public"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  res.sendFile(currentAvatarPath, options, function (err) {
    if (err) {
      return handleResponse(req, res, 410, " Err send File ");
    } else {
      console.log("Sent:", currentAvatarPath);
    }
  });
}

module.exports = {
  GetDocument,
  UpdateProfilePicture,
  GetProfilePicture,
};
