import { Minimize, User, X } from "lucide-react";
import React, { useState } from "react";

import MessageBody from "./MessageBody";

const ConversationDrawer = () => {
  const [show, setShow] = useState(true);
  return (
    <div
      className={`w-85 z-50 bg-white rounded-xl right-5 h-100 ring-2 fixed bottom-3 flex-col ${
        show ? "hidden" : "hidden"
      }`}
    >
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
      <div className="h-87">
        {" "}
        <MessageBody />
      </div>
    </div>
  );
};

export default ConversationDrawer;
