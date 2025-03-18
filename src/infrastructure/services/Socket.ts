import { Server } from "socket.io";
import { SocketGateway } from '../../interfaces/socket/socketGateway'
import dotenv from 'dotenv';
dotenv.config();

export const setupSocket = (server: any): Server => {
    const io = new Server(server, {
        cors: {
            origin: `${process.env.CLIENT_BASE_URL}`,  // Allow your React app's origin
            methods: ['GET', 'POST'],
            credentials: true, // Enable credentials to be sent with the request
        },
    });

    new SocketGateway(io);
    return io;
};
