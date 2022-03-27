const { handleResponse } = require("../helpers/utils");


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

module.exports = {
  GetDocument,
};
