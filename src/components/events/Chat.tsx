import React from "react";
import { ChatMessage } from "components/events/service/model/Event";
import { useSelector } from "react-redux";
import { RootState } from "redux/rootReducer";

interface ChatProps {
  chatMessages: Array<ChatMessage>;
}
const Chat = ({ chatMessages }: ChatProps) => {
  const { name } = useSelector((state: RootState) => state.user);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column-reverse",
        overflow: "auto",
      }}
    >
      <div>
        {chatMessages &&
          chatMessages.map((message, index) => (
            <div key={index}>
              {message.senderName !== name ? (
                <div style={{ maxWidth: "70%", width: "auto" }}>
                  <div style={{ display: "flex", fontSize: "12px" }}>
                    {message.senderName}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "5px",
                      backgroundColor: "lightgray",
                      padding: "8px",
                      borderRadius: "20px",
                    }}
                  >
                    <div>{message.message}</div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    marginLeft: "auto",
                    marginBottom: "5px",
                    backgroundColor: "lightblue",
                    padding: "8px",
                    borderRadius: "20px",
                    maxWidth: "70%",
                  }}
                >
                  <div>{message.message}</div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Chat;
