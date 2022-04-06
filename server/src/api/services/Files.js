var fs = require("fs");

function ReadFile(currentPath) {
  return new Promise((resolve, reject) => {
    fs.access(currentPath, (err) => {
      if (err) {
        return resolve("FAILED");
      }
      // Reading the file
      fs.readFile(currentPath, {encoding: 'base64'}, function (err, contentFile) {
        if (err) {
          return resolve("FAILED");
        }
        // Serving the image
        return resolve(contentFile);
      });
    });
  });
}

module.exports = {
  ReadFile,
};
