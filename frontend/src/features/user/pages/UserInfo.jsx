// import { useEffect, useState } from "react";

import {
  MapPin,
  Calendar,
  Link,
  Camera,
  UserPlus,
  Mail,
  User2,
} from "lucide-react";
import { useEffect, useState } from "react";
import AboutUser from "@/components/AboutUser";
import Post from "@/components/Post";
import getUser from "@/services/getUser";
import FriendList from "@/components/FriendList";
import getOtherUser from "@/services/getOtherUser";
import { useParams } from "react-router";

const navItem = [
  { sr: 1, name: "post" },
  { sr: 2, name: "about" },
  { sr: 3, name: "friends" },
];
const UserInfo = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { uid } = useParams();
  const loadUser = async () => {
    const data = await getOtherUser(uid);
    if (data.success) {
      setUser(data.user);
    }
  };

  useEffect(() => {
    loadUser();
  }, [uid]);

  const renderContent = () => {
    switch (activeTab) {
      case "friends":
        return <FriendList uid={uid} />;

      case "about":
        return <AboutUser />;
      default:
        return <Post />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header with Cover Photo */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-80 max-w-3xl mx-auto bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
          {user?.cover && (
            <img
              src={user.cover}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <button className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-lg transition-all">
            <Camera size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <User2 className="w-32 h-32 rounded-full bg-gray-200 ring-2" />
            )}

            {user?.active && (
              <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 pb-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user?.name}
          </h1>
          <p className="text-gray-600 mb-4">{user?.email}</p>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6 leading-relaxed">
            {user?.bio}
          </p>

          <div className="flex items-center justify-center gap-8 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              {user?.location}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {user?.dob}
            </div>
            <div className="flex items-center gap-1">
              <Link size={16} />
              <a href="#" className="text-blue-600 hover:underline">
                {user?.email}
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">1,234</div>
              <div className="text-gray-600 text-sm">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">12.5K</div>
              <div className="text-gray-600 text-sm">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">2,847</div>
              <div className="text-gray-600 text-sm">Following</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <UserPlus size={16} />
              Follow
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2">
              <Mail size={16} />
              Message
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            {navItem.map((item) => (
              <button
                key={item.sr}
                onClick={() => setActiveTab(item.name)}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === item.name
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default UserInfo;
