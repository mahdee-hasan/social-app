// SingleMessage.js
import React, { useState } from "react";
import { useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { io } from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import useChatStore from "../../stores/chatStore";
import HighlightLinks from "@/components/inbox/HighlightLinks";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/useAuthStore";
const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
});

const SingleMessage = ({
  message,
  userId,

  messageEditSlot,
  onEditToggle,

  onDelete,
  func,
}) => {
  const [upMsg, setUpMsg] = useState(message.text);
  const isOwn = message.sender.id === userId;
  const isEditing = messageEditSlot === message._id;
  const { bearerToken } = useAuthStore.getState();

  const setMsg = useChatStore((s) => s.setPopUpMessage);

  useEffect(() => {
    const handleMessage = (data) => {
      if (data.acknowledged === true) {
        func(Math.random());
      }
    };

    socket.on("deleted_message", handleMessage);
    return () => socket.off("deleted_message", handleMessage);
  }, [onDelete]);
  const onMessageSubmit = (e) => {
    setUpMsg(e.target.value);
  };
  const updateMessage = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/inbox/editMessage/${id}`,
        {
          method: "POST",
          body: JSON.stringify({ text: upMsg }),
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${bearerToken}`,
          },
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("error updating message");
      }
      const data = await res.json();
    } catch (error) {
      setMsg(error.message);
    }
  };
  const handleDeleteForMe = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/inbox/forMe/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(`${res.statusText} and the error ${data.message}`);
      }
    } catch (error) {
      setMsg(error.message);
    }
  };
  const attachmentClicked = (url) => {
    window.open(url, "_blank");
  };
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onEditToggle(null);
      }}
      className={` normal-case shadow-md break-words
          flex relative items-center justify-between rounded-t-xl
         max-w-2/3
        ${
          isOwn
            ? "bg-blue-500 text-white border border-gray-300/50 rounded-bl-xl"
            : "bg-white text-black rounded-br-xl"
        }
        `}
    >
      <div>
        {" "}
        {message.attachment.length > 0 && (
          <div
            className="overflow-hidden flex-wrap p-1
         flex justify-center bg-gray-50 rounded-t-xl"
          >
            {message.attachment?.map((pic) => (
              <img
                key={pic.url}
                src={pic.url}
                alt="attachment"
                className={` aspect-auto ${
                  message.attachment.length === 1
                    ? "w-full"
                    : message.attachment.length === 2
                    ? "w-1/2"
                    : "w-1/3"
                } `}
                onClick={(e) => {
                  e.stopPropagation();
                  attachmentClicked(pic.url);
                }}
              />
            ))}
          </div>
        )}
        {isEditing ? (
          <>
            <form
              className="relative flex items-center"
              onClick={() => updateMessage(message._id)}
            >
              <input
                className="outline-none border w-72 bg-white rounded-xl rounded-br-none p-1 text-black px-2"
                type="text"
                name="text"
                value={upMsg}
                autoFocus
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={onMessageSubmit}
              />
              <button
                type="submit"
                className="absolute right-0 h-full px-1 rounded-tr-xl border border-black border-l-0 bg-gray-200 z-10"
              >
                {" "}
                <IoSend
                  className=" text-gray-500 cursor-pointer"
                  onClick={() => updateMessage(message._id)}
                />
              </button>
            </form>
          </>
        ) : message.text ? (
          <p className="px-2 py-1">
            {" "}
            <HighlightLinks text={message.text} isOwn={isOwn} />
          </p>
        ) : (
          ""
        )}
      </div>

      <div
        className={`absolute text-gray-600 ${isOwn ? "-left-4" : "-right-4"} `}
        onClick={(e) => {
          e.stopPropagation();

          onEditToggle(null);
        }}
      >
        {message.editable && (
          <DropdownMenu
            className={`text-xs rounded-2xl ring flex flex-col
               bg-white min-w-32 justify-baseline ${
                 isOwn ? " rounded-br-none" : " rounded-bl-none"
               }
               items-start cursor-pointer text-gray-700`}
          >
            <DropdownMenuTrigger className="cursor-pointer mt-2">
              <BsThreeDotsVertical />
            </DropdownMenuTrigger>{" "}
            <DropdownMenuContent>
              {isOwn && (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    title="delete for everyone"
                    onClick={() => {
                      onDelete(message._id);
                    }}
                  >
                    delete for everyone
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    title="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditToggle(message._id);
                    }}
                  >
                    edit
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                className="cursor-pointer"
                title="delete for me"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteForMe(message._id);
                }}
              >
                delete for me
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default SingleMessage;
