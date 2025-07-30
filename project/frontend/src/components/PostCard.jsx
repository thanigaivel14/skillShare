import { useState } from "react";
import Message from "./Message";

const PostCard = ({ post }) => {
  const [messageClick, setMessage] = useState(false);

  const handleClick = () => setMessage((prev) => !prev);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{post.title}</h3>
      <p className="text-sm text-gray-700 mb-2">{post.description}</p>
      
      <div className="text-sm text-gray-600 flex flex-wrap gap-2 mb-3">
        <span>{post.user?.username || "Anonymous"}</span>
        <span>•</span>
        <span className="capitalize">{post.type}</span>
        <span>•</span>
        <span>{post.location}</span>
      </div>

      {/* Message Box */}
      {messageClick && (
        <div className="mb-2">
          <Message post={post} handleclick={handleClick} />
        </div>
      )}

      <div className="text-right">
        <button
          onClick={handleClick}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
        >
          {messageClick ? "Cancel" : "Message"}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
