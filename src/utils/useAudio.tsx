import React, { useEffect, useState } from "react";

const useAudio = (url: string) => {
  const audio = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, );

  return [playing, toggle];
};

export default function App() {
  const [playing, toggle] = useAudio(
    "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3"
  );

  return (
    <div>
      <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
    </div>
  );
}