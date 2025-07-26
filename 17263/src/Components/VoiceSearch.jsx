// VoiceSearch.js
import { useState } from "react";

const VoiceSearch = ({ onTranscript }) => {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const recognition =
      new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      onTranscript(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
      alert("Voice recognition failed. Try again!");
    };

    recognition.start();
  };

  return (
    <div>
      <button onClick={startListening}>
        🎤 {listening ? "Listening..." : "Start Voice Search"}
      </button>
    </div>
  );
};

export default VoiceSearch;
