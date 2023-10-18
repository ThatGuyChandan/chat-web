import React, { useEffect, useState } from "react";

function Content() {
  const [ws, setWs] = useState(null);
  const [onlineFriend, setOnlineFriend] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");

    socket.addEventListener("message", handleMessage);
    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);
  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlineFriend(people);
  }
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
  }
  return (
    <div className="chatbox">
      <div className="friendList">
        <h4>Contacts-</h4>
        <div>
          {" "}
          {Object.keys(onlineFriend).map((userId) => (
            <div className="user" onClick={() => setSelectedUserId(userId)}>
              {onlineFriend[userId]}
            </div>
          ))}
        </div>
      </div>
      <div className="chat">
        <div className="msgBox"></div>
        <div className="msg">
          <input placeholder="type...." type="text" />
          <button className="sendBtn">send </button>
        </div>
      </div>
    </div>
  );
}

export default Content;
