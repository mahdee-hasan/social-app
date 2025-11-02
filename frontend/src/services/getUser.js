import api from "@/axios";

const getUser = async () => {
  try {
    const res = await api.get("/api/user");
    return { user: res.data, error: null };
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
    throw new Error(error.message);
  }
};
export default getUser;
