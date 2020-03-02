let rooms = [];

const createUser = user => {
  rooms.push(user);
};

const deleteById = id => {
  rooms = rooms.filter(room => room.userId !== id);
};

const getByRoomName = roomName => {
  const users = rooms.filter(r => r.roomName === roomName);
  return users;
};

const getAll = () => {
  return rooms;
}

module.exports = {
  getAll,
  createUser,
  deleteById,
  getByRoomName
}