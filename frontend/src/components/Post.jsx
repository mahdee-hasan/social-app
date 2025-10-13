import { format } from "date-fns";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  User,
} from "lucide-react";

export default function Post({ posts }) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {posts?.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt="Alexandra"
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
              ) : (
                <User className="w-12 h-12 rounded-full ring ring-offset-0" />
              )}

              <div>
                <h3 className="font-semibold text-gray-800">
                  {post.author.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  {format(post.createdAt, "dd-MM-yy")}
                </p>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal size={20} className="text-gray-500" />
            </button>
          </div>
          {post.text && (
            <p className="text-gray-800 mb-4 leading-relaxed">
              {post.text || "post text"}
            </p>
          )}

          {post?.images?.length > 0 && (
            <div className="mb-4 rounded-lg overflow-hidden">
              {post?.images?.map((image) => {
                return (
                  <img
                    key={image.public_id}
                    src={image.url}
                    alt="Post text"
                    className="max-w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group">
                <Heart
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-sm">{post.likes || "0"}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors group">
                <MessageCircle
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-sm">{post.comments || "0"}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors group">
                <Share2
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-sm">{post.shares || "0"}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
