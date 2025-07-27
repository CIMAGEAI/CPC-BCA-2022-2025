import VoiceSearch from "./VoiceSearch";
import axios from "axios";
import { useState } from "react";

const Chat = () => {
  const [response, setResponse] = useState("");

  const handleVoice = async (text) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/chat/", {
        question: text,
      });
      setResponse(res.data.answer);
    } catch (err) {
      setResponse("Something went wrong.");
    }
  };

  return (
    <div>
      <VoiceSearch onTranscript={handleVoice} />
      <p>
        <strong>AI Answer:</strong> {response}
      </p>
    </div>
  );
};

export default Chat;
