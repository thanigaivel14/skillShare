import { useEffect, useState, useRef } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import socket from "../utils/socket";

const Conversation = ({ partner }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const currentUser = user;
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [req, setReq] = useState({
    receiverId: partner,
    content: "",
  });

  // Fetch messages when partner changes
  useEffect(() => {
    if (!partner) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await API.get(`message/getmessage/${partner}`);
        if (res.data?.data) {
          setMessages(res.data.data);
          window.dispatchEvent(new Event("resize"));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [partner]);

  // Handle real-time socket messages
  useEffect(() => {
    const handleIncoming = (incomingMessage) => {
      const partnerId =
        typeof incomingMessage.sender === "object"
          ? incomingMessage.sender._id
          : incomingMessage.sender;

      const receiverId =
        typeof incomingMessage.receiver === "object"
          ? incomingMessage.receiver._id
          : incomingMessage.receiver;

      if (
        partnerId === partner ||
        receiverId === partner
      ) {
        setMessages((prev) => [...prev, incomingMessage]);
      }
    };

    socket.on("receiveMessage", handleIncoming);

    return () => {
      socket.off("receiveMessage", handleIncoming);
    };
  }, [partner]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleChange = (e) => {
    setReq({
      ...req,
      receiverId: partner,
      content: e.target.value,
    });
  };

  const handleSendMessage = async () => {
    if (!req.content.trim()) return;

    try {
      const res = await API.post("message/sendmessage", req);
      const newMessage = res.data.newMessage;
      setReq({ ...req, content: "" });

      socket.emit("sendMessage", {
        receiverId: partner,
        message: newMessage,
      });
       
      // Don't manually update state; socket will emit populated version
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  if (!partner) {
    return (
      <div className="p-4 text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="bg-gray-100 p-4 border-b">
        <h2 className="font-semibold text-lg text-gray-800">
          {partner.username}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet</p>
        ) : (
          messages.map((message) => {
            const senderId =
              typeof message.sender === "object"
                ? message.sender._id
                : message.sender;

            const isSender = senderId === currentUser._id;

            let seen = "";
            if (isSender) {
              seen = message.seen ? "✅" : "✔️";
            }

            return (
              <div
                key={message._id}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-xs md:max-w-md text-sm shadow-sm ${
                    isSender
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <br />
                    {seen}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <input autoFocus
            type="text"
            value={req.content}
            onChange={handleChange}
            placeholder="Type your message..."
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
