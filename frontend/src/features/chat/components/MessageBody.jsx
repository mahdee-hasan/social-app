import { useChatStore, useUserStore } from "@/app/store";
import { SendHorizonal } from "lucide-react";
import React, { useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoAttach } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const MessageBody = () => {
  const [message] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [realMessage, setRealMessage] = useState([
    { text: "hello", _id: "01", sender: { _id: userId, name: "client" } },
    { text: "hi", _id: "02", sender: { _id: "01", name: "client_2" } },
  ]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const conId = useChatStore((s) => s.openedChat);
  const userId = useUserStore((s) => s.userObjectId);
  const bottomRef = useRef(null);
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const combined = [...files, ...selected];
    if (combined.length > 5) return alert("You can upload up to 5 files only.");

    const newFiles = combined.slice(0, 5);

    // create preview URLs
    const urls = newFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    setFiles(newFiles);
    setPreviews(urls);

    e.target.value = ""; // allow same file reselect
  };

  const removePreview = (index) => {
    // revoke the object URL to free memory
    URL.revokeObjectURL(previews[index].url);

    const newFiles = [...files];
    newFiles.splice(index, 1);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);

    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !files.length)
      return alert("Write something or attach files");

    const body = new FormData();
    body.append("conId", conId);
    body.append("text", text);
    files.forEach((file) => body.append("files", file));

    try {
      console.log(
        "Sending:",
        files.map((f) => f.name)
      );
      setText("");
      setFiles([]);
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 flex flex-col justify-end overflow-y-auto p-2">
        {realMessage.length === 0 &&
          message.map((i, _, arr) => (
            <div
              key={i}
              className={`flex items-center gap-2 mx-1 animate-pulse ${
                i % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              {i % 2 === 0 && <FaUser className="rounded-full ring text-2xl" />}
              <div
                className="w-8/12 h-8 mb-2 rounded-tl-lg rounded-br-lg bg-gray-600"
                style={{ animationDelay: `${(arr.length - 1 - i) * 0.1}s` }}
              />
              {i % 2 !== 0 && (
                <FaUser className="rounded-full ring text-gray-400 text-2xl" />
              )}
            </div>
          ))}
        {realMessage.length > 0 &&
          realMessage.map(m, (i) => (
            <div
              key={m._id}
              className={`flex items-center gap-2 mx-1 animate-pulse ${
                m.sender._id === userId ? "justify-start" : "justify-end"
              }`}
            >
              {m.sender._id !== userId && (
                <FaUser className="rounded-full ring text-2xl" />
              )}
              <div
                className="w-8/12 h-8 mb-2 rounded-tl-lg rounded-br-lg bg-gray-600"
                style={{
                  animationDelay: `${(realMessage.length - 1 - i) * 0.1}s`,
                }}
              />
              <p>{m.text}</p>
              {m.sender._id === userId && (
                <FaUser className="rounded-full ring text-gray-400 text-2xl" />
              )}
            </div>
          ))}
        <div ref={bottomRef} />
      </div>

      {/* Message input with inline previews */}
      <div className="border-t bg-gray-200 p-3 flex flex-col gap-2 rounded-b-xl">
        {/* Inline previews */}
        {previews.length > 0 && (
          <div className="flex gap-2">
            {previews.map((p, i) => (
              <div key={p.url} className="relative w-8 h-8">
                <img
                  src={p.url}
                  alt={p.name}
                  className="w-8 h-8 object-cover rounded border"
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
      </div>
    </div>
  );
};

export default MessageBody;
