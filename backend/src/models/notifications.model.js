import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    author: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "people",
      required: true,
    },
    pic: {
      type: String,
    },
    description: {
      type: String,
    },
    link: {
      type: String,
      required: true,
    },
    isSeen: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "people",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
const Notification = mongoose.model("notification", notificationSchema);

export default Notification;
