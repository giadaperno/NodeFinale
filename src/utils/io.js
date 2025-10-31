let io = null;

export const setIO = (serverIO) => {
  io = serverIO;
};

export const getIO = () => io;
