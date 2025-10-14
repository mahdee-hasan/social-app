const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "people",
      required: true,
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
    isOpen: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "people",
      default: [],
    },
    typing: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "people",
      default: [],
    },
    lastMessage: {
      id: mongoose.Schema.Types.ObjectId,
      text: { type: String, default: "no message" },
      time: { type: Date, default: Date.now },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "people",
      },
    },
    isDeleted: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const conversation = mongoose.model("conversation", conversationSchema);

module.exports = conversation;
