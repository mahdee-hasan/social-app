const getOpponents = (value, userId) => {
  const opponent =
    value?.participants[0]._id === userId
      ? value?.participants[1]
      : value?.participants[0];
  return opponent;
};
export default getOpponents;
