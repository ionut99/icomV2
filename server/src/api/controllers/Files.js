const multer = require("multer");
const path = require("path");
var fs = require("fs");
var date = require("date-and-time");
const crypto = require("crypto");

// const { decryptString } = require("../helpers/security");
//
const ALGORITHM_KEY_SIZE = 32;
const PBKDF2_NAME = "sha256";
const PBKDF2_ITERATIONS = 32767;
//
const { GetRoomDetailsData } = require("../services/Room");
//
const {
  UpdateGroupAvatar,
  UpdateAvatarPathData,
  GetUserDetailsData,
} = require("../services/User");
//
const {
  GetFileDetailsFromDataBase,
  VerifyIfExist,
  InsertNewFileDataBase,
  UpdateFileDetails,
} = require("../services/Files");
const { handleResponse } = require("../helpers/auth_utils");
//
const {
  checkFileExists,
  extractProfilePicturePath,
  saveFileConfiguration,
  writeCustomFile,
  readCustomFile,
  CreateFileUserRelation,
} = require("../helpers/files_utils");

const storageFile = multer.diskStorage({
  destination: path.join(__dirname, "../../../users/tempDir/"),
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    // null as first argument means no error
  },
});

async function UpdateGroupPicture(req, res) {
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
      const userId = req.body.userId;
      const roomId = req.body.roomId;

      const roomData = await GetRoomDetailsData(roomId)
        .then(function (result) {
          if (result.length > 0) return result[0];
          else return undefined;
        })
        .catch((err) => {
          throw err;
        });
      //
      if (roomData === undefined) {
        throw new Error("Wrong room ID!");
      }
      //
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
        throw err;
      }
      //
      try {
        const createdTime = Date.now();
        fs.rename(
          oldPath,
          newPath + "/" + createdTime + " " + fileName,
          async function (err) {
            if (err) {
              throw err;
            } else {
              console.log("Successfully stored new avatar");
              var pathToStore = path.join(
                userId + "/",
                createdTime + " " + fileName
              );
              pathToStore = pathToStore.replace(/\\/g, "\\\\");

              try {
                // function for room update avatar ..
                const result = await UpdateGroupAvatar(roomId, pathToStore);
              } catch (err) {
                throw err;
              }

              return handleResponse(req, res, 200, {
                UpdateGroupPicture: true,
              });
            }
          }
        );
      } catch (error) {
        throw error;
      }
    });
  } catch (err) {
    return handleResponse(req, res, 190, { UpdateGroupPicture: false });
  }
}

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
      const userId = req.body.userId;

      const userDetails = await GetUserDetailsData(userId)
        .then(function (result) {
          if (result.length > 0) return result[0];
          else return undefined;
        })
        .catch((err) => {
          throw err;
        });
      //
      if (userDetails === undefined) {
        return handleResponse(req, res, 410, " Wrong USER ID! ");
      }
      // verific daca exista folderul unde se va salva avatarul
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
        throw err;
      }
      //
      try {
        const createdTime = Date.now();
        fs.rename(
          oldPath,
          newPath + "/" + createdTime + " " + fileName,
          async function (err) {
            if (err) {
              throw err;
            } else {
              console.log("Successfully stored new avatar");
              var pathToStore = path.join(
                userId + "/",
                createdTime + " " + fileName
              );
              pathToStore = pathToStore.replace(/\\/g, "\\\\");

              const result = await UpdateAvatarPathData(userId, pathToStore);
              if (result === "FAILED")
                return handleResponse(req, res, 412, " DataBase Error ");

              return handleResponse(req, res, 200, {
                UpdateProfilePicture: "SUCCESS",
              });
            }
          }
        );
      } catch (error) {
        throw error;
      }
    });
  } catch (err) {
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
      const fileId = req.body.fileId;
      const folderId = req.body.folderId;
      const userId = req.body.userId;
      // const createdTime = req.body.createdTime;

      // store details about file
      const save_rez = await saveFileConfiguration(
        userId,
        fileName,
        fileId,
        fileType,
        fileSize,
        folderId
      );

      if (!save_rez)
        return handleResponse(req, res, 190, { StorageFile: "FAILED" });
      //

      //
      console.log("Successfully storage the file!");
      return handleResponse(req, res, 200, {
        StorageFile: "SUCCESS",
        fileId: fileId,
        type: fileType,
      });
      // store configuration
    });
  } catch (err) {
    console.error(err);
    return handleResponse(req, res, 190, { StorageFile: "FAILED" });
  }
}

// handle Upload New File
async function SaveCustomTextFile(req, res) {
  try {
    const userId = req.body.userId;
    const folderId = req.body.folderId;
    const fileId = req.body.fileId;
    const fileName = req.body.fileName;
    const fileSize = req.body.fileSize;
    const fileContent = req.body.fileContent;

    if (fileContent.length < 1 || fileSize < 1)
      throw new Error("Text size is not good ..");

    if (
      userId == null ||
      fileId == null ||
      folderId == null ||
      fileName == null
    )
      throw new Error("Undefined parameteres");

    const createdTime = date.format(new Date(), "YYYY/MM/DD HH:mm:ss.SSS");

    //

    var res_check_name = await VerifyIfExist(
      fileName,
      fileId,
      folderId,
      userId
    );

    if (res_check_name.length > 0)
      return handleResponse(req, res, 190, {
        SaveTextFile: false,
        UpdateTextFile: false,
        NameTaken: true,
      });

    //

    //
    var res_check_exit = await GetFileDetailsFromDataBase(fileId);

    if (res_check_exit.length == 0) {
      // daca nu exista ->  insereaza intrare noua in tabela

      const newFileName = Date.now() + " " + fileName;
      //
      const filePath = path.join(__dirname, "../../../users/", userId);
      var res_write = await writeCustomFile(filePath, newFileName, fileContent);
      //
      if (res_write == false)
        throw new Error("Error write custom text content to file...");

      var pathToStore = path.join(userId + "/", newFileName);
      pathToStore = pathToStore.replace(/\\/g, "\\\\");
      //

      //

      var res_service = await InsertNewFileDataBase(
        fileId,
        "text/plain",
        fileName,
        folderId,
        createdTime,
        userId,
        fileSize,
        pathToStore
      )
        .then(function (result) {
          return result.affectedRows;
        })
        .catch((err) => {
          throw err;
        });

      if (res_service !== 1)
        return new Error("Error insert file data in database ...");

      res_service = await CreateFileUserRelation(folderId, fileId, userId);
      //
      if (!res_service)
        return new Error("Error insert file user relation in database ...");
      //

      return handleResponse(req, res, 200, {
        SaveTextFile: true,
        UpdateTextFile: false,
      });
    } else {
      //  exista -> modifica dimensiunea si created time
      // console.log("custom text file exist .. trebuie modificat");

      const existFileName = res_check_exit[0].systemPath.split("\\\\")[1];

      const existFilePath = path.join(
        __dirname,
        "../../../users/",
        res_check_exit[0].systemPath.split("\\\\")[0]
      );
      //
      var res_update = await UpdateFileDetails(
        res_check_exit[0].fileId,
        fileName,
        userId,
        fileSize,
        createdTime
      )
        .then(function (result) {
          return result.affectedRows;
        })
        .catch((err) => {
          throw err;
        });

      if (res_update < 1)
        return new Error("Error update file data in database ...");

      //
      var res_write = await writeCustomFile(
        existFilePath,
        existFileName,
        fileContent
      );

      if (res_write == false)
        throw new Error("Error write custom text content to file...");

      return handleResponse(req, res, 200, {
        SaveTextFile: false,
        UpdateTextFile: true,
        NameTaken: false,
      });
    }

    //
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 190, {
      SaveTextFile: false,
      UpdateTextFile: false,
      NameTaken: false,
    });
  }
}

async function GetProfilePicture(req, res) {
  try {
    const userId = req.body.userId;
    const roomId = req.body.roomId;

    if (userId === null || userId === undefined) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var currentAvatarPath = await extractProfilePicturePath(userId, roomId);

    if (typeof currentAvatarPath == "string")
      currentAvatarPath = path.join(
        __dirname,
        "../../../users/",
        currentAvatarPath
      );
    else {
      console.error(" Empty Avatar ");
      return handleResponse(req, res, 410, "  Err send File  ");
    }

    var options = {
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    };

    if (currentAvatarPath !== null && currentAvatarPath !== undefined) {
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

// Get Editable document content
async function GetDocumentContent(req, res) {
  try {
    const fileId = req.body.fileId;
    const userId = req.body.userId;

    if (fileId == null || userId == null)
      throw new Error("Error, invalid parameters ...");

    //
    var res_check = await GetFileDetailsFromDataBase(fileId, userId);

    if (res_check.length == 0) throw new Error("Error, file not found ...");

    var filePath = res_check[0].systemPath;
    var fileName = res_check[0].fileName;
    //
    const downloadFilePath = path.join(
      __dirname,
      "../../../",
      "users/",
      filePath
    );

    var contentResult = await readCustomFile(downloadFilePath);

    if (!contentResult) throw new Error("Error read file content ...");

    return handleResponse(req, res, 200, { contentResult, fileName });
    //
    //
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 410, "  Err send File  ");
  }
}

// Download File (Anytype)
async function DownLoadFile(req, res) {
  try {
    const fileId = req.body.fileId;
    const userId = req.body.userId;

    const resDetails = await GetFileDetailsFromDataBase(fileId, userId)
      .then(function (result) {
        if (result.length > 0) return result[0];
        else return undefined;
        //
      })
      .catch((err) => {
        throw err;
      });

    if (resDetails === undefined) {
      console.log("Error get file path ... File.js lin. 340");
      return handleResponse(req, res, 410, { DownloadFile: false });
    }
    //
    const DownloadFilePath = path.join(
      __dirname,
      "../../../users/",
      resDetails.systemPath
    );

    const fileName = resDetails.fileName;
    //
    //
    const decryptedFile = path.join(
      __dirname,
      "../../../users/tempDir/",
      fileName
    );
    //
    const iv = resDetails.IV;
    //
    let secretKey = crypto.pbkdf2Sync(
      Buffer.from(fileId, "utf8"),
      iv,
      PBKDF2_ITERATIONS,
      ALGORITHM_KEY_SIZE,
      PBKDF2_NAME
    );
    //
    try {
      //
      const decrypt = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
      var input = fs.createReadStream(DownloadFilePath);
      var output = fs.createWriteStream(decryptedFile);
      input.pipe(decrypt).pipe(output);
      output.on("finish", function () {
        // console.log("Successfully decrypt file");
        res.download(decryptedFile, (err) => {
          if (err) {
            return handleResponse(req, res, 410, { DownloadFile: "FAILED" });
          }
          // delete file
          fs.unlink(decryptedFile, (err) => {
            if (err) {
              throw err;
            }
          });
        });
      });
      //
    } catch (err) {
      throw err;
    }
    //
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 410, { DownloadFile: "FAILED" });
  }
}

// get img preview (for img messages or details view)
async function GetPicturePreview(req, res) {
  try {
    const fileId = req.body.fileId;
    const userId = req.body.userId;

    if (userId === null || userId === undefined) {
      return handleResponse(req, res, 410, "Invalid Request Parameters ");
    }

    var filePath = await GetFileDetailsFromDataBase(fileId, userId)
      .then(function (result) {
        if (result.length == 0) {
          return undefined;
        }
        return result[0].systemPath;
      })
      .catch((err) => {
        throw err;
      });

    if (typeof filePath == "string")
      filePath = path.join(__dirname, "../../../users/", filePath);
    else {
      console.error(" Error preview Image ");
      return handleResponse(req, res, 410, "  Err send File  ");
    }

    var options = {
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    };

    if (filePath !== null && filePath !== undefined) {
      res.sendFile(filePath, options, function (error) {
        if (error) {
          console.error(error);
          return handleResponse(req, res, 410, "  Err send File  ");
        }
      });
    } else {
      console.error(" Error preview Image ");
      return handleResponse(req, res, 410, "  Err send File  ");
    }
  } catch (error) {
    console.error(error);
    return handleResponse(req, res, 410, "  Err send File  ");
  }
}

module.exports = {
  UpdateGroupPicture,
  UpdateProfilePicture,
  GetProfilePicture,
  UploadNewStoredFile,
  GetDocumentContent,
  DownLoadFile,
  GetPicturePreview,
  SaveCustomTextFile,
};
