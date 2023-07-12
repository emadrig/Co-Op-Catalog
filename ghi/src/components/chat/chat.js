import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import './chat.css'

const Chat = ({ room, id }) => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const player = id ? 2 : 1
    const client = useRef(null);

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
                sender: player,
            })
        );
        setValue("");
    };

    return (
        <>
            <h1>You are player: {player}</h1>
            <div className='chat-component'>
                <div>
                    <div id='message-area'>
                        Room Name: {room}
                        <table>
                            <tbody>
                                {messages.map((message, index) => (
                                    <tr key={index}>
                                        <td>
                                            Player {message.player}:
                                        </td>
                                        <td>
                                            {message.msg}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
