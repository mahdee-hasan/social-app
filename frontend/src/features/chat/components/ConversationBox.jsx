import { SendHorizonal } from "lucide-react";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { IoAttach, IoCall, IoVideocam } from "react-icons/io5";
import MessageBody from "./MessageBody";

const ConversationBox = () => {
  return (
    <div className="w-3/4 rounded-xl flex flex-col ring h-full">
      <div className="bg-gray-300 rounded-t-xl flex items-center-safe h-16 w-full">
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
        <MessageBody />
      </div>
    </div>
  );
};

export default ConversationBox;
