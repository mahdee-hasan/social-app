import mongoose from "mongoose";
const messageSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
    attachment: {
      type: Array,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "people",
      required: true,
    },
    deletedFor: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "people",
      required: true,
    },

    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
      required: true,
    },
    status: {
      type: String,
      default: "sent",
    },
    seen: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "people",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("message", messageSchema);

export default Message;
