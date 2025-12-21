import React, { useEffect, useState } from "react";
import formatDate from "@/utils/formatDate";
import { Dot } from "lucide-react";
import socket from "@/app/socket";
import { useChatStore } from "@/app/store";

const Messages = ({ messages, userId, userIcon, unreadCounts, opponent }) => {
  const [count, setCount] = useState(unreadCounts);
  const [isTyping, setIsTyping] = useState(false);
  const [typingAvatar, setTypingAvatar] = useState(null);
  const [typingTimeoutId, setTypingTimeoutId] = useState(null);
  const conversationId = useChatStore((s) => s.openedChat);

  const handleIsTyping = ({ avatar }) => {
    setIsTyping(true);
    setTypingAvatar(avatar);

    // Use functional update for setTypingTimeoutId
    // currentTimeoutId is the most up-to-date value of typingTimeoutId
    setTypingTimeoutId((currentTimeoutId) => {
      // Clear any existing timeout before setting a new one
      if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
      }

      // Set the new timeout and return its ID to be stored in state
      const newTimeoutId = setTimeout(() => {
        setIsTyping(false);
        setTypingAvatar(null);
        setTypingTimeoutId(null); // Also clear the ID from state once complete
      }, 1000);

      return newTimeoutId;
    });
  };
  useEffect(() => {
    socket.on("isTyping", handleIsTyping);

    // Cleanup function to run when the component unmounts or effect dependencies change
    return () => {
      socket.off("isTyping", handleIsTyping);
      // Ensure the final timeout is cleared if the component unmounts
      // Use the cleanup function's access to the current state or just clear the last known one
      if (typingTimeoutId) {
        clearTimeout(typingTimeoutId);
      }
    };
  }, []);
  useEffect(() => {
    socket.on("unreadIncrease", ({ conId }) => {
      if (conversationId === conId) {
        setCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.off("unreadIncrease", () => {});
    };
  }, []);

  return (
    <>
      {isTyping && (
        <div
          className={`flex relative items-end-safe mb-5 gap-2  justify-start`}
        >
          <img
            src={typingAvatar || userIcon}
            alt="user"
            className="rounded-full ring h-6 w-6"
          />
          <p className="animate-pulse">typing...</p>
        </div>
      )}

      {messages.length > 0 &&
        messages.map((m, i) => (
          <div
            key={m._id}
            className={`flex relative items-end-safe mb-5 gap-2 ${
              m.sender._id !== userId ? "justify-start" : "justify-end"
            } ${i === count && "mb-9"}`}
          >
            {i === count && (
              <div className="w-full absolute -bottom-9 my-1 flex justify-end">
                {" "}
                <img
                  src={opponent?.avatar || userIcon}
                  alt="user"
                  className="w-3 h-3 ring rounded-full"
                />
              </div>
            )}
            <>
              <div
                className={`absolute font-mono w-full items-center  gap-1 flex  ${
                  m.sender._id === userId
                    ? "justify-end -bottom-5"
                    : "-bottom-3.5 ml-8 justify-start"
                } `}
              >
                <p className="text-[10px]">{formatDate(m?.createdAt)}</p>

                {m.sender._id === userId &&
                  m.status !== "delivered" &&
                  i === 0 && (
                    <>
                      {" "}
                      <Dot />
                      <p className="text-[10px] ">{m.status || "sent"}</p>
                    </>
                  )}
              </div>
              {m.sender._id !== userId && (
                <img
                  src={m.sender.avatar || userIcon}
                  alt="user"
                  className="rounded-full ring h-6 w-6"
                />
              )}
              <div className="max-w-8/12 flex flex-col ">
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
                      else if (len === 3) widthClass = "w-[calc(33.333%-2px)]";
                      else if (len > 3) widthClass = "w-[calc(33.333%-2px)]";

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
            </>{" "}
          </div>
        ))}
    </>
  );
};

export default Messages;
