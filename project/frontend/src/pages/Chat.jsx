import Inbox from "../components/Inbox";
import Conversation from "../components/Conversation";
import { useEffect, useState } from "react";
import API from "../api";

const Chat = () => {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await API.get("message/inbox");
        if (res.data?.inbox) {
          setInbox(res.data.inbox);
        }
      } catch (error) {
        console.error("Error fetching inbox:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [expanded]);

  const handleSelectPartner = (user) => {
    setPartner(user);
    setExpanded(true);
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* Inbox */}
      {!expanded && (
        <div className="w-full md:w-1/3 lg:w-1/4 border-r bg-white overflow-y-auto">
          <Inbox inbox={inbox} loading={loading} setPartner={handleSelectPartner} />
        </div>
      )}

      {/* Conversation */}
      <div
        className={`h-full transition-all duration-300 ease-in-out relative 
          ${expanded ? "w-full" : "w-full md:w-2/3 lg:w-3/4"}`}
      >
        {expanded && (
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-4 left-4 z-10 bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1 rounded-full text-sm shadow"
          >
            ← Collapse
          </button>
        )}
        <Conversation partner={partner} />
      </div>
    </div>
  );
};

export default Chat;
