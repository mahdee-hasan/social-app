import api from "@/axios";

const getOtherUser = async (uid) => {
  try {
    const res = await api.get(`/api/user/get-user/${uid}`);
    return { user: res.data, error: null, success: true };
  } catch (err) {
    // Axios error may contain response info
    let error;
    if (err.response) {
      error = err.response.data?.message || "Something went wrong";
    } else if (err.request) {
      error = "No response from server";
    } else {
      error = err.message;
    }
    return { success: false, error: error };
  }
};

export default getOtherUser;
