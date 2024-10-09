import {ReactMediaRecorder} from "react-media-recorder"
import RecordIcon from "./RecordIcon"

type Props = {
    handleStop : any;
    isDisabled?: boolean;

    
}

const RecordMessage = ({handleStop, isDisabled}: Props) => {
  return (
    <ReactMediaRecorder 
        audio
        onStop = {handleStop}
        
        render = {({status, startRecording, stopRecording}) => 
            (<div className="mt-2"> 
            <button
            onMouseDown={() => {
              if (!isDisabled) startRecording();
            }}
            onMouseUp={() => {
              if (!isDisabled) stopRecording();
            }}
            className={`bg-white p-4 rounded-full ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isDisabled} // Disable button to prevent clicks
          >
            <RecordIcon
              classText={
                status === "recording"
                  ? "animate-pulse text-red-500"
                  : "text-sky-500"
              }
            />
          </button>
            </div>)}
    />
  )
}

export default RecordMessage