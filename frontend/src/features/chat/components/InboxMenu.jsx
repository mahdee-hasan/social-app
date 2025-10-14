import React, { useEffect, useState } from "react";

import getAllConversation from "../services/getAllConversation";
import { useUserStore } from "@/app/store";
import { Plus, UserIcon } from "lucide-react";
import CreateNewCon from "./CreateNewCon";

const InboxMenu = () => {
  const [conversations, setConversations] = useState();
  const [loading, setLoading] = useState(true);
  const userId = useUserStore((s) => s.userObjectId);

  const getCon = async () => {
    try {
      const data = await getAllConversation(userId);
      if (data.success) {
        setConversations(data.conversations);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  console.log(conversations);
  useEffect(() => {
    getCon();
  }, []);
  const getOpponents = (value) => {
    const opponent =
      value.participants[0]._id === userId
        ? value.participants[1]
        : value.participants[0];
    return opponent;
  };
  if (loading) {
    return (
      <div className="h-full w-1/4">
        <div className="flex flex-col gap-1 ">
          {" "}
          <p className="h-18 bg-gray-200 w-11/12 flex justify-center text-2xl items-center">
            Inbox
          </p>
          {[0, 1, 2, 3].map((i, _, arr) => (
            <div
              className="w-11/12 flex gap-1 drop-down rounded p-1 items-center animate-pulse bg-gray-400 h-18"
              key={i}
              style={{
                animationDelay: `${(arr.length - 1 - i) * 0.1}s`, // reverse delay
              }}
            >
              <p className="w-10 h-10 rounded-full bg-gray-500 animate animate-pulse"></p>
              <div className="space-y-1">
                <p className="h-4 w-15 bg-gray-500"></p>
                <p className="h-3 w-17 bg-gray-600 animate-pulse "></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[90%] w-1/4 relative">
      <div className="flex flex-col gap-1 ">
        {" "}
        <p className="h-18 bg-gray-200 w-11/12 flex justify-center text-2xl items-center">
          Inbox
        </p>
        {conversations?.map((con, i, arr) => (
          <div
            className="w-11/12 flex gap-1 drop-down rounded p-1 items-center animate-pulse bg-gray-400 h-18"
            key={con._id}
            style={{
              animationDelay: `${(arr.length - 1 - i) * 0.1}s`, // reverse delay
            }}
          >
            {getOpponents(con).avatar ? (
              <img
                className="w-10 h-10 rounded-full bg-gray-500"
                src={getOpponents(con).avatar}
                alt="user"
              />
            ) : (
              <UserIcon className="w-10 h-10 rounded-full bg-gray-500" />
            )}

            <div className="space-y-1">
              <p className="">{getOpponents(con).name}</p>
              <p className="text-xs ">active now</p>
            </div>
          </div>
        ))}
      </div>
      <div
        className="absolute bottom-8 cursor-pointer
       left-3 h-15 ring flex items-center justify-center w-15 rounded-full"
      >
        <CreateNewCon />
      </div>
    </div>
  );
};

export default InboxMenu;
