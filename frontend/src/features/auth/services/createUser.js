import api from "@/axios";

const createUser = async (userDetails) => {
  try {
    const res = await api.post("/api/users/create", userDetails);

    if (res.status >= 200 && res.status < 300) {
      return { success: true, message: "user created successfully" };
    }
  } catch (error) {
    console.log(error.message);
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "error creating user",
      };
    } else {
      return { success: false, message: error.message || "network error" };
    }
  }
};

export default createUser;
