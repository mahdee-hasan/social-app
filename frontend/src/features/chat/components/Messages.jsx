import React from "react";
import formatDate from "@/utils/formatDate";
import { Dot } from "lucide-react";

const Messages = ({ messages, userId, userIcon }) => {
  return (
    messages.length > 0 &&
    messages.map((m, i) => (
      <div
        key={m._id}
        className={`flex relative items-end-safe mb-5 gap-2   ${
          m.sender._id !== userId ? "justify-start" : "justify-end"
        }`}
      >
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
              i === messages.length - 1 && (
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
              className="rounded-full ring h-6 w-6  drop-down"
              style={{
                animationDelay: `${(messages.length - 1 - i) * 0.1}s`,
              }}
            />
          )}
          <div
            className="max-w-8/12 drop-down flex flex-col "
            style={{
              animationDelay: `${(messages.length - 1 - i) * 0.1}s`,
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
                  else if (len === 3) widthClass = "w-[calc(33.333%-2px)]";
                  else if (len > 3) widthClass = "w-[calc(33.333%-2px)]";

                  return (
                    <img
                      onClick={() => window.open(image.secure_url, "_blank")}
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
        </>
      </div>
    ))
  );
};

export default Messages;
