const { roomIsFull } = require("../controllers/Room");

const users = [];

var userColors = [
  { color: "red", free: 0 },
  { color: "blue", free: 0 },
  { color: "green", free: 0 },
  { color: "blueviolet", free: 0 },
  { color: "brown", free: 0 },
  { color: "chartreuse", free: 0 },
  { color: "burlywood", free: 0 },
  { color: "chocolate", free: 0 },
  { color: "coral", free: 0 },
  { color: "crimson", free: 0 },
  { color: "cyan", free: 0 },
  { color: "darkgreen", free: 0 },
  { color: "DarkKhaki", free: 0 },
  { color: "DarkMagenta", free: 0 },
  { color: "DarkOliveGreen", free: 0 },
  { color: "DarkOrange", free: 0 },
  { color: "DarkOrchid", free: 0 },
  { color: "DarkRed", free: 0 },
  { color: "DarkSalmon", free: 0 },
  { color: "DeepPink", free: 0 },
  { color: "DeepSkyBlue", free: 0 },
  { color: "FireBrick", free: 0 },
  { color: "GoldenRod", free: 0 },
  { color: "GreenYellow", free: 0 },
];

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

  // assign color to use if he enter in a edit room
  var color = undefined;
  if (type === "edit") {
    color = getColor(id);
  }

  const user = { id, userId, roomId, type, color: color };
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
const getUsersInRoom = (roomId, id, type) =>
  users.filter(
    (user) => user.roomId === roomId && user.type === type && user.id !== id
  );

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
};
