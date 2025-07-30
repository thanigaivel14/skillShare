const Inbox = ({ inbox, loading,setPartner }) => {
  if (loading) {
    return (
      <div className="w-full md:w-1/3 h-screen overflow-y-auto bg-white border-r border-gray-300 p-4">
        <p className="text-center text-gray-600">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/3 h-screen overflow-y-auto bg-white border-r border-gray-300 p-4">
      <h1 className="text-xl font-semibold text-blue-800 mb-4 ">Inbox</h1>

      {inbox.length === 0 ? (
        <p className="text-gray-600 text-center">No messages found</p>
      ) : (
        inbox.map((chat) => (
          <div
            key={chat.partnerId}
            className={`mb-3 p-4 rounded-lg shadow-sm cursor-pointer border 
              ${
                chat.seen
                  ? "bg-grey-100 hover:bg-gray-200"
                  : "bg-blue-100 border-l-4 border-blue-600 hover:bg-blue-200"
              }`}
           onClick={()=>setPartner(chat.partnerId)}>
            <h2 className="text-lg font-medium text-gray-800">
              {chat.partnerName}
            </h2>
            <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>

          </div>
        ))
      )}
    </div>
  );
};

export default Inbox;
