const { roomIsFull } = require("../controllers/Room");

const users = [];

var userColors = [
  { color: "red", free: 0 },
  { color: "blue", free: 0 },
  { color: "green", free: 0 },
  { color: "blueviolet", free: 0 },
  { color: "brown", free: 0 },
  { color: "chartreuse", free: 0 },
];

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
      const chatUsers = getNumberOfUsersInRoom(roomID, type);
      const isFull = await roomIsFull(roomID, userID, chatUsers);

      if (isFull) {
        return { error: "Room is Full" };
      }
      break;
    case "edit":
      // code block
      break;
    case "video":
      const videoUsers = getNumberOfUsersInRoom(roomID, type);
      if (videoUsers > 5) {
        return { error: "Room is Full" };
      }
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

  // assign color to use if he enter in a edit room
  var color = undefined;
  if (type === "edit") {
    color = getColor(id);
  }

  const user = { id, userID, roomID, type, color: color };
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

// delete from list when disconnect
const deleteUser = (id) => {
  var removed = false;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      console.log(
        "Disconnect " +
          users[i].userID.substring(users[i].userID.length - 6) +
          " from " +
          users[i].roomID.substring(users[i].roomID.length - 6)
      );
      users.splice(i, 1);
      i--;
      removed = true;
      //
      const freeColor = (element) => element.free === id;
      const index = userColors.findIndex(freeColor);
      if (index === -1) continue;
      userColors[index].free = 0;
    }
  }

  return removed;
};

// get a user by socket id
const getUser = (id) => users.find((user) => user.id === id);

// get users, except the on who enter
const getUsersInRoom = (roomID, id, type) =>
  users.filter(
    (user) => user.roomID === roomID && user.type === type && user.id !== id
  );

// get all users
const getAllUsers = (roomID, type) =>
  users.filter((user) => user.roomID === roomID && user.type === type);

// asign a color
const getColor = (id) => {
  const catchColor = (element) => element.free === 0;
  const index = userColors.findIndex(catchColor);

  if (index !== -1) {
    userColors[index].free = id;
    return userColors[index].color;
  }
};

module.exports = {
  addUserInRoom,
  getUser,
  getUsersInRoom,
  deleteUser,
  getAllUsers,
};
