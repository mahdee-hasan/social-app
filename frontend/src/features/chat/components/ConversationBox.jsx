import { SendHorizonal, UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { IoAttach, IoCall, IoVideocam } from "react-icons/io5";
import MessageBody from "./MessageBody";
import getOneConversation from "../services/getOneConversation";
import { useChatStore, useUserStore } from "@/app/store";
import getOpponents from "../utils/getOpponents";
import userIcon from "/person.JPG";

const ConversationBox = () => {
  const conId = useChatStore((s) => s.openedChat);
  const userId = useUserStore((s) => s.userObjectId);
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState(null);

  const gettingCon = async () => {
    setIsLoading(true);
    const data = await getOneConversation(conId);
    if (data.success) {
      setConversation(data.conversation);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    gettingCon();
  }, [conId]);

  if (isLoading) {
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
  }

  return conversation ? (
    <div className="w-3/4 rounded-xl flex flex-col ring h-full">
      <div className="bg-gray-200 rounded-t-xl flex items-center-safe h-[10vh] w-full">
        <div className="flex  justify-between w-full items-center px-10  gap-2">
          <div className="flex items-center gap-1">
            <img
              src={getOpponents(conversation, userId).avatar || userIcon}
              className="w-12 ring h-12 mr-2 rounded-full"
              alt="user"
            />

            <div>
              <p className="w-50 font-bold text-gray-900 h-5 mb-0.5">
                {getOpponents(conversation, userId).name}
              </p>
              <p className="w-25 text-gray-500 h-3 text-xs">
                {getOpponents(conversation, userId).active
                  ? "active now"
                  : "offline"}
              </p>
            </div>
          </div>
          <div className="w-2/5 justify-end gap-5 lg:gap-15 flex items-center">
            <IoCall className="text-lg" />
            <IoVideocam className="text-2xl" />
            <BsThreeDotsVertical />{" "}
          </div>
        </div>
      </div>
      <div className="flex flex-col  h-[75vh] justify-end">
        <MessageBody opponent={getOpponents(conversation, userId)} />
      </div>
    </div>
  ) : (
    <div className="mx-auto my-auto h-10 w-70">select a conversation</div>
  );
};

export default ConversationBox;
