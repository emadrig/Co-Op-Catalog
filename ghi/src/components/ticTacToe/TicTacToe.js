import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const TicTacToe = () => {
    const [gameState, setGameState] = useState({ "state": "nnnnnnnnn0" });
    const [playerCount, setPlayerCount] = useState(1)
    const [match, setMatch] = useState(null)
    const { id } = useParams()
    const [gameURL, setGameURL] = useState()
    const client = useRef(null);
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        if (id == undefined) {
            fetch('http://localhost:8000/tictactoe-match/', { method: "POST" })
                .then(res => res.json())
                .then(data => {
                    setMatch(data['id'])
                    setGameURL(`http://localhost:3000/play/Tic%20Tac%20Toe/${data['id']}`)
                })
        }
    }, [])


    useEffect(() => {
        if (id) {
            setMatch(id)
        }
        if (match) {
            client.current = new W3CWebSocket('ws://127.0.0.1:8000/ws/tic_tac_toe/' + match + '/');
            client.current.onopen = () => {
                console.log("WebSocket Client Connected for TicTacToe");
            };
            client.current.onmessage = (message) => {
                const dataFromServer = JSON.parse(message.data);
                if (dataFromServer) {
                    setGameState({
                        state: dataFromServer.state,
                    });
                    setPlayerCount(dataFromServer.count_of_connected_users)
                }
            };
            // Clean up the connection when the component is unmounted
            return () => {
                client.current.close();
            };
        }
    }, [match]);

    const onButtonClicked = (index) => {
        client.current.send(
            JSON.stringify({
                type: "message",
                index: index,
            })
        );
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(gameURL)
            .then(() => {
                setLinkCopied(true);
            })
            .catch((err) => {
                console.error('Async: Could not copy text: ', err);
            });
    };

    console.log(playerCount);

    return (
        <>
            {playerCount < 2 ?
                <button onClick={copyToClipboard}>
                    {linkCopied ? "Link copied to clipboard" : "Invite your friend"}
                </button>
                : (
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <button onClick={() => { onButtonClicked(0) }}>{gameState.state[0]}</button>
                                </td>
                                <td>
                                    <button onClick={() => { onButtonClicked(1) }}>{gameState.state[1]}</button>
                                </td>
                                <td>
                                    <button onClick={() => { onButtonClicked(2) }}>{gameState.state[2]}</button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button onClick={() => { onButtonClicked(3) }}>{gameState.state[3]}</button>
                                </td>
                                <td>
                                    <button onClick={() => { onButtonClicked(4) }}>{gameState.state[4]}</button>
                                </td>
                                <td>
                                    <button onClick={() => { onButtonClicked(5) }}>{gameState.state[5]}</button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button onClick={() => { onButtonClicked(6) }}>{gameState.state[6]}</button>
                                </td>
                                <td>
                                    <button onClick={() => { onButtonClicked(7) }}>{gameState.state[7]}</button>
                                </td>
                                <td>
                                    <button onClick={() => { onButtonClicked(8) }}>{gameState.state[8]}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
        </>
    );
};

export default TicTacToe;
