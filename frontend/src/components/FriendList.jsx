import getFriends from "@/services/getFriends";
import { MessageCircle, User2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  const gettingFriends = async () => {
    const res = await getFriends();

    if (res.success) {
      setFriends(res.friends);
    }
  };
  useEffect(() => {
    gettingFriends();
  }, []);

  return (
    <div>
      {friends.length > 0 ? (
        friends.map((f) => (
          <div
            className="flex w-full items-center px-10 p-2 rounded-lg bg-white justify-between shadow-2xl"
            key={f._id}
          >
            <div
              className="flex gap-5 cursor-pointer items-center"
              onClick={() => {
                navigate(`/user-info/${f.uid}`);
                console.log(f.uid);
              }}
            >
              {f.avatar ? (
                <img
                  src={f.avatar}
                  alt="friends"
                  className="w-13 h-13 rounded-full "
                />
              ) : (
                <User2 className="w-13 h-13 bg-gray-100 rounded-full ring-2 " />
              )}
              <p className="text-lg font-bold">{f.name}</p>
            </div>

            <Button>
              <MessageCircle /> message
            </Button>
          </div>
        ))
      ) : (
        <p>no friends</p>
      )}
      <div></div>
    </div>
  );
};

export default FriendList;
