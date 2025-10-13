import { Minimize, SendHorizonal, User, X } from "lucide-react";
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoAttach } from "react-icons/io5";

const ConversationDrawer = () => {
  const [message, setMessage] = useState([0, 1, 2, 3, 4, 5, 6]);
  const addMessage = () => {
    const i = message.length;
    setMessage((prev) => [...prev, i]);
  };
  return (
    <div className="w-80 z-50 bg-white rounded-2xl right-5 h-95 ring fixed bottom-1 flex flex-col ">
      <div className="flex rounded-t-2xl gap-2 h-15 justify-between px-3 bg-gray-500 items-center w-full">
        <div className="flex items-center gap-2">
          {" "}
          <User className="w-8 h-8  bg-gray-400 text-gray-200 rounded-full" />
          <p className="h-5 w-30 bg-gray-400 animate-pulse"></p>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <Minimize />
          <X />
        </div>
      </div>
      <div className="flex flex-col overflow-y-scroll gap-2">
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
              className={`w-8/12 h-8 mb-2 rounded-tl-lg rounded-br-lg bg-gray-600 drop-down`}
              style={{
                animationDelay: `${(arr.length - 1 - i) * 0.1}s`, // reverse delay
              }}
            ></div>
            {i % 2 !== 0 && (
              <FaUser className="rounded-full ring text-gray-400 drop-down text-2xl" />
            )}
          </div>
        ))}
      </div>
      <div className="h-1/10 rounded-2xl p-5 justify-between bg-gray-400 flex items-center ">
        <IoAttach className="text-2xl" />
        <input
          type="text"
          autoFocus
          className="rounded-lg w-4/5 h-7 bg-gray-100 p-1"
        />
        <SendHorizonal onClick={addMessage} />
      </div>
    </div>
  );
};

export default ConversationDrawer;
