import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
    if (!socket) {
        // Initialize the socket connection if it doesn't exist
        socket = io(import.meta.env.VITE_BE_SOCKET, {
            autoConnect: true, 
            reconnection: true, 
        });
        console.log("New socket connection created:", socket.id);
    } else {
        console.log("Reusing existing socket connection:", socket.id);
    }
    return socket;
};
