const date = require("date-and-time");
const { handleResponse } = require("../helpers/utils");
const { InsertNewMessageData } = require("../services/User");

// insert new message in a room
async function InsertNewMessage(message) {
  try {
    // TO DO: - verify if user is int that room, and add midleware
    var result = await InsertNewMessageData(
      message.ID_message,
      message.senderID,
      message.roomID,
      message.messageBody,
      message.type,
      message.fileId,
      message.createdTime
    );
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
