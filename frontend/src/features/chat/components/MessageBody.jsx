import { useChatStore, useUserStore } from "@/app/store";
import { Dot, SendHorizonal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoAttach } from "react-icons/io5";
import createNewMessage from "../services/createNewMessage";
import getUser from "@/services/getUser";
import formatDate from "@/utils/formatDate";
import getMessage from "../services/getMessage";

const MessageBody = ({ opponent }) => {
  const userId = useUserStore((s) => s.userObjectId);
  const [user, setUser] = useState({});
  const [realMessage, setRealMessage] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const conId = useChatStore((s) => s.openedChat);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);

  const gettingMessage = async () => {
    const data = await getMessage(conId);
    if (data.success) {
      setRealMessage(data.message);
    }
  };
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const combined = [...files, ...selected];
    if (combined.length > 5) return alert("You can upload up to 5 files only.");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !files.length)
      return alert("Write something or attach files");

    const messageObject = {
      text,
      attachment: previews,
      _id: realMessage.length + 1,
      sender: { _id: userId, name: "client" },
      createdAt: Date.now(),
      status: "sending",
    };
    setRealMessage((prev) => [messageObject, ...prev]);

    const body = new FormData();
    body.append("conId", conId);
    body.append("text", text);
    body.append("receiver", opponent._id);
    files.forEach((file) => body.append("files", file));
    setText("");
    setFiles([]);
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);

    try {
      const feedBack = await createNewMessage(body);
      if (!feedBack.success) {
        throw new Error(feedBack.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
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
    gettingMessage();
  }, [conId, userId]);
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
        <div className=" flex max-h-full flex-col-reverse  overflow-y-scroll scrollbar-hide p-2">
          <div ref={bottomRef} />
          {realMessage.length > 0 &&
            realMessage.map((m, i) => (
              <div
                key={m._id}
                className={`flex relative items-end-safe mb-5 gap-2 mx-1  ${
                  m.sender._id !== userId ? "justify-start" : "justify-end"
                }`}
              >
                <>
                  <div
                    className={`absolute font-mono w-full items-center  gap-1 flex -bottom-5 ${
                      m.sender._id === userId
                        ? "justify-end mr-8"
                        : "ml-8 justify-start"
                    } `}
                  >
                    <p className="text-[10px]">{formatDate(m?.createdAt)}</p>
                    <Dot />
                    <p className="text-[10px] ">{m.status || "sent"}</p>
                  </div>
                  {m.sender._id !== userId &&
                    (opponent.avatar ? (
                      <img
                        src={opponent.avatar}
                        alt="user"
                        className="rounded-full ring h-6 w-6  drop-down"
                        style={{
                          animationDelay: `${
                            (realMessage.length - 1 - i) * 0.1
                          }s`,
                        }}
                      />
                    ) : (
                      <FaUser
                        className="rounded-full ring text-2xl  drop-down"
                        style={{
                          animationDelay: `${
                            (realMessage.length - 1 - i) * 0.1
                          }s`,
                        }}
                      />
                    ))}
                  <div
                    className="max-w-8/12 drop-down flex flex-col "
                    style={{
                      animationDelay: `${(realMessage.length - 1 - i) * 0.1}s`,
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
                    {m.attachment?.length > 0 && (
                      <div
                        className={`max-w-full flex flex-wrap border-black border-[0.5px] rounded-lg overflow-hidden ${
                          m.sender._id === userId
                            ? "rounded-br-none bg-blue-400 text-white"
                            : "rounded-bl-none bg-white text-black"
                        }`}
                        style={{ gap: "3px" }}
                      >
                        {m.attachment.map((image, i2) => {
                          const len = m.attachment.length;

                          // Width logic
                          let widthClass = "w-full";
                          if (len === 2) widthClass = "w-[calc(50%-1.5px)]";
                          else if (len === 3)
                            widthClass = "w-[calc(33.333%-2px)]";
                          else if (len > 3)
                            widthClass = "w-[calc(33.333%-2px)]";

                          return (
                            <img
                              onClick={() =>
                                window.open(image.secure_url, "_blank")
                              }
                              src={image.secure_url}
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
                          animationDelay: `${
                            (realMessage.length - 1 - i) * 0.1
                          }s`,
                        }}
                      />
                    ) : (
                      <FaUser
                        className="rounded-full ring  drop-down text-gray-400 text-2xl"
                        style={{
                          animationDelay: `${
                            (realMessage.length - 1 - i) * 0.1
                          }s`,
                        }}
                      />
                    ))}
                </>
              </div>
            ))}
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
