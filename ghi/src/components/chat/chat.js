import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import './chat.css'

const Chat = () => {
    const [filledForm, setFilledForm] = useState(false);
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const [name, setName] = useState('');
    const [room, setRoom] = useState('test');
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
                        name: dataFromServer.sender,
                    },
                ]);
            }
        };

        // Clean up the connection when the component is unmounted
        return () => {
            client.current.close();
        };
    }, [room]);

    const onButtonClicked = (e) => {
        e.preventDefault();
        client.current.send(
            JSON.stringify({
                type: "message",
                text: value,
                sender: name,
            })
        );
        setValue("");
    };

    return (
        <div className='chat-component'>
            {filledForm ? (
                <div style={{ marginTop: 50 }}>
                    Room Name: {room}
                    <div style={{height: 500, maxHeight: 500, overflow: "auto"}}>
                        {messages.map((message, index) => (
                            <div key={index}>
                                <h3>{message.name}</h3>
                                <p>{message.msg}</p>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={onButtonClicked}>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            ) : (
                <div>
                    <form onSubmit={(e) => { e.preventDefault(); setFilledForm(true) }}>
                        <input
                            type="text"
                            placeholder="Room name"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Sender"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chat;
