import api from "@/axios";

const createPost = async (formData) => {
  let error = {};
  try {
    const res = await api.post("/api/feeds", formData);

    if (res.status === 201) {
      return { success: true, error: null, data: res.data };
    } else if (res.status === 400) {
      error = res.data.errors;
      return { success: false, error };
    } else {
      if (res.data.errors.attachment) {
        error = res.data.errors;
      }
      error.general = res.data.error || "Unexpected error";
      return { success: false, error };
    }
  } catch (err) {
    error.general =
      error.response?.data?.error || error.message || "Something went wrong";
    return {
      success: false,
      error,
    };
  }
};

export default createPost;
