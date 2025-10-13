import useAuthStore from "@/stores/useAuthStore";

const { bearerToken } = useAuthStore.getState();
const doCommentLike = async (id) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/feeds/commentLikes?commentId=${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error("error liking the comment");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default doCommentLike;
