import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaCheckCircle, FaCopy, FaSearch, FaShareAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoPersonCircle } from "react-icons/io5";
import timeAgo from "@/hooks/timeAgo";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { MdContentCopy } from "react-icons/md";
import { Input } from "../ui/input";
import useChatStore from "@/stores/chatStore";
import useAuthStore from "@/stores/useAuthStore";
import highlightText from "@/utils/highlightText";

const PostSharingDrawer = ({ postId }) => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchName, setSearchName] = useState("");
  const timeoutRef = useRef(null);
  const setMsg = useChatStore((s) => s.setPopUpMessage);
  const [queryValue, setQueryValue] = useState("");

  const { bearerToken } = useAuthStore.getState();
  useEffect(() => {
    getFriends();
  }, []);
  const getFriends = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/friends`,
        {
          credentials: "include",
          headers: {
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "error finding your friends");
      }
      setFriends(data.friends);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setQueryValue(e.target.value);
    // Clear previous timeout
    clearTimeout(timeoutRef.current);

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      (async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/inbox/searchUser?from=share`,
            {
              method: "POST",
              body: JSON.stringify({ user: value }),
              headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${bearerToken}`,
              },
              credentials: "include",
            }
          );
          if (!res.ok) {
            throw new Error("Failed to fetch the user data");
          }

          const usersData = await res.json();
          setFriends(usersData);
          console.log(usersData);
        } catch (error) {
          console.error(error.message || "Something went wrong");
          setMsg(error.message || "Something went wrong");
        }
      })();
    }, 500);
  };

  return (
    <Drawer className="p-2">
      <DrawerTrigger className="flex gap-2 cursor-pointer items-center">
        <FaShareAlt /> share
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>SHARE THE POST</DrawerTitle>
          <DrawerDescription>select your friends</DrawerDescription>
        </DrawerHeader>
        <div className="w-[90%] mx-auto my-2 relative ">
          <Input
            type="text"
            className="w-full"
            placeholder="search friends"
            onChange={handleSearch}
          />{" "}
          <FaSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 " />
        </div>
        {friends.length > 0 ? (
          <Swiper
            spaceBetween={5}
            slidesPerView={"auto"}
            freeMode
            className="cursor-grab mx-auto max-w-[90%]"
          >
            {friends?.map((u) => (
              <SwiperSlide
                key={u._id}
                style={{ width: "56px", height: "70px" }}
                className="relative cursor-pointer"
                onClick={() => {
                  if (selectedFriends.includes(u._id)) {
                    setSelectedFriends((prev) =>
                      prev.filter((f) => f !== u._id)
                    );
                  } else {
                    setSelectedFriends((prev) => [...prev, u._id]);
                  }
                }}
              >
                {u.avatar ? (
                  <img
                    src={u.avatar}
                    className="w-12 ml-1 mt-1 h-12 ring rounded-full object-cover"
                    alt="user"
                  />
                ) : (
                  <IoPersonCircle className="text-[48px] ml-1 mt-1 rounded-full ring" />
                )}
                <p className="text-[8px] truncate text-center">
                  {highlightText(u.name, queryValue)}
                </p>
                {selectedFriends.includes(u._id) && (
                  <div className="absolute z-100 right-0 top-8 bg-white rounded-full ">
                    <FaCheckCircle className="text-sky-400 text-[20px] " />
                  </div>
                )}
                {u.active ? (
                  <div className="absolute right-1 bottom-4">
                    <span className="relative flex size-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-green-600"></span>
                    </span>
                  </div>
                ) : (
                  <div className="absolute text-[7px] max-w-12 bg-white ring-[0.5px] text-black rounded-full right-1 ring-green-400 bottom-4">
                    <p className="justify-self-center truncate my-auto text-shadow-2xs">
                      {timeAgo(u.updatedAt)}
                    </p>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-[90%] mx-auto text-gray-700 font-extrabold text-center">
            no friends found
          </div>
        )}
        <div className="flex w-[90%] mx-auto h-15 items-center  justify-between">
          {" "}
          <p
            className="w-[95%] rounded-2xl p-2 px-4 ring ring-gray-300
           bg-gray-200 text-gray-700 truncate"
          >{`${import.meta.env.VITE_APP_URL}/post-details/${postId}`}</p>{" "}
          <Tooltip className="w-[5%]">
            <TooltipTrigger
              className="rounded-2xl p-2 px-4 ring cursor-pointer ring-gray-300 text-gray-700"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `${import.meta.env.VITE_APP_URL}/post-details/${postId}`
                );
                setIsCopied(true);
              }}
            >
              <MdContentCopy />
            </TooltipTrigger>
            <TooltipContent>{isCopied ? "copied" : "copy url"}</TooltipContent>
          </Tooltip>{" "}
        </div>{" "}
        <DrawerFooter>
          <div className="w-[90%] mx-auto flex items-center justify-around px-10 ">
            {" "}
            <Button
              className="cursor-pointer w-1/3"
              disabled={!selectedFriends.length}
            >
              send
            </Button>
            <DrawerClose className="w-1/3 ring-1 hover:bg-gray-200 cursor-pointer p-1 rounded-md ring-gray-500 ring-offset-0 ">
              cancel
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PostSharingDrawer;
