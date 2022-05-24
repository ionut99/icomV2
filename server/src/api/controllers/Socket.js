const users = [];

const addUserInRoom = ({ id, userID, roomID }) => {
  userID = userID.trim().toLowerCase();
  roomID = roomID.trim().toLowerCase();

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
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (roomID, id) =>
  users.filter((user) => user.roomID === roomID && user.id !== id);

module.exports = { addUserInRoom, removeUser, getUser, getUsersInRoom };
