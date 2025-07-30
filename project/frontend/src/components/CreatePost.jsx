import { useState } from "react";
import API from "../api";
import socket from "../utils/socket";
import { useAuth } from "../context/AuthContext";

const CreatePost = ({ setCreatePost }) => {
const {user}=useAuth();
  const [createPostData, setCreatePostData] = useState({
    title: "",
    description: "",
    type: "",
    location: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCreatePostData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("posts/addpost", createPostData);
      setCreatePost(false);
      if(createPostData.type==="request")
          
      socket.emit("sendNotification",{userId:user._id,location:createPostData.location})

    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 mb-6 space-y-4  max-h-[calc(100vh-12rem)]"
    >

      {/* Title */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={createPostData.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Description</label>
        <input
          name="description"
          value={createPostData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a short description"
          rows={3}
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Type</label>
        <select
          name="type"
          value={createPostData.type}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select type...</option>
          <option value="request">Request</option>
          <option value="offer">Offer</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={createPostData.location}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your location"
        />
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
