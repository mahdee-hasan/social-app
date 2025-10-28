import { useUserStore } from "@/app/store";

const userId = useUserStore.getState().userObjectId;
const getOpponents = (value) => {
  const opponent =
    value?.participants[0]._id === userId
      ? value?.participants[1]
      : value?.participants[0];
  return opponent;
};
export default getOpponents;
