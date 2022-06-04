const { roomIsFull } = require("../controllers/Room");

const users = [];

const getNumberOfUsersInRoom = (roomID, type) => {
  var users_number = 0;
  for (let i = 0; i < users.length; i++) {
    if (users[i].roomID === roomID && users[i].type === type) {
      users_number = users_number + 1;
    }
  }

  return users_number;
};

const addUserInRoom = async ({ id, userID, roomID, type }) => {
  // userID = userID.trim().toLowerCase();
  // roomID = roomID.trim().toLowerCase();

  if (userID === "" || userID === undefined) {
    return { error: "Invalid userID" };
  }

  if (roomID === "" || roomID === undefined) {
    return { error: "Invalid roomID" };
  }

  switch (type) {
    case "chat":
      const users_number = getNumberOfUsersInRoom(roomID, type);
      const isFull = await roomIsFull(roomID, userID, users_number);

      if (isFull) {
        return { error: "Room is Full" };
      }
      break;
    case "edit":
      // code block
      break;
    case "video":
      break;
    default:
      return { error: "Invalid room type" };
  }

  const existingUser = users.find(
    (user) =>
      user.roomID === roomID && user.userID === userID && user.type === type
  );

  if (existingUser) {
    return { error: "UserID taken, user is already in room" };
  }

  const user = { id, userID, roomID, type };

  users.push(user);

  //
  const onU = getNumberOfUsersInRoom(roomID, type);
  console.log(
    "new " +
      type +
      " join user: " +
      userID.substring(userID.length - 5) +
      " // socket: " +
      id +
      " -> " +
      roomID.substring(roomID.length - 5) +
      " " +
      "users on: " +
      onU
  );
  //

  return { user };
};

const deleteUser = (id) => {
  var removed = false;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      console.log(
        "Delete " +
          users[i].userID.substring(users[i].userID.length - 6) +
          " from " +
          users[i].roomID.substring(users[i].roomID.length - 6)
      );
      users.splice(i, 1);
      i--;
      removed = true;
    }
  }

  return removed;
};

const removeUserFromList = (id, type) => {
  var removed = false;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id && users[i].type === type) {
      console.log(
        "Remove " +
          users[i].userID.substring(users[i].userID.length - 6) +
          " from " +
          users[i].roomID.substring(users[i].roomID.length - 6)
      );
      users.splice(i, 1);
      i--;
      removed = true;
    }
  }

  return removed;
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (roomID, id, type) =>
  users.filter(
    (user) => user.roomID === roomID && user.type === type && user.id !== id
  );

module.exports = {
  addUserInRoom,
  removeUserFromList,
  getUser,
  getUsersInRoom,
  deleteUser,
};
