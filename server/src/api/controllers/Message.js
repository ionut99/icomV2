const date = require("date-and-time");
const { handleResponse } = require("../helpers/auth_utils");
const { InsertNewMessageData } = require("../services/User");

// insert new message in a room
async function InsertNewMessage(message) {
  try {
    // TO DO: - verify if user is int that room, and add midleware
    const result = await InsertNewMessageData(
      message.ID_message,
      message.senderId,
      message.roomId,
      message.body,
      message.type,
      message.fileId,
      message.createdTime
    )
      .then(function (result) {
        return result;
      })
      .catch((err) => {
        throw err;
      });
    // console.log("Rezultat inserare mesaj baza de date:");
    // console.log(result.affectedRows);
    return result.affectedRows;
  } catch (error) {
    console.error(error);
    return null;
  }
}
module.exports = {
  InsertNewMessage,
};
