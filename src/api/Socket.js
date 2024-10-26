/* eslint-disable no-unused-vars */
import io from 'socket.io-client';


// const SOCKET_URL = 'https://4f19-2405-201-201c-810c-8970-376c-9b75-687.ngrok-free.app/'; 
// const SOCKET_URL = 'http://192.168.29.228:8000'
// const SOCKET_URL = 'http://localhost:8000'; 
const SOCKET_URL = 'https://solar-project-9v3q.onrender.com/'
// const SOCKET_URL = 'http://192.168.2.206:8000'

class WSService {
    initializeSocket = async (url) => {
        try {
            this.socket = io(url ? url : SOCKET_URL, {
                transports: ['websocket']
            })

            this.socket.on("connect", (data) => {
                console.log("socket connecteddd");
            })
            this.socket.on("orderAssigned", (data) => {
                console.log("Received orderAssigned:", data);
            });


            this.socket.on("disconnect", (data) => {
                console.log("socket disconnecteddd");
            })

            this.socket.on("error", (data) => {
                console.log("socket error", data);
            })


        } catch (error) {
            console.log("not initialised");
        }
    }

    emit(event, data = {}) {
        this.socket.emit(event, data)
    }
    on(event, cb) {
        this.socket.on(event, cb)
    }
    off(event, cb) {
        this.socket.off(event, cb)
    }
    removeListener(listenerName) {
        this.socket.removeListener(listenerName)
    }
}

const socketServices = new WSService()

export default socketServices;

