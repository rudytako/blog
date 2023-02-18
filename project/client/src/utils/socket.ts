import io from "socket.io-client";

export const socket = io();

socket.on('connect', () => {
    console.log(socket.id)
})
socket.close()