import { io } from "../../app";
import { Participants } from "../../../types/express";

const onCall = async (participants: Participants) => {
    if(participants.receiver.socketId){
        io.to(participants.receiver.socketId).emit('incomingCall', participants)
    }
}

export default onCall;