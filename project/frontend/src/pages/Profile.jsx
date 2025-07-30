import { useEffect, useState, useRef } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const [avatar, Setavatar] = useState(null);
    const { user, setUser } = useAuth();
    const [posts, SetPosts] = useState([]);
    const [showPosts, SetShowPosts] = useState(false);
    const fileInputRef = useRef(null);
    const [edit, setEdit] = useState(false);
    const [info, setInfo] = useState({ username: user?.username || "", location: user?.location || "" });

    useEffect(() => {
        if (user) {
            setInfo({ username: user.username || "", location: user.location || "" });
            if (user.avatar && !avatar) {
                Setavatar(user.avatar);
            }
        }
    }, [user]);

    const triggerFileInput = () => fileInputRef.current.click();

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            Setavatar(URL.createObjectURL(file));
            const formData = new FormData();
            formData.append("avatar", file);

            try {
                const res = await API.put("user/update", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                if (res.data.user) setUser(res.data.user);
            } catch (e) {
                console.error("Error uploading avatar: " + e.message);
            }
        }
    };

    const handleEditing = async () => {
        try {
            const res = await API.put("user/update", info);
            setUser(res.data.user);
            setEdit(false);
        } catch (e) {
            console.error("Error updating profile: " + e.message);
        }
    };

    const togglePosts = async () => {
        if (showPosts) {
            SetShowPosts(false);
            SetPosts([]);
        } else {
            try {
                const res = await API.get("posts/singlepostByuser");
                SetPosts(res.data.data);
                SetShowPosts(true);
            } catch (e) {
                console.error(e.message);
                SetPosts([]);
            }
        }
    };

    const handleEditProfile = () => {
        if (!edit && user) setInfo({ username: user.username, location: user.location });
        setEdit((prev) => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`posts/deletepost/${id}`);
            SetPosts((prev) => prev.filter((p) => p._id !== id));
            
        } catch (e) {
            console.error("Delete error: " + e.message);
           
        }
    };

    const handleCompleted = async (id) => {
        try {
            await API.put(`posts/markascomplete/${id}`);
            SetPosts((prev) =>
                prev.map((p) => (p._id === id ? { ...p, status: "completed" } : p))
            );
            
        } catch (e) {
            console.error("Completion error: " + e.message);
           
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-xl text-gray-600 animate-pulse">Loading profile data...</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8
            ${showPosts ? 'overflow-hidden md:overflow-auto' : 'overflow-hidden'}`}>
            <div
                className={`w-full bg-white shadow-2xl rounded-2xl p-6 sm:p-8 border border-gray-100 transform transition-all duration-300 flex flex-col
                ${showPosts
                    ? 'h-[90vh] max-h-[90vh] overflow-hidden md:h-auto md:max-h-none md:max-w-3xl'
                    : 'h-auto max-w-md'
                }
                custom-scrollbar`}
            >
                {/* Avatar + Details */}
                <div className="flex flex-col items-center pb-6 mb-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex-shrink-0 relative mb-4">
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAvatarChange} />
                        <img
                            src={avatar || user.avatar || "https://via.placeholder.com/150/2C3E50/FFFFFF?text=USER"}
                            alt="User Avatar"
                            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-900 shadow-lg ring-4 ring-blue-100 transition-transform duration-300 hover:scale-105"
                        />
                        <button
                            onClick={triggerFileInput}
                            className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 text-xs shadow-md transform translate-x-1/4 translate-y-1/4 transition-colors duration-200"
                            title="Change Avatar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>

                    {!edit ? (
                        <div className="text-center">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                                {user.username}
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-700 font-medium mb-1 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 text-gray-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                {user.email}
                            </p>
                            {user.location && (
                                <p className="text-base sm:text-lg text-gray-600 flex items-center justify-center mt-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2 text-gray-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {user.location}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="text-center w-full px-4">
                            <input
                                type="text"
                                name="username"
                                onChange={handleChange}
                                value={info.username}
                                className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 leading-tight w-full text-center border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                placeholder="Username"
                            />
                             <p className="text-lg sm:text-xl text-gray-700 font-medium mb-1 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 text-gray-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                {user.email}
                            </p>
                            <div className="flex items-center justify-center mt-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 text-gray-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    name="location"
                                    onChange={handleChange}
                                    value={info.location}
                                    className="text-base sm:text-lg text-gray-600 w-full text-center border-b-2 border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 bg-transparent"
                                    placeholder="Add location"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 flex-shrink-0">
                    {edit ? (
                        <button
                            onClick={handleEditing}
                            className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3m-1-4l-3-3m0 0l-4 4m4 0l3-3m0-4l4 4M7 7h.01"></path>
                            </svg>
                            Save Profile
                        </button>
                    ) : (
                        <button
                            onClick={handleEditProfile}
                            className="flex items-center justify-center bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Edit Profile
                        </button>
                    )}

                    <button
                        onClick={togglePosts}
                        className={`flex items-center justify-center mx-auto px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-4 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg
                            ${showPosts ? 'bg-red-600 hover:bg-red-700 focus:ring-red-200' : 'bg-blue-900 hover:bg-blue-800 focus:ring-blue-200'}
                            text-white`}
                    >
                        <svg
                            className="h-5 w-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 11H5m14 0a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2m7 0V5a2 2 0 012-2h2a2 2 0 012 2v6m-7 0H7a2 2 0 00-2 2v2a2 2 0 002 2h4"
                            ></path>
                        </svg>
                        {showPosts ? "Hide Posts" : "View Posts"}
                    </button>
                </div>

                {/* Posts Section - Conditional Rendering and Scrollable Area */}
                {showPosts && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex-grow overflow-y-scroll custom-scrollbar"> {/* Changed mt-8 pt-6 to mt-4 pt-4 */}
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your Posts</h3>
                        {posts.length > 0 ? (
                            <div className="space-y-4 pb-4">
                                {posts.map((post) => (
                                    <div key={post._id} className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-200">
                                        <h4 className="text-xl font-semibold text-blue-800 mb-1">{post.title}</h4>
                                        <p className="text-gray-700 text-sm mb-2">{post.description}</p>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>Type: <span className="font-medium text-blue-700">{post.type}</span></span>
                                            <span>Location: <span className="font-medium text-blue-700">{post.location}</span></span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Created: {new Date(post.createdAt).toLocaleDateString()}</p>

                                        <div className="mt-4 flex space-x-2 justify-end">
                                            <button
                                                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors duration-200"
                                                onClick={() => handleDelete(post._id)}
                                            >
                                                Delete Post
                                            </button>

                                            {post.status !== 'completed' ? (
                                                <button
                                                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-200"
                                                    onClick={() => handleCompleted(post._id)}
                                                >
                                                    Mark Completed
                                                </button>
                                            ) : (
                                                <span className="text-green-700 text-sm font-semibold px-3 py-1 border border-green-300 rounded-md">Completed</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-600 py-4">No posts found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;