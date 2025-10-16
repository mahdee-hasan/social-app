import { SendHorizonal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoAttach } from "react-icons/io5";

const MessageBody = () => {
  const [message, setMessage] = useState([0, 1, 2, 3, 4, 5, 6]);
  const bottomRef = useRef(null);
  const [text, setText] = useState("");
  const addMessage = () => {
    setMessage((prev) => [...prev, prev.length]);
  };

  const handleSubmit = async () => {
    try {
    } catch (error) {}
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <>
      <div className="h-9/10 max-h-9/10 flex flex-col justify-end">
        <div className="flex flex-col scrollbar-hide overflow-y-scroll gap-2">
          {message.map((i, _, arr) => (
            <div
              key={i}
              className={`flex items-center gap-2 mx-1 animate-pulse ${
                i % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              {i % 2 === 0 && (
                <FaUser className="rounded-full ring text-2xl drop-down" />
              )}
              <div
                className="w-8/12 h-8 mb-2 rounded-tl-lg rounded-br-lg bg-gray-600 drop-down"
                style={{
                  animationDelay: `${(arr.length - 1 - i) * 0.1}s`, // reverse delay
                }}
              ></div>
              {i % 2 !== 0 && (
                <FaUser className="rounded-full ring text-gray-400 drop-down text-2xl" />
              )}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="h-1/10 p-5 justify-between rounded-b-xl bg-gray-400 flex items-center">
        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="file">
            <input type="file" name="file" id="file" />
            <IoAttach className="text-2xl" />
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded-lg w-4/5 h-7 bg-gray-100 p-1"
          />
          <SendHorizonal onClick={addMessage} className="cursor-pointer" />
        </form>
      </div>
    </>
  );
};

export default MessageBody;
