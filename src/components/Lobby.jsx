import { useState, useEffect} from 'react'
import io from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react'; 
const socket = io.connect(import.meta.env.VITE_BE_SOCKET);

function Lobby() {
    
}

export default Lobby