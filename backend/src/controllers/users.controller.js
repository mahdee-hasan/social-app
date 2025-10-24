import people from "../models/people.model.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

import Conversation from "../models/conversation.model.js";
import cloudinary from "../config/cloudinaryConfig.js";
import deleteUsersConversation from "../utils/deleteAttachment.js";
import admin from "../config/firebase.js";
//get users
const getUsers = async (req, res, next) => {
  if (req.user.role) {
    const users = await people
      .find({ _id: { $ne: req.user.userId } })
      .sort({ active: -1, updatedAt: -1 });
    const user = await people.findById(req.user.userId);
    res.status(200).json({ user, users });
  } else {
    res.status(403).json({ message: "something went wrong" });
  }
};
const addUser = async (req, res, next) => {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  if (req.files && req.files.length > 0) {
    newUser = new people({
      ...req.body,
      avatar: req.avatarName,
      public_id: req.public_id,
      password: hashedPassword,
    });
  } else {
    newUser = new people({
      ...req.body,
      password: hashedPassword,
    });
  }

  //save the user
  try {
    const result = await newUser.save();
    res.status(200).json({ message: "user was added successfully" });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "unknown error occurred",
        },
      },
    });
  }
};
const addFireBaseUser = async (req, res, next) => {
  try {
    const { uid, displayName, email, photoURL } = req.body;
    const match = await people.findOne({ email });
    if (match) {
      res.status(200).json({ signedIn: true });
    } else {
      const newUser = new people({
        uid,
        email,
        name: displayName,
        avatar: photoURL || null,
      });
      const user = await newUser.save();
      res.status(201).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await people.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //find avatar and delete

    if (user.avatar && user.public_id) {
      const res = await cloudinary.uploader.destroy(user.public_id);

      if (!res) {
        throw new Error("error deleting avatar from cloudinary");
      }
    }

    // Find and delete related messages/conversations
    const usersMessages = await Conversation.find({
      $or: [
        { "creator.id": req.params.id },
        { "participant.id": req.params.id },
      ],
    });

    for (const msg of usersMessages) {
      const res = await deleteUsersConversation(msg._id);
      if (!res.success) {
        throw new Error(res.message);
      }
    }
    await Conversation.deleteMany({
      $or: [
        { "creator.id": req.params.id },
        { "participant.id": req.params.id },
      ],
    }).catch((err) => {
      throw new Error(err.message);
    });

    await people.findByIdAndDelete(req.params.id).catch((err) => {
      throw new Error(err.message);
    });

    res
      .status(200)
      .json({ message: "User and related data deleted successfully", user });
  } catch (error) {
    console.log(err.message);
    res.status(500).json({
      errors: {
        common: {
          message: error.message,
        },
      },
    });
  }
};

// const deleteUsersConversation = async (conversationId) => {
//   try {
//     // Step 2: Find all attachments
//     const attachments = await message.find(
//       { conversation_id: conversationId },
//       "attachment"
//     );

//     // Step 3: Delete all attachment files
//     if (attachments && attachments.length > 0) {
//       for (const msg of attachments) {
//         for (const filename of msg.attachment) {
//           try {
//             if (filename.url && filename.public_id) {
//               const res = await cloudinary.uploader.destroy(filename.public_id);
//               if (!res) {
//                 throw new Error("error deleting avatar from cloudinary");
//               }
//             }
//           } catch (err) {
//             throw new Error("File delete error:", err.message);
//           }
//         }
//       }
//     }

//     // Step 4: Delete messages
//     await message.deleteMany({ conversation_id: conversationId });

//     return { success: true, message: "Conversation and messages deleted" };
//   } catch (error) {
//     console.error("Error in deleteUsersConversation:", error.message);
//     return { success: false, message: error.message };
//   }
// };
export { getUsers, addUser, deleteUser, addFireBaseUser };
