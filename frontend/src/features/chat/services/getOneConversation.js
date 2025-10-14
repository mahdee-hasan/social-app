import api from "@/axios";

const getOneConversation = async (id) => {
  try {
    const res = await api.get(`/api/inbox/conversation/${id}`);
    if (res.status !== 200) {
      return { success: false, conversation: [], error: res.data.error };
    } else {
      return {
        success: true,
        conversation: res.data.conversation,
        error: null,
      };
    }
  } catch (error) {
    return { success: false, conversation: [], error: error.message };
  }
};

export default getOneConversation;
