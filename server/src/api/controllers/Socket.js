const { roomIsFull } = require("../controllers/Room");

const users = [];

const getNumberOfUsersInRoom = (roomID) => {
  var users_number = 0;
  for (let i = 0; i < users.length; i++) {
    if (users[i].roomID === roomID) {
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

  if (type === undefined) {
    return { error: "Invalid room type" };
  }

  const existingUser = users.find(
    (user) =>
      user.roomID === roomID && user.userID === userID && user.type === type
  );

  if (existingUser) {
    return { error: "UserID taken, user is already in room" };
  }

  //const users_number = getNumberOfUsersInRoom(roomID);
  //const isFull = await roomIsFull(roomID, userID, users_number);

  // console.log("Capacitate:");
  // console.log(isFull);

  const user = { id, userID, roomID, type };

  users.push(user);
  return { user };
};

const removeUser = (id) => {
  // const index = users.findIndex((user) => user.id === id);
  // if (index !== -1) {
  //   return users.splice(index, 1)[0];
  // }

  var removed = false;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
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

const getUsersInRoom = (roomID, id) =>
  users.filter((user) => user.roomID === roomID && user.id !== id);

module.exports = { addUserInRoom, removeUser, getUser, getUsersInRoom };
