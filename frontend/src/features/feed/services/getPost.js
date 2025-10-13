import api from "@/axios";

const getPost = async () => {
  try {
    const res = await api.get("/api/feeds");
    if (res.status !== 200) {
      throw new Error(res.data.error || "error getting post");
    }
    return { success: true, error: null, post: res.data };
  } catch (error) {
    return { success: false, error: error.message, post: [] };
  }
};

export default getPost;
