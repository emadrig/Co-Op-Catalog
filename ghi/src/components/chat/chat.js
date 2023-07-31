import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useSelector } from 'react-redux';
import './chat.css'

const Chat = ({ room }) => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const player = 1
    const client = useRef(null);
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

    const onButtonClicked = (e) => {
        e.preventDefault();
        console.log(e.value);
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
            <h1>You are player: {player}</h1>
            <div id='chat-component'>
                <div>
                    <div id='message-area'>
                        Chat with your friend here:
                        {messages.map((message, index) => (
                            <div key={index} className='message'>
                                <p>{`${message.player}: ${message.msg}`}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <form onSubmit={onButtonClicked} id='form'>
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

export default Chat;
