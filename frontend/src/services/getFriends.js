import api from "@/axios";

const getFriends = async (uid) => {
  try {
    const res = await api.get(`/api/user/friends/${uid}`);
    if (res.status >= 200 && res.status < 300) {
      return { success: true, friends: res.data.friends, error: null };
    } else {
      throw new Error(res.data.error || "error getting friend");
    }
  } catch (error) {
    return { success: false, friends: [], error: error.message };
  }
};

export default getFriends;
