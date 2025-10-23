const mongoose = require("mongoose");

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
  },
  {
    timestamps: true,
  }
);
const message = mongoose.model("message", messageSchema);

module.exports = message;
