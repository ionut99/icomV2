const { GetUserByID } = require("../services/Auth");

// complete messages list with sender name
async function CompleteMessageList(messageList) {
  try {
    var newMessageList = [];
    for (let i = 0; i < messageList.length; i++) {
      const userDetails = await GetUserByID(messageList[i].senderId)
        .then(function (result) {
          if (result.length > 0) return result[0];
          else return undefined;
        })
        .catch((err) => {
          throw err;
        });

      if (userDetails !== undefined)
        newMessageList.push({
          ID_message: messageList[i].ID_message,
          roomId: messageList[i].roomId,
          senderId: messageList[i].senderId,
          body: messageList[i].body,
          type: messageList[i].type,
          fileId: messageList[i].fileId,
          createdTime: messageList[i].createdTime,
          senderName: userDetails.surname + " " + userDetails.name,
        });
    }

    return newMessageList.sort(function (a, b) {
      return new Date(a.createdTime) - new Date(b.createdTime);
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}

module.exports = {
  CompleteMessageList,
};
