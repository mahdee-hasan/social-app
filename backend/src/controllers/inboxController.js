const escapeRegExp = require("../utils/escapeRegexp");
const people = require("../models/people");
const conversation = require("../models/conversation");
const message = require("../models/message");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinaryConfig");
const deleteUsersConversation = require("../utils/deleteAttachment");
const mongoose = require("mongoose");
//get inbox
const getInbox = async (req, res, next) => {
  try {
    const conversations = await conversation
      .find({
        participants: req.params.id,
        isDeleted: { $nin: [req.params.id] },
      })
      .sort("-lastMessage.time")
      .populate("participants");

    if (!conversations.length) {
      res.status(404).json({ error: "user do not has any conversation" });
    } else {
      res.status(200).json({ conversations });
    }
    // let activeIds = [];
    // const activePeople = await people.find({ active: true }, "_id");
    // activePeople.map((people) => activeIds.push(people.id.toString()));
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
const getOneConversation = async (req, res, next) => {
  try {
    const selectedConversation = await conversation
      .findById(req.params.id)
      .populate("participants");
    if (!conversation) {
      res.status(404).json({ error: "conversation not found" });
    } else {
      res.status(200).json({ conversation: selectedConversation });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const searchUser = async (req, res, next) => {
  try {
    const value = req.body.user.replace("+88", "");
    const name_regexp = new RegExp(escapeRegExp(value), "i");
    const mobile_regexp = new RegExp("^" + escapeRegExp("+88" + value));
    const email_regexp = new RegExp("^" + escapeRegExp(value) + "$", "i");

    let user = [];
    if (req.query.from === "share") {
      user = await people.find({
        $or: [
          { name: name_regexp },
          { email: email_regexp },
          { mobile: mobile_regexp },
        ],
        friends: { $in: [req.user.userId] },
      });
      res.status(200).json(user);
    } else {
      user = await people.find(
        {
          $or: [
            { name: name_regexp },
            { email: email_regexp },
            { mobile: mobile_regexp },
          ],
        },
        "name avatar role"
      );
      res.status(200).json(user);
    }
    if (!user.length) {
      res.status(404).json({ error: "no one found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
};

const addConversation = async (req, res) => {
  try {
    // current logged-in user
    const user = await people.findOne({ uid: req.user.uid }, "_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // find all conversations containing both participants
    const matches = await conversation.find({
      participants: {
        $all: [new mongoose.Types.ObjectId(req.body.id), user._id],
      },
    });

    // filter only private (2-person) chats
    const privateCon = matches.find((c) => c.participants.length === 2);

    if (!privateCon) {
      // create a new private conversation if none found
      const newCon = new conversation({
        participants: [user._id, req.body.id],
      });

      const result = await newCon.save();

      return res.status(201).json({
        message: "New conversation created successfully",
        con: result,
        id: result._id,
      });
    } else {
      // already exists (either group or private)
      return res.status(200).json({
        message: "Conversation already exists",
        con: privateCon,
        id: privateCon._id,
      });
    }
  } catch (error) {
    console.error("Error adding conversation:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const deleteConversation = async (req, res, next) => {
  try {
    // Delete conversation
    const result = await conversation.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (result.isDeleted.length >= 1) {
      const resOf = await deleteUsersConversation(req.params.id);
      if (!resOf.success) {
        throw new Error(resOf.message);
      }
      await conversation.findByIdAndDelete(req.params.id);
    } else {
      const selectedMessages = await message.find({
        conversation_id: result._id,
      });
      const messageForDelete = selectedMessages.filter(
        (m) => m.deletedFor.length > 0
      );
      const messageForUpdate = selectedMessages.filter(
        (m) => m.deletedFor.length < 1
      );
      if (messageForDelete.length) {
        await Promise.all(
          messageForDelete.map((m) => message.findByIdAndDelete(m._id))
        );
      }
      if (messageForUpdate.length) {
        await Promise.all(
          messageForUpdate.map((m) =>
            message.findByIdAndUpdate(m._id, {
              $addToSet: { deletedFor: req.user.userId },
            })
          )
        );
      }
      await conversation.findByIdAndUpdate(result._id, {
        $addToSet: { isDeleted: req.user.userId },
      });
    }

    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "error occurred" + error.message });
    console.log("catch", error.message);
  }
};

const sendMessage = async (req, res, next) => {
  if (!req.body.text && !req.uploadedFiles) {
    res.status(400).json({ message: "message cant be null" });
  }
  try {
    const selectedConversation = await conversation.findById(
      req.body.conversation_id
    );

    if (!selectedConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const sender = await people.findOne(
      { _id: req.user.userId },
      "name avatar"
    );

    const participants = await people.find(
      {
        _id: {
          $in: [
            selectedConversation.participant_1.id,
            selectedConversation.participant_2.id,
          ],
        },
      },
      "name avatar"
    );

    const receiver = participants.find((p) => !p._id.equals(sender._id));

    // Check if receiver is participant_1 or participant_2 and update accordingly
    let updateField;
    if (receiver._id.equals(selectedConversation.participant_1.id)) {
      updateField = "participant_1.unseenCount";
    } else if (receiver._id.equals(selectedConversation.participant_2.id)) {
      updateField = "participant_2.unseenCount";
    }
    let updatedCon = {};
    if (updateField) {
      updatedCon = await conversation.findByIdAndUpdate(
        req.body.conversation_id,
        {
          $inc: { [updateField]: 1 },
        },
        { new: true }
      );
    }
    const newMessage = new message({
      text: req.body.text,
      attachment: req.uploadedFiles,
      sender: {
        id: sender._id,
        name: sender.name,
        avatar: sender.avatar,
      },
      receiver: {
        id: receiver._id,
        name: receiver.name,
        avatar: receiver.avatar,
      },
      conversation_id: req.body.conversation_id,
    });

    const data = await newMessage.save();

    await conversation.findByIdAndUpdate(req.body.conversation_id, {
      lastMessage: {
        id: data._id,
        text: data.text,
        time: data.createdAt,
        sender: data.sender.id,
      },
      isDeleted: [],
    });
    global.io.emit("new_message", { data, updatedCon });

    res.status(200).json({ message: "delivered" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "not sent" });
  }
};

const getMessage = async (req, res, next) => {
  try {
    const selectedConversation = await conversation.findById(
      req.params.conversation_id,
      "participant_1 participant_2"
    );
    let updateField;
    if (selectedConversation.participant_1.id.equals(req.user.userId)) {
      updateField = "participant_1.unseenCount";
    } else if (selectedConversation.participant_2.id.equals(req.user.userId)) {
      updateField = "participant_2.unseenCount";
    }
    let updatedCon = {};
    if (updateField) {
      updatedCon = await conversation.findByIdAndUpdate(
        req.params.conversation_id,
        {
          $set: { [updateField]: 0 },
        },
        { new: true }
      );
    }
    const messages = await message.find({
      conversation_id: req.params.conversation_id,
      deletedFor: { $nin: [req.user.userId] },
    });

    global.io.emit("get_message", { message, updatedCon });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
};
const getLastMessage = async (req, res, next) => {
  try {
    const messages = await message.find({
      conversation_id: req.query.conversation_id,
      $or: [
        { "sender.id": req.query.person },
        { "receiver.id": req.query.person },
      ],
      deletedFor: { $nin: [req.user.username] },
    });
    const last_message = messages[messages.length - 1];
    res.status(200).json({
      sender: last_message.sender.name,
      lastMessage: last_message.text,
      seen: last_message.seen,
    });
  } catch (error) {
    res.status(500).json({ lastMessage: "no messages", error: error.message });
  }
};
const deleteForEveryone = async (req, res, next) => {
  try {
    const foundMessage = await message.findById(req.params.id);
    const oldMessage = foundMessage.text;
    const result = await message.updateOne(
      { _id: req.params.id },
      {
        $addToSet: {
          old_text: oldMessage,
        },
        $set: {
          text: req.user.username + " unsent the message",
          editable: false,
        },
      }
    );

    const selectedConversation = await conversation.findById(
      foundMessage.conversation_id,
      "lastMessage"
    );

    if (foundMessage._id.equals(selectedConversation.lastMessage.id)) {
      await conversation.findByIdAndUpdate(foundMessage.conversation_id, {
        $set: { "lastMessage.text": "deleted this message" },
      });
    }
    global.io.emit("deleted_message", result);
    res
      .status(200)
      .json({ success: true, message: "message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "error deleting message" });
  }
};
const deleteForME = async (req, res, next) => {
  try {
    const selectedMessage = await message.findById(req.params.id);
    let result = {};

    if (selectedMessage.deletedFor.length >= 1) {
      result = await message.deleteOne({ _id: req.params.id });
    } else {
      result = await message.updateOne(
        { _id: req.params.id },
        { $addToSet: { deletedFor: req.user.userId } }
      );
    }

    global.io.emit("deleted_message", result);
    res
      .status(200)
      .json({ success: true, message: "message deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "error deleting message" });
  }
};
const updateMessage = async (req, res, next) => {
  try {
    const foundMessage = await message.findById(req.params.id);
    const oldMessage = foundMessage.text;

    const result = await message.updateOne(
      { _id: req.params.id },
      {
        $set: { text: req.body.text },
        $addToSet: { old_text: oldMessage },
      }
    );

    global.io.emit("deleted_message", result);

    res
      .status(200)
      .json({ success: true, message: "Message updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Error updating message" });
  }
};
const openChat = async (req, res, next) => {
  try {
    const con = await conversation.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { isOpen: req.user.username },
      },
      { new: true }
    );

    res.status(200).json(con);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};
const closeChat = async (req, res, next) => {
  try {
    const con = await conversation.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { isOpen: req.user.username },
      },
      { new: true }
    );
    res.status(200).json(con);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};
const closeAllChat = async (req, res, next) => {
  try {
    const con = await conversation.updateMany(
      { isOpen: req.user.username },
      { $pull: { isOpen: req.user.username } }
    );

    res.status(200).json({ success: true, message: "successfully closed" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

const typingTimers = {};

const startTyping = async (req, res, next) => {
  try {
    const { id: conversationId } = req.params;
    const userId = req.user.userId;
    const key = `${conversationId}_${userId}`;
    global.io.emit("typing-started", {
      conversationId,
      userId,
    });

    if (typingTimers[key]) {
      clearTimeout(typingTimers[key]);
    }

    typingTimers[key] = setTimeout(() => {
      global.io.emit("typing-stopped", {
        conversationId,
        userId,
      });

      delete typingTimers[key];
    }, 1000);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

module.exports = {
  getInbox,
  searchUser,
  addConversation,
  deleteConversation,
  sendMessage,
  getMessage,
  getLastMessage,
  deleteForEveryone,
  deleteForME,
  updateMessage,
  openChat,
  closeChat,
  closeAllChat,
  startTyping,
  getOneConversation,
};
