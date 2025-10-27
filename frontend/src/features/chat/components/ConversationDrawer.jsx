import { Minimize, User, X } from "lucide-react";
import React, { useState, useEffect } from "react";

import MessageBody from "./MessageBody";
import getOneConversation from "../services/getOneConversation";
import { useChatStore, useUserStore } from "@/app/store";

const ConversationDrawer = () => {
  const conId = useChatStore((s) => s.openedChat);
  const userId = useUserStore((s) => s.userObjectId);
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState(null);

  const gettingCon = async () => {
    const data = await getOneConversation(conId);
    if (data.success) {
      setConversation(data.conversation);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    gettingCon();
  }, [conId]);

  const getOpponents = (value) => {
    const opponent =
      value?.participants[0]._id === userId
        ? value?.participants[1]
        : value?.participants[0];
    return opponent;
  };
  const opponent = getOpponents(conversation);
  const [show, setShow] = useState(true);
  return (
    <div
      className={`w-85 z-50 bg-white rounded-xl right-5 h-100 ring-2 fixed bottom-3 flex-col ${
        show ? "flex" : "hidden"
      }`}
    >
      {isLoading ? (
        <>
          {" "}
          <div className="flex rounded-t-xl gap-2 h-12 justify-between px-3 bg-gray-500 items-center w-full">
            <div className="flex items-center gap-2">
              {" "}
              <User className="w-8 h-8  bg-gray-400 text-gray-200 rounded-full" />
              <p className="h-5 w-30 bg-gray-400 animate-pulse"></p>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Minimize className="cursor-pointer" />
              <X
                className="cursor-pointer"
                onClick={() => {
                  setShow(false);
                }}
              />
            </div>
          </div>
          <div className="h-90">
            {" "}
            <MessageBody />
          </div>
        </>
      ) : (
        <>
          <div className="flex rounded-t-xl gap-2 h-12 justify-between px-3 bg-gray-500 items-center w-full">
            <div className="flex items-center gap-2">
              {opponent?.avatar ? (
                <img
                  src={opponent.avatar}
                  alt="use"
                  className="w-8 h-8  bg-gray-400 text-gray-200 rounded-full"
                />
              ) : (
                <User className="w-8 h-8  bg-gray-400 text-gray-200 rounded-full" />
              )}

              <p className="h-5 w-30">{opponent.name}</p>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Minimize className="cursor-pointer" />
              <X
                className="cursor-pointer"
                onClick={() => {
                  setShow(false);
                }}
              />
            </div>
          </div>
          <div className="h-90">
            {" "}
            <MessageBody opponent={opponent} />
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationDrawer;
