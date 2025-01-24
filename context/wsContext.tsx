// create ws context api

import { createContext, useState, useEffect, useRef } from "react";
import apiClient from "./axiosInstance";

interface WsContextType {
    socket: WebSocket | null;
    connect: () => void;
    disconnect: () => void;
    send: (message: string) => void;
    receive: (message: string) => void;
}

export const WsProvider = ({ children }: any) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const connect = () => {

    };

    const disconnect = () => {

    };
}

export const WsContext = createContext<WsContextType | null>(null);
