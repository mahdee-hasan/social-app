import api from "@/axios";

const getMessage = async (conId) => {
  try {
    const res = await api.get(`/api/inbox/message/${conId}`);
    if (res.status === 200) {
      return { success: true, message: res.data, error: null };
    } else {
      return { success: false, message: null, error: res.data.error };
    }
  } catch (error) {
    return { success: false, message: null, error: error.message };
  }
};

export default getMessage;
