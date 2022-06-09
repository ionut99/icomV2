const { roomIsFull } = require("../controllers/Room");

const users = [];


const getNumberOfUsersInRoom = (roomId, type) => {
  var users_number = 0;
  for (let i = 0; i < users.length; i++) {
    if (users[i].roomId === roomId && users[i].type === type) {
      users_number = users_number + 1;
    }
  }

  return users_number;
};

const addUserInRoom = async ({ id, userId, roomId, type }) => {
  //
  if (userId === "" || userId === undefined) {
    return { error: "Invalid userId" };
  }

  if (roomId === "" || roomId === undefined) {
    return { error: "Invalid roomId" };
  }

  switch (type) {
    case "chat":
      const chatUsers = getNumberOfUsersInRoom(roomId, type);
      const isFull = await roomIsFull(roomId, userId, chatUsers);

      if (isFull) {
        return { error: "Room is Full" };
      }
      break;
    case "edit":
      // code block
      break;
    case "video":
      const videoUsers = getNumberOfUsersInRoom(roomId, type);
      if (videoUsers > 5) {
        return { error: "Room is Full" };
      }
      break;
    default:
      return { error: "Invalid room type" };
  }

  const existingUser = users.find(
    (user) =>
      user.roomId === roomId && user.userId === userId && user.type === type
  );

  if (existingUser) {
    return { error: "userId taken, user is already in room" };
  }

  const user = { id, userId, roomId, type };
  users.push(user);

  //
  const onU = getNumberOfUsersInRoom(roomId, type);
  console.log(
    "new " +
      type +
      " join user: " +
      userId.substring(userId.length - 5) +
      " // socket: " +
      id +
      " -> " +
      roomId.substring(roomId.length - 5) +
      " " +
      "users on: " +
      onU
  );
  //

  return { user };
};

// delete from list when disconnect
const deleteUser = (id) => {
  var removed = false;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      console.log(
        "Disconnect " +
          users[i].userId.substring(users[i].userId.length - 6) +
          " from " +
          users[i].roomId.substring(users[i].roomId.length - 6)
      );
      users.splice(i, 1);
      i--;
      removed = true;
      //
    }
  }

  return removed;
};

// get a user by socket id
const getUser = (id) => users.find((user) => user.id === id);

// get users, except the on who enter
const getUsersInRoom = (roomId, id, type) =>
  users.filter(
    (user) => user.roomId === roomId && user.type === type && user.id !== id
  );

module.exports = {
  addUserInRoom,
  getUser,
  getUsersInRoom,
  deleteUser,
};
