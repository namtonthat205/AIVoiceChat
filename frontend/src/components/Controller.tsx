import { useState, useCallback } from "react";
import Title from "./Title";
import RecordMessage from "./RecordMessage";
import axios from "axios";
import { debounce } from "lodash";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Controller = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // New state for tracking playback
  const [messages, setMessages] = useState<any[]>([]);

  function createBlobURL(data: any) {
    const blob = new Blob([data], { type: "audio/wav" });
    const url = window.URL.createObjectURL(blob);
    return url;
  }

  const handleStop = useCallback(
    debounce(async (blobUrl: string) => {
      if (isLoading) return;
      setIsLoading(true);

      // Append recorded message to messages
      const myMessage = { sender: "me", blobUrl };
      
      // Convert blob URL to blob object
      fetch(blobUrl)
        .then((res) => res.blob())
        .then(async (blob) => {
          // Construct audio to send file
          const formData = new FormData();
          formData.append("file", blob, "myFile.wav");

          // Send form data to API endpoint
          await axios
            .post("http://localhost:8000/post-audio/", formData, {
              headers: {
                "Content-Type": "audio/wav",
              },
              responseType: "arraybuffer", // Set the response type to handle binary data
            })
            .then((res: any) => {
              const blob = res.data;
              const audio = new Audio();
              audio.src = createBlobURL(blob);

              // Append AI message and update state in a functional way
              const aiMessage = { sender: "jessica", blobUrl: audio.src };
              setMessages((prevMessages) => [...prevMessages, myMessage, aiMessage]);

              // Play audio
              audio.play();
              audio.onplay = () => setIsPlaying(true); // Stop loading animation when audio starts
              audio.onended = () => setIsPlaying(false); // Hide loading animation when audio ends
            })
            .catch((err: any) => {
              console.error(err);
            })
            .finally(() => {
              setIsLoading(false);
            });
        });
    }, 500), // Adjust the debounce delay as needed
    [isLoading] // Dependencies
  );

  return (
    <div className="h-screen w-full overflow-y-hidden">
      {/* Title */}
      <Title setMessages={setMessages} />

      <div className="flex flex-col justify-between w-full h-full overflow-y-scroll pb-96">
        {/* Conversation */}

        {isPlaying && (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-75 z-50">
              {/* Lottie Animation */}
              <DotLottieReact src = "./linesoundwave.json" loop autoplay style={{ width: '400px', height: '400px' }}/>
              
              {/*<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><circle fill='none' stroke-opacity='1' stroke='#fff' stroke-width='.5' cx='100' cy='100' r='0'><animate attributeName='r' calcMode='spline' dur='2' values='1;80' keyTimes='0;1' keySplines='0 .2 .5 1' repeatCount='indefinite'></animate><animate attributeName='stroke-width' calcMode='spline' dur='2' values='0;25' keyTimes='0;1' keySplines='0 .2 .5 1' repeatCount='indefinite'></animate><animate attributeName='stroke-opacity' calcMode='spline' dur='2' values='1;0' keyTimes='0;1' keySplines='0 .2 .5 1' repeatCount='indefinite'></animate></circle></svg>*/}
            </div>
          )}

        <div className="mt-5 px-8">
          {messages?.map((audio, index) => {
            return (
              <div
                key={index + audio.sender}
                className={
                  "flex flex-col " +
                  (audio.sender === "jessica" ? "items-end" : "")
                }
              >

                {/* Sender */}
                <div className="mt-4 ">
                  <p
                    className={
                      audio.sender === "jessica"
                        ? "text-right mr-2  text-white font-bold shadow"
                        : "ml-2 italic text-white font-bold shadow"
                    }
                  >
                    {audio.sender}
                  </p>

                  {/* Message */}
                  <audio src={audio.blobUrl} className="appearance-none" controls />
                </div>
              </div>
            );
          })}

          {messages.length === 0 && !isLoading && (
            <div className="text-center italic mt-10 text-white font-bold shadow">
              Send Jessica a message...
            </div>
          )}

          {isLoading && (
            <div className="text-center font-light italic mt-10 animate-pulse">
              <DotLottieReact className="fixed inset-0 flex items-center justify-center bg-opacity-75 z-50" src= "./loading1.json" loop autoplay style={{ width: '40px', height: '40px' }}/>
            </div>
          )}
        </div>

        </div>
        

        {/* Recorder */}
        <div className="fixed bottom-0 w-full py-6 text-center">
          <div className="flex justify-center items-center w-full">
            <div>
              <RecordMessage handleStop={handleStop} isDisabled={isPlaying} />
            </div>
          </div>
        </div>
      </div>
  );
};

export default Controller;
