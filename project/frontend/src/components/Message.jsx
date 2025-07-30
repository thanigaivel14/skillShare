import { useState } from "react";
import API from "../api";

const Message = ({ post, handleclick }) => {
  const [req, setReq] = useState({
    receiverId: post.user?._id,
    content: "",
    postId: post._id,
  });

  const handleChange = (e) => {
    setReq((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await API.post("message/sendmessage", req);
      setReq((prev) => ({ ...prev, content: "" }));
      handleclick();
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <div className="w-full flex items-center gap-2 p-2 bg-white rounded-lg shadow-md border mt-4">
      <input
        type="text"
        value={req.content}
        onChange={handleChange}
        placeholder="Type your message..."
        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
      >
        Send
      </button>
    </div>
  );
};

export default Message;
