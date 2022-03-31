var fs = require("fs");

async function WriteFileToDisc(folder, fileName, content) {
  var errorCode = "SUCCESS";
  fs.mkdir(folder, { recursive: true }, function (err) {
    if (err) {
      errorCode = err.message;
      return err.message;
    }
  });
  fs.writeFile(folder + fileName, content, function (err) {
    if (err) {
      errorCode = err.message;
      return err.code;
    }
  });
  return errorCode;
}
module.exports = {
  WriteFileToDisc,
};
