const users = [];

const addUserInRoom = ({ id, userID, roomID }) => {
  userID = userID.trim().toLowerCase();
  roomID = roomID.trim().toLowerCase();

  if (userID === "" || userID === undefined) {
    return { error: "Invalid userID" };
  }

  if (roomID === "" || roomID === undefined) {
    return { error: "Invalid roomID" };
  }

  const existingUser = users.find(
    (user) => user.roomID === roomID && user.userID === userID
  );

  if (existingUser) {
    return { error: "UserID is taken" };
  }
  const user = { id, userID, roomID };

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
      console.log("Remove " + users[i].userID + " from " + users[i].roomID);
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
