const { GetUserByID } = require("../services/Auth");

// complete messages list with sender name
async function CompleteMessageList(messageList) {
  try {
    var newMessageList = [];
    for (let i = 0; i < messageList.length; i++) {
      const userDetails = await GetUserByID(messageList[i].senderID)
        .then(function (result) {
          return result;
        })
        .catch((err) =>
          setImmediate(() => {
            throw err;
          })
        );

      newMessageList.push({
        messageID: messageList[i].ID_message,
        RoomID: messageList[i].RoomID,
        senderID: messageList[i].senderID,
        Body: messageList[i].Body,
        createdTime: messageList[i].createdTime,
        UserName: userDetails[0].Surname + " " + userDetails[0].Name,
      });
    }

    return newMessageList.sort(function (a, b) {
      return new Date(a.createdTime) - new Date(b.createdTime);
    });
  } catch (err) {
    return null;
  }
}

module.exports = {
  CompleteMessageList,
};
