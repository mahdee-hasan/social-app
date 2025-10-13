import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import getPost from "../services/getPost";
import { useNavigate } from "react-router";
import { useUserStore } from "@/app/store";
import getUser from "@/services/getUser";

const Feed = () => {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const uid = useUserStore((state) => state.userUid);
  const navigate = useNavigate();
  useEffect(() => {
    if (uid) {
      gettingPost();
      loadUser();
    }
  }, [uid]);
  const gettingPost = async () => {
    const data = await getPost();
    if (data.success) {
      setPostData(data.post);
    }
  };

  const loadUser = async () => {
    try {
      const data = await getUser();
      setUser(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto flex flex-row justify-center gap-1 ">
        <div
          className="h-50  duration-100 hover:scale-101  w-40 rounded-2xl ring ring-offset-0"
          onClick={() => navigate(`/user/${uid}`)}
        >
          {user?.avatar ? (
            <img
              src={user?.avatar}
              alt="user"
              className="w-full h-full rounded-2xl object-cover "
            />
          ) : (
            <User className="w-full h-full  duration-100 hover:scale-110" />
          )}
        </div>
        <Button
          className="h-50 w-40 rounded-2xl"
          onClick={() => {
            location.replace("/add-post");
          }}
        >
          <Plus /> add a post
        </Button>
      </div>
      <Post posts={postData} />
    </div>
  );
};

export default Feed;
