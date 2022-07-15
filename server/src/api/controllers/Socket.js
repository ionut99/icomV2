const { roomIsFull } = require("../controllers/Room");

//
const colors = [
  "blue",
  "green",
  "brown",
  "chartreuse",
  "blueviolet",
  "burlywood",
  "red",
  "chocolate",
  "coral",
  "crimson",
  "cyan",
  "darkgreen",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DeepPink",
  "DeepSkyBlue",
  "FireBrick",
  "GoldenRod",
  "GreenYellow",
];

const users = [];

const getNumberOfUsersInRoom = (roomId, type) => {
  //
  return users.filter(function (element) {
    return element.type === type && element.roomId === roomId;
  }).length;
  //
};

const addUserInRoom = async ({ id, userId, roomId, type }) => {
  //
  if (userId === "" || userId === undefined) {
    return { error: "Invalid userId" };
  }

  if (roomId === "" || roomId === undefined) {
    return { error: "Invalid roomId" };
  }

  // verify if user already exist
  const existingUser = users.find(
    (user) =>
      user.roomId === roomId && user.userId === userId && user.type === type
  );

  if (existingUser) {
    return { error: "userId taken, user is already in room" };
  }

  const currentUsersNumber = getNumberOfUsersInRoom(roomId, type);

  switch (type) {
    case "chat":
      const isFull = await roomIsFull(roomId, userId, currentUsersNumber);

      if (isFull) {
        return { error: "Room is Full" };
      }
      break;
    case "edit":
      // code block
      break;
    case "video":
      if (currentUsersNumber > 5) {
        return { error: "Room is Full" };
      }
      break;
    default:
      return { error: "Invalid room type" };
  }

  // in special for user in edit room
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
  

  return { user };
};

// delete from list when disconnect
const deleteUser = (id) => {
  var removed = false;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      // console.log(
      //   "Disconnect " +
      //     users[i].userId.substring(users[i].userId.length - 6) +
      //     " from " +
      //     users[i].roomId.substring(users[i].roomId.length - 6)
      // );
      users.splice(i, 1);
      i--;
      removed = true;
      //
    }
  }

  return removed;
};

// get a user by socket id
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

// get users, except the on who enter
const getUsersInRoom = (roomId, id, type) =>
  users.filter(
    (user) => user.roomId === roomId && user.type === type && user.id !== id
  );

const getUserColor = (roomId, userId, type) => {
  const index = users.findIndex(
    (user) =>
      user.roomId === roomId && user.type === type && user.userId === userId
  );
  return colors[index % colors.length];
};

module.exports = {
  addUserInRoom,
  getUser,
  getUsersInRoom,
  deleteUser,
  getUserColor,
};
