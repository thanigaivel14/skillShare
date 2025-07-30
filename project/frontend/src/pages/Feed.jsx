import { useAuth } from "../context/AuthContext";
import API from "../api";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";
import CreatePost from "../components/CreatePost";
import socket from "../utils/socket";
const Feed = () => {
  const { user, logout, authReady } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createPost, setCreatePost] = useState(false);
  const[seenotification,setseenotification]=useState(false);
  const navigate = useNavigate();
   const [notifications,setNotifications]=useState([]);
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await API.get("posts/allpost");
        if (res.data?.data && Array.isArray(res.data.data)) {
          const arr = res.data.data.filter((post) => user?._id !== post.user?._id);
          
          setPosts(arr);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (e) {
        console.error("Error fetching posts:", e.message);
        setError(e.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [createPost, user?._id,notifications]);

  // Prevent scroll when createPost is active
  useEffect(() => {
    if (createPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [createPost]);

  useEffect(()=>{
    async function notification(){

      try {
        const res= await API.get("/notifications");
         setNotifications((prev)=>(res.data.notifications));
        } catch (e) {
          console.log(e.message)
        }
      }
      notification();
    },[])
    
    
  socket.on("receiveNotification",async()=>{const res= await API.get("/notifications");
         setNotifications((prev)=>(res.data.notifications));})
         
 const handleSeen=async(id,con)=>{
  try{
    
    if(con==="seen")
     await API.put(`/notifications/${id}`);
    if(con==="delete")
     await API.delete(`/notifications/${id}`);
     
  }
  catch(e){
    console.log(e.message)
  }
  finally{
    {const res= await API.get("/notifications");
         setNotifications((prev)=>(res.data.notifications));}
  }

 }
  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow z-50">
        <h1 className="text-xl font-semibold">Neighborhood SkillShare</h1>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium"><p onClick={() => navigate("/profile")} className="
      text-white-600 hover:text-white-800 
      font-medium cursor-pointer 
      transition-colors duration-200
      px-3 py-1
      rounded-lg
    " >{user?.username}</p></span>
          <span className="inline-block">
            <p
              onClick={() => navigate("/chat")}
              className="
      text-white-600 hover:text-white-800 
      font-medium cursor-pointer 
      transition-colors duration-200
      px-3 py-1
      rounded-lg
    "
            >
              Chat
            </p>
          </span>
          <button onClick={()=>setseenotification((prev)=>!prev)}>🔔<span>{notifications?.length|| 0}</span></button>
         
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
          >
            Log out
          </button>
        </div>
      </nav>

      {/* Sticky CreatePost form */}
      {createPost && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-24 px-4
             transition-all duration-300 ease-out animate-fade-in "
        >

          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative">
            <CreatePost setCreatePost={setCreatePost} />
          </div>
        </div>
      )}


      {/* Feed */}
      <div className={` mt-20 px-4 max-w-2xl mx-auto ${createPost ? "overflow-hidden" : ""}`}>
        {loading ? (
          <p className="text-center text-gray-600">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-600">Error: {error}</p>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostCard post={post} key={post._id} />)
        ) : (
          <p className="text-center text-gray-600">No posts available</p>
        )}
                {seenotification && (
  <div className="fixed top-20 right-4 w-96 max-h-[60vh] overflow-y-auto bg-white text-blue-900 px-6 py-4 rounded-lg shadow-xl z-50 space-y-4 border border-blue-300">
    {notifications?.length > 0 ? (
      notifications.map((notifi) => (
        <div
          key={notifi._id}
          className="bg-blue-50 border border-blue-200 rounded-md p-4 shadow-sm"
        >
         
          <p className =" mb-3 ">{notifi.message}</p>
          <div className="flex gap-3">
            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition" onClick={()=>handleSeen(notifi._id,"seen")}>
              Mark as Seen
            </button>
            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" onClick={()=>handleSeen(notifi._id,"delete")}>
              Delete
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-sm text-center text-gray-500">No notifications</p>
    )}
  </div>
)}


      </div>

      {/* Create Post Button (centered at bottom) */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => setCreatePost((prev) => !prev)}
          className="bg-blue-700 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-800 transition"
        >
          {createPost ? "Cancel" : "Create Post"}
        </button>
      </div>
    </div>
  );
};

export default Feed;
