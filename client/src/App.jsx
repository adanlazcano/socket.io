import "css/App.css";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { FiSend } from "react-icons/fi";

const socket = io("http://localhost:9001");

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(
    (_) => {
      const chatBox = document.getElementById("box");
      chatBox.scrollTo({
        left: 0,
        top: chatBox.scrollHeight - chatBox.clientHeight,
        behavior: "smooth",
      });

      socket.on("userid", (id) => {
        console.log(id);
      });

      const receiveMessage = (message) => {
        console.log(messages);
        setMessages([
          ...messages,
          { id: nanoid(7), userId: message.userId, message: message.message },
        ]);
      };

      socket.on("message", receiveMessage);

      return (_) => {
        socket.off("userid");
        socket.off("message", receiveMessage);
      };
    },
    [messages]
  );

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.length > 0) {
      socket.emit("message", message);
      setMessages([
        ...messages,
        { id: nanoid(7), userId: "Me", message: message },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form className="bg-zinc-900 p-8 m-4" onSubmit={handleSubmit}>
        <ul id="box" className="h-80 overflow-y-auto mb-6">
          {messages?.map((message) => (
            <li
              className={`p-2 my-3 table text-sm rounded-md ${
                message.userId === "Me" ? "bg-sky-700 ml-auto" : "bg-violet-700"
              }`}
              key={message.id}
            >
              {/* <p>{message.userId !== "Me" ? "Invited" : ""}</p> */}
              <p>{message.message}</p>

              <small
                className="italic flex justify-end"
                style={{ fontSize: "9px" }}
              >
                {`${new Date().toDateString()} ${new Date()
                  .toTimeString()
                  .replace(/GMT.*/, "")}`}
              </small>
            </li>
          ))}
        </ul>

        <div className="flex">
          <input
            autoFocus
            type="text"
            value={message}
            onChange={handleMessage}
            className="border-2 border-zinc-500 p-2 text-black w-full outline-0 border-0 rounded-md rounded-tr-none rounded-br-none"
          />
          <button className="bg-blue-500 px-2 rounded-md rounded-tl-none rounded-bl-none">
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
