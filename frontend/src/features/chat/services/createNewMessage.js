import api from "@/axios";

const createNewMessage = async (bodyObject) => {
  try {
    const res = await api.post("/api/inbox/message", bodyObject, {
      headers: {
        "Content-Type": "multipart-formdata",
      },
    });
    if (res.status === 201) {
      return { success: true, newMessage: res.data.message, error: null };
    } else {
      return { success: false, newMessage: null, error: res.data.error };
    }
  } catch (error) {
    return { success: false, newMessage: null, error: error.message };
  }
};

export default createNewMessage;
