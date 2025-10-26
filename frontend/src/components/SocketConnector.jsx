import React, { useEffect } from "react";

import socket from "@/app/socket";
import { useUserStore } from "@/app/store";

const SocketConnector = () => {
  const userOid = useUserStore((state) => state.userObjectId);

  useEffect(() => {
    if (userOid) {
      socket.io.opts.query = { userOid };
      socket.connect();

      socket.on("connect", () => {
        //
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected");
      });
    }

    // optional cleanup
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [userOid]);

  return null;
};

export default SocketConnector;
