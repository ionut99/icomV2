var fs = require("fs");

async function WriteFileToDisc(folder, fileName, content) {
  fs.mkdir(folder, { recursive: true }, function (err) {
    if (err) {
      return "FAILED";
    }
  });
  fs.writeFile(folder + fileName, content, function (err) {
    if (err) {
      return "FAILED";
    }
  });
  return "SUCCESS";
}
module.exports = {
  WriteFileToDisc,
};
