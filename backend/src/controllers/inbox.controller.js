import escapeRegExp from "../utils/escapeRegexp.js";
import people from "../models/people.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinaryConfig.js";
import deleteUsersConversation from "../utils/deleteAttachment.js";
import mongoose from "mongoose";
//get inbox
const getInbox = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.id,
      isDeleted: { $nin: [req.params.id] },
    })
      .sort("-lastMessage.time")
      .populate("participants");

    if (!conversations.length) {
      res.status(404).json({ error: "user do not has any Conversation" });
    } else {
      res.status(200).json({ conversations });
    }
    // let activeIds = [];
    // const activePeople = await people.find({ active: true }, "_id");
    // activePeople.map((people) => activeIds.push(people.id.toString()));
  } catch (error) {
    console.log(error.Message);
    res.status(500).json({ error: error.Message });
  }
};
const getOneConversation = async (req, res, next) => {
  try {
    const selectedConversation = await Conversation.findById(
      req.params.id
    ).populate("participants");
    if (!Conversation) {
      res.status(404).json({ error: "Conversation not found" });
    } else {
      res.status(200).json({ Conversation: selectedConversation });
    }
  } catch (error) {
    res.status(500).json({ error: error.Message });
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
    res.status(500).json({ error: error.Message });
    console.log(error.Message);
  }
};

const addConversation = async (req, res) => {
  try {
    // current logged-in user
    const user = await people.findOne({ uid: req.user.uid }, "_id");
    if (!user) {
      return res.status(404).json({ Message: "User not found" });
    }

    // find all conversations containing both participants
    const matches = await Conversation.find({
      participants: {
        $all: [new mongoose.Types.ObjectId(req.body.id), user._id],
      },
    });

    // filter only private (2-person) chats
    const privateCon = matches.find((c) => c.participants.length === 2);

    if (!privateCon) {
      // create a new private Conversation if none found
      const newCon = new Conversation({
        participants: [user._id, req.body.id],
      });

      const result = await newCon.save();

      return res.status(201).json({
        Message: "New Conversation created successfully",
        con: result,
        id: result._id,
      });
    } else {
      // already exists (either group or private)
      return res.status(200).json({
        Message: "Conversation already exists",
        con: privateCon,
        id: privateCon._id,
      });
    }
  } catch (error) {
    console.error("Error adding Conversation:", error.Message);
    return res.status(500).json({ error: error.Message });
  }
};

const deleteConversation = async (req, res, next) => {
  try {
    // Delete Conversation
    const result = await Conversation.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ Message: "Conversation not found" });
    }
    if (result.isDeleted.length >= 1) {
      const resOf = await deleteUsersConversation(req.params.id);
      if (!resOf.success) {
        throw new Error(resOf.Message);
      }
      await Conversation.findByIdAndDelete(req.params.id);
    } else {
      const selectedMessages = await Message.find({
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
          messageForDelete.map((m) => Message.findByIdAndDelete(m._id))
        );
      }
      if (messageForUpdate.length) {
        await Promise.all(
          messageForUpdate.map((m) =>
            Message.findByIdAndUpdate(m._id, {
              $addToSet: { deletedFor: req.user.userId },
            })
          )
        );
      }
      await Conversation.findByIdAndUpdate(result._id, {
        $addToSet: { isDeleted: req.user.userId },
      });
    }

    res.status(200).json({ Message: "deleted successfully" });
  } catch (error) {
    res.status(500).json({ Message: "error occurred" + error.Message });
    console.log("catch", error.Message);
  }
};

const sendMessage = async (req, res, next) => {
  if (!req.body.text && !req.uploadedFiles) {
    res.status(400).json({ Message: "Message cant be null" });
  }
  try {
    const selectedConversation = await Conversation.findById(
      req.body.conversation_id
    );

    if (!selectedConversation) {
      return res.status(404).json({ Message: "Conversation not found" });
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
      updatedCon = await Conversation.findByIdAndUpdate(
        req.body.conversation_id,
        {
          $inc: { [updateField]: 1 },
        },
        { new: true }
      );
    }
    const newMessage = new Message({
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

    await Conversation.findByIdAndUpdate(req.body.conversation_id, {
      lastMessage: {
        id: data._id,
        text: data.text,
        time: data.createdAt,
        sender: data.sender.id,
      },
      isDeleted: [],
    });
    global.io.emit("new_message", { data, updatedCon });

    res.status(200).json({ Message: "delivered" });
  } catch (error) {
    console.log(error.Message);
    res.status(500).json({ Message: "not sent" });
  }
};

const getMessage = async (req, res, next) => {
  try {
    const selectedConversation = await Conversation.findById(
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
      updatedCon = await Conversation.findByIdAndUpdate(
        req.params.conversation_id,
        {
          $set: { [updateField]: 0 },
        },
        { new: true }
      );
    }
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
      deletedFor: { $nin: [req.user.userId] },
    });

    global.io.emit("get_message", { Message, updatedCon });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error.Message);
    res.json({ error: error.Message });
  }
};
const getLastMessage = async (req, res, next) => {
  try {
    const messages = await Message.find({
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
    res.status(500).json({ lastMessage: "no messages", error: error.Message });
  }
};
const deleteForEveryone = async (req, res, next) => {
  try {
    const foundMessage = await Message.findById(req.params.id);
    const oldMessage = foundMessage.text;
    const result = await Message.updateOne(
      { _id: req.params.id },
      {
        $addToSet: {
          old_text: oldMessage,
        },
        $set: {
          text: req.user.username + " unsent the Message",
          editable: false,
        },
      }
    );

    const selectedConversation = await Conversation.findById(
      foundMessage.conversation_id,
      "lastMessage"
    );

    if (foundMessage._id.equals(selectedConversation.lastMessage.id)) {
      await Conversation.findByIdAndUpdate(foundMessage.conversation_id, {
        $set: { "lastMessage.text": "deleted this Message" },
      });
    }
    global.io.emit("deleted_message", result);
    res
      .status(200)
      .json({ success: true, Message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, Message: "error deleting Message" });
  }
};
const deleteForME = async (req, res, next) => {
  try {
    const selectedMessage = await Message.findById(req.params.id);
    let result = {};

    if (selectedMessage.deletedFor.length >= 1) {
      result = await Message.deleteOne({ _id: req.params.id });
    } else {
      result = await Message.updateOne(
        { _id: req.params.id },
        { $addToSet: { deletedFor: req.user.userId } }
      );
    }

    global.io.emit("deleted_message", result);
    res
      .status(200)
      .json({ success: true, Message: "Message deleted successfully" });
  } catch (error) {
    console.log(error.Message);
    res.status(500).json({ success: false, Message: "error deleting Message" });
  }
};
const updateMessage = async (req, res, next) => {
  try {
    const foundMessage = await Message.findById(req.params.id);
    const oldMessage = foundMessage.text;

    const result = await Message.updateOne(
      { _id: req.params.id },
      {
        $set: { text: req.body.text },
        $addToSet: { old_text: oldMessage },
      }
    );

    global.io.emit("deleted_message", result);

    res
      .status(200)
      .json({ success: true, Message: "Message updated successfully" });
  } catch (error) {
    console.log(error.Message);
    res.status(500).json({ success: false, Message: "Error updating Message" });
  }
};
const openChat = async (req, res, next) => {
  try {
    const con = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { isOpen: req.user.username },
      },
      { new: true }
    );

    res.status(200).json(con);
  } catch (err) {
    res.status(500).json({ Message: "Something went wrong", error: err });
  }
};
const closeChat = async (req, res, next) => {
  try {
    const con = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { isOpen: req.user.username },
      },
      { new: true }
    );
    res.status(200).json(con);
  } catch (err) {
    res.status(500).json({ Message: "Something went wrong", error: err });
  }
};
const closeAllChat = async (req, res, next) => {
  try {
    const con = await Conversation.updateMany(
      { isOpen: req.user.username },
      { $pull: { isOpen: req.user.username } }
    );

    res.status(200).json({ success: true, Message: "successfully closed" });
  } catch (err) {
    res.status(500).json({ Message: "Something went wrong", error: err });
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

export {
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
