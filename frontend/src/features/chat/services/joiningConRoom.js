import socket from "@/app/socket";
import { useChatStore, useUserStore } from "@/app/store";

const joiningConRoom = (id) => {
  const { currentConRoom } = useChatStore.getState();
  const { userObjectId } = useUserStore.getState();

  // Leave previous room (if exists)
  if (currentConRoom) {
    socket.emit("leave_room", { roomId: currentConRoom, userId: userObjectId });
  }

  // Join new room
  socket.emit("join_room", { roomId: id, userId: userObjectId });

  // Update store
  useChatStore.setState({ currentConRoom: id });
};

export default joiningConRoom;
