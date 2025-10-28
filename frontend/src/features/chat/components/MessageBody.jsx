import { useChatStore, useUserStore } from "@/app/store";
import { SendHorizonal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoAttach } from "react-icons/io5";
import createNewMessage from "../services/createNewMessage";
import getUser from "@/services/getUser";

const userId = useUserStore.getState().userObjectId;
const textArray = [
  { text: "hello", _id: "01", sender: { _id: userId, name: "client" } },
  { text: "hi", _id: "02", sender: { _id: "01", name: "client_2" } },
];
const MessageBody = ({ opponent }) => {
  const [user, setUser] = useState({});
  const [realMessage, setRealMessage] = useState(textArray);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const conId = useChatStore((s) => s.openedChat);
  const [isLoading, setIsLoading] = useState(false);
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

    const messageObject = {
      text,
      images: previews,
      _id: realMessage.length + 1,
      sender: { _id: userId, name: "client" },
    };
    setRealMessage((prev) => [...prev, messageObject]);

    const body = new FormData();
    body.append("conId", conId);
    body.append("text", text);
    body.append("receiver", opponent._id);
    files.forEach((file) => body.append("files", file));
    // setText("");
    // setFiles([]);
    // previews.forEach((p) => URL.revokeObjectURL(p.url));
    // setPreviews([]);
    // return;
    try {
      const feedBack = await createNewMessage(body);
      if (!feedBack.success) {
        throw new Error(feedBack.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setText("");
      setFiles([]);
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
    }
  };
  const gettingUser = async () => {
    const data = await getUser();
    if (!data.error) {
      setUser(data.user);
    }
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [realMessage]);
  useEffect(() => {
    gettingUser();
  }, [conId]);
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
            <div
              className="w-8/12 h-8 mb-2 rounded-tl-lg drop-down rounded-br-lg bg-gray-600"
              style={{ animationDelay: `${(arr.length - 1 - i) * 0.1}s` }}
            />
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
        <div className=" flex max-h-full flex-col  overflow-y-scroll scrollbar-hide p-2">
          {realMessage.length > 0 &&
            realMessage.map((m, i) => (
              <div
                key={m._id}
                className={`flex items-end-safe mb-2 gap-2 mx-1  ${
                  m.sender._id !== userId ? "justify-start" : "justify-end"
                }`}
              >
                {m.sender._id !== userId &&
                  (opponent.avatar ? (
                    <img
                      src={opponent.avatar}
                      alt="user"
                      className="rounded-full ring h-6 w-6  drop-down"
                      style={{
                        animationDelay: `${(textArray.length - 1 - i) * 0.1}s`,
                      }}
                    />
                  ) : (
                    <FaUser
                      className="rounded-full ring text-2xl  drop-down"
                      style={{
                        animationDelay: `${(textArray.length - 1 - i) * 0.1}s`,
                      }}
                    />
                  ))}
                <div
                  className="max-w-8/12 drop-down flex flex-col "
                  style={{
                    animationDelay: `${(textArray.length - 1 - i) * 0.1}s`,
                  }}
                >
                  {m.text?.length > 0 && (
                    <div
                      className={`max-w-full min-h-8 p-1  border-black border-[0.5px] rounded-lg ${
                        m.sender._id === userId
                          ? "rounded-br-none bg-blue-400 text-white"
                          : "rounded-bl-none bg-white text-black "
                      }`}
                    >
                      {" "}
                      <p className="px-3 max-w-full">{m.text}</p>
                    </div>
                  )}
                  {m.images?.length > 0 && (
                    <div
                      className={`max-w-full flex flex-wrap border-black border-[0.5px] rounded-lg overflow-hidden ${
                        m.sender._id === userId
                          ? "rounded-br-none bg-blue-400 text-white"
                          : "rounded-bl-none bg-white text-black"
                      }`}
                      style={{ gap: "3px" }}
                    >
                      {m.images.map((image, i2) => {
                        const len = m.images.length;

                        // Width logic
                        let widthClass = "w-full";
                        if (len === 2) widthClass = "w-[calc(50%-1.5px)]";
                        else if (len === 3)
                          widthClass = "w-[calc(33.333%-2px)]";
                        else if (len > 3) widthClass = "w-[calc(33.333%-2px)]";

                        return (
                          <img
                            onClick={() => window.open(image.url, "_blank")}
                            src={image.url}
                            key={i2}
                            alt="image"
                            className={`${widthClass} max-h-40 object-cover rounded-lg cursor-pointer`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {m.sender._id === userId &&
                  (user?.avatar ? (
                    <img
                      src={user?.avatar}
                      alt="user"
                      className="rounded-full ring h-6 w-6  drop-down"
                      style={{
                        animationDelay: `${(textArray.length - 1 - i) * 0.1}s`,
                      }}
                    />
                  ) : (
                    <FaUser
                      className="rounded-full ring  drop-down text-gray-400 text-2xl"
                      style={{
                        animationDelay: `${(textArray.length - 1 - i) * 0.1}s`,
                      }}
                    />
                  ))}
              </div>
            ))}
          <div ref={bottomRef} />
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
