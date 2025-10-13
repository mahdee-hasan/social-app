import { SendHorizonal } from "lucide-react";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { IoAttach, IoCall, IoVideocam } from "react-icons/io5";

const ConversationBox = () => {
  const [message, setMessage] = useState([0, 1, 2, 3, 4, 5, 6]);
  const addMessage = () => {
    const i = message.length;
    setMessage((prev) => [...prev, i]);
  };
  return (
    <div className="w-3/4 rounded flex flex-col ring h-[90%]">
      <div className="bg-gray-300 rounded flex items-center-safe h-16 w-full">
        <div className="flex  justify-between w-full items-center px-10  gap-2">
          <div className="flex items-center gap-1">
            {" "}
            <p className="w-12 h-12 rounded-full bg-gray-500 animate-pulse"></p>
            <div>
              <p className="w-25 h-5 mb-0.5 bg-gray-500 animate-pulse"></p>
              <p className="w-25 h-3 bg-gray-400 animate-pulse"></p>
            </div>
          </div>
          <div className="w-2/5 justify-end gap-5 lg:gap-15 flex items-center">
            <IoCall className="text-lg" />
            <IoVideocam className="text-2xl" />
            <BsThreeDotsVertical />{" "}
          </div>
        </div>
      </div>
      <div className="flex flex-col  h-[80vh] justify-end">
        <div className="h-9/10 flex flex-col justify-end ">
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
        </div>
        <div className="h-1/10 p-5 justify-between bg-gray-400 flex items-center ">
          <IoAttach className="text-2xl" />
          <input
            type="text"
            autoFocus
            className="rounded-lg w-4/5 h-7 bg-gray-100 p-1"
          />
          <SendHorizonal onClick={addMessage} />
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
