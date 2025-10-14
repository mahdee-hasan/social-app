import api from "@/axios";

const getAllConversation = async () => {
  try {
    const res = await api.get(`/api/inbox/conversations`);
    if (res.status !== 200) {
      return { success: false, error: res.data.error, conversations: [] };
    } else {
      return { success: true, error: null, conversations: res.data };
    }
  } catch (error) {
    return { success: false, error: error.message, conversations: [] };
  }
};

export default getAllConversation;
