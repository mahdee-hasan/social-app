const mongoose = require("mongoose");

const peopleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    uid: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    public_id: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: false,
    },
    dob: { type: Date },
    location: { type: String },
    website: { type: String },
    cover: { type: Array },
    posts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "post",
    },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "people",
    },
    friend_request: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "people",
    },
    friend_requested: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "people",
    },
    bio: {
      type: String,
    },
    updatingTime: {
      name: Date,
      password: Date,
      dob: Date,
      bio: Date,
      location: Date,
    },
  },
  {
    timestamps: true,
  }
);
const people = mongoose.model("people", peopleSchema);

module.exports = people;
