import api from "@/axios";

const createNewConversation = async (id) => {
  try {
    const res = await api.post("/api/inbox/conversation", { id });
  } catch (error) {}
};

export default createNewConversation;
