import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useSelector } from 'react-redux';
import './playerTwoChat.css'

const PlayerTwoChat = ({ room }) => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const player = 2
    const client = useRef(null);
    const messagesEndRef = useRef(null);
    const user = useSelector(state => state.user.value);


    useEffect(() => {
        client.current = new W3CWebSocket('ws://127.0.0.1:8000/ws/' + room + '/');
        client.current.onopen = () => {
            console.log("WebSocket Client Connected for Chat");
        };
        client.current.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            if (dataFromServer) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        msg: dataFromServer.text,
                        player: dataFromServer.sender,
                    },
                ]);
            }
        };
        return () => {
            client.current.close();
        };
    }, [room]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const onButtonClicked = (e) => {
        e.preventDefault();
        client.current.send(
            JSON.stringify({
                type: "message",
                text: value,
                sender: user.first_name,
            })
        );
        setValue("");
    };

    return (
        <>
            <div id='chat-component'>
                <div>
                <div id='message-area'>
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.player === user.first_name ? 'current-user' : ''}`}>
                                <p>{`${message.player}: ${message.msg}`}</p>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
            <form onSubmit={onButtonClicked} id='player-two-form'>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button type="submit">Send Message</button>
            </form>
        </>
    );
};

export default PlayerTwoChat;
