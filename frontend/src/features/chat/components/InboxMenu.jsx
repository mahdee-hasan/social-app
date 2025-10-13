import React from "react";

const InboxMenu = () => {
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
};

export default InboxMenu;
