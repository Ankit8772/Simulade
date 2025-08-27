import { useState } from "react";
import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { CallLobby } from "./call-lobby";
import { CallEnded } from "./call-ended";
import { CallActive } from "./call-active";

interface Props{
    meetingName:string;
};

export const CallUI = ({meetingName}:Props) => {
    const call = useCall();
    const [show,setShow] = useState<"lobby" | "call" | "ended">("lobby");

    const handleJoinCall = async() => {
        if(!call) return;

        await call.join();

        setShow("call");
    };

    const handleLeaveCall = () => {
        if(!call) return;

        call.endCall();
        setShow("ended");
    };
    return(
        <StreamTheme className="h-full">
            {show === "lobby" && 
            <CallLobby onJoin={handleJoinCall}/>}
            {show === "call" && <CallActive onLeave={handleLeaveCall} meetingName={meetingName}/>
            }
            {show === "ended" &&  <CallEnded />}
        </StreamTheme>
    )
};