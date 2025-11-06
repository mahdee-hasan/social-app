//internal/npm packages imports
import { useChatStore, useUserStore } from "@/app/store";
import { SendHorizonal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoAttach } from "react-icons/io5";

//external imports
import createNewMessage from "../services/createNewMessage";
import userIcon from "/person.JPG";
import getUser from "@/services/getUser";
import getMessage from "../services/getMessage";
import Messages from "./Messages";
import socket from "@/app/socket";

const MessageBody = ({ opponent }) => {
  //zustand store
  const userId = useUserStore((s) => s.userObjectId);
  const conId = useChatStore((s) => s.openedChat);
  //useState
  const [user, setUser] = useState({});
  const [text, setText] = useState("");
  const [seenMessage, setSeenMessage] = useState([]);
  const [unseenMessage, setUnseenMessage] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //ref
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const gettingMessage = async () => {
    //set the loading true
    setIsLoading(true);
    //call the service
    const data = await getMessage(conId);
    //if only success set the data as you need
    if (data.success) {
      setSeenMessage(data.seen);
      setUnseenMessage(data.unseen);
    }
    //set the loading false after getting
    setIsLoading(false);
  };
  const handleFileChange = (e) => {
    //store the array of files
    const selected = Array.from(e.target.files || []);
    //return if there is no files
    if (!selected.length) return;
    //set a boundary for uploading
    const combined = [...files, ...selected];
    if (combined.length > 5) return alert("You can upload up to 5 files only.");
    //make the new file as first five
    const newFiles = combined.slice(0, 5);

    // create preview URLs
    const urls = newFiles.map((file) => ({
      name: file.name,
      secure_url: URL.createObjectURL(file),
      type: file.type,
    }));

    setFiles(newFiles);
    setPreviews(urls);

    e.target.value = ""; // allow same file reselect
  };

  //function for removing the previews
  const removePreview = (index) => {
    // revoke the object URL to free memory
    URL.revokeObjectURL(previews[index].secure_url);

    const newFiles = [...files];
    newFiles.splice(index, 1);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);

    setFiles(newFiles);
    setPreviews(newPreviews);
  };
  //handle the files and text and submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    //if no text or no files then return
    if (!text.trim() && !files.length)
      return alert("Write something or attach files");
    //make a preview for instant displaying
    const tempId = unseenMessage.length + 1;

    const messageObject = {
      text,
      attachment: previews,
      _id: tempId,
      sender: { _id: userId },
      createdAt: Date.now(),
      status: "sending",
      seen: [],
    };

    // add the temporary message
    setUnseenMessage((prev) => [messageObject, ...prev]);

    // prepare form data
    const body = new FormData();
    body.append("conId", conId);
    body.append("text", text);
    body.append("receiver", opponent._id);
    files.forEach((file) => body.append("files", file));

    // reset input fields
    setText("");
    setFiles([]);
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);

    try {
      const feedBack = await createNewMessage(body);

      if (feedBack.success) {
        setUnseenMessage((prev) =>
          prev.map((msg) =>
            msg._id === tempId ? { ...msg, status: "sent" } : msg
          )
        );
      } else {
        throw new Error(feedBack.error);
      }
    } catch (error) {
      console.error(error.message);

      setUnseenMessage((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...msg, status: "not_sent" } : msg
        )
      );
    }
  };
  //getting the user
  const gettingUser = async () => {
    const data = await getUser();
    if (!data.error) {
      setUser(data.user);
    }
  };

  // for scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [unseenMessage]);
  // for getting the data
  useEffect(() => {
    gettingUser();
    gettingMessage();
  }, [conId, userId]);

  //for getting new message / socket
  useEffect(() => {
    socket.on("new_message", (data) => {
      setSeenMessage((prev) => [data, ...prev]);
    });
    return () => {
      socket.off("new_message", () => {});
    };
  }, []);

  if (isLoading || !opponent) {
    return (
      <>
        {[0, 1, 2, 3, 4, 5, 6].map((i, _, arr) => (
          <div
            key={i}
            className={`flex items-center gap-2 mx-1 animate-pulse ${
              i % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            {i % 2 === 0 && <FaUser className="rounded-full ring text-2xl" />}
            <div className="w-8/12 h-8 mb-2 rounded-tl-lg rounded-br-lg bg-gray-600" />
            {i % 2 !== 0 && (
              <FaUser className="rounded-full ring text-gray-400 text-2xl" />
            )}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <label className="cursor-pointer">
            <IoAttach className="text-2xl" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded px-3 py-2 bg-white"
          />

          <button type="submit" className="p-2">
            <SendHorizonal />
          </button>
        </form>
      </>
    );
  }

  return (
    <div className="relative flex flex-col h-full">
      {/* Chat messages */}
      <div
        className={`flex-1 flex flex-col justify-end ${
          previews.length > 0 ? "h-19/24" : "h-21/24"
        }`}
      >
        <div className=" flex max-h-full flex-col-reverse  overflow-y-scroll scrollbar-hide p-2">
          <div ref={bottomRef} />
          <Messages
            messages={unseenMessage}
            userId={userId}
            userIcon={userIcon}
          />
          <div className="w-full my-1 flex justify-end">
            {" "}
            <img
              src={opponent?.avatar || userIcon}
              alt="user"
              className="w-3 h-3 ring rounded-full"
            />
          </div>

          <Messages
            messages={seenMessage}
            userId={userId}
            userIcon={userIcon}
          />
        </div>
      </div>

      {/* Message input with inline previews */}
      <div
        className={`border-t bg-gray-500 p-2 flex flex-col gap-2 rounded-b-xl ${
          previews.length > 0 ? "h-5/24" : "h-3/24"
        }`}
      >
        {/* Inline previews */}
        {previews.length > 0 && (
          <div className="flex h-1/3 gap-2">
            {previews.map((p, i) => (
              <div key={p.url} className="relative max-w-8 max-h-11/12">
                <img
                  src={p.url}
                  alt={p.name}
                  className="max-w-8 h-full object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input row */}
        <form
          onSubmit={handleSubmit}
          className={`flex  items-center justify-center gap-3 ${
            previews.length ? "h-2/3" : "h-full"
          } `}
        >
          <label className="cursor-pointer">
            <IoAttach className="text-2xl" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden h-full"
              onChange={handleFileChange}
            />
          </label>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded px-3 py-1 max-h-10/12 bg-white"
          />

          <button
            type="submit"
            disabled={!text && !files.length}
            className="p-2"
          >
            <SendHorizonal />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageBody;
