import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import getFriends from "@/services/getFriends";
import highlightText from "@/utils/highlightText";
import { Plus, UserIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import createNewConversation from "../services/createNewConversation";

const CreateNewCon = () => {
  const [friends, setFriends] = useState([]); // original list
  const [filteredFriends, setFilteredFriends] = useState([]); // visible list
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const gettingFriends = async () => {
    const data = await getFriends();
    if (data.success) {
      setFriends(data.friends);
      setFilteredFriends(data.friends); // initialize both
    }
    setLoading(false);
  };

  useEffect(() => {
    gettingFriends();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      // if input is empty, restore original list
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((f) =>
        f.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  };

  const CreateNew = async (id) => {
    const data = await createNewConversation(id);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Plus className="w-10 h-10 rounded-full cursor-pointer ring ring-offset-2" />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogCancel className="absolute top-3 right-3">
          <X />
        </AlertDialogCancel>

        <AlertDialogTitle>Find Friends</AlertDialogTitle>

        <div className="w-full space-y-1 overflow-y-scroll scrollbar-hide max-h-40">
          <input
            type="text"
            placeholder="search friends"
            className="w-full h-10 p-2 rounded-2xl outline-none border border-gray-400"
            value={searchQuery}
            onChange={handleSearch}
          />

          {loading ? (
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-full gap-3 px-5 h-15 flex items-center bg-gray-200"
              >
                <p className="w-10 h-10 rounded-full bg-gray-300"></p>
                <p className="w-30 h-5 bg-gray-300"></p>
              </div>
            ))
          ) : filteredFriends.length > 0 ? (
            filteredFriends.map((f) => (
              <div
                onClick={CreateNew(f._id)}
                className="w-full rounded-lg cursor-pointer gap-3 px-5 h-15 flex items-center bg-gray-200"
                key={f._id}
              >
                {f.avatar ? (
                  <img
                    src={f.avatar}
                    alt="user"
                    className="w-10 h-10 rounded-full bg-gray-300"
                  />
                ) : (
                  <UserIcon className="w-10 h-10 rounded-full bg-gray-300" />
                )}
                <p>{highlightText(f.name, searchQuery)}</p>
              </div>
            ))
          ) : (
            <p>no friends</p>
          )}
        </div>

        <AlertDialogCancel>close it</AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateNewCon;
