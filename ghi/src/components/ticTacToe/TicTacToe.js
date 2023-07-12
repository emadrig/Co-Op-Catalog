import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import './TicTacToe.css'


const TicTacToe = ({ id, match, gameURL }) => {
    const [gameState, setGameState] = useState({ "state": "nnnnnnnnn0" });
    const [playerCount, setPlayerCount] = useState(1)
    const playerID = id ? 1 : 0
    const client = useRef(null);
    const [linkCopied, setLinkCopied] = useState(false);


    useEffect(() => {
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
        if (playerID.toString() === gameState.state[9]) {
            client.current.send(
                JSON.stringify({
                    type: "message",
                    index: index,
                })
            );
        } else {
            console.log("It's not your turn.");
        }
    };


    const copyToClipboard = () => {
        navigator.clipboard.writeText(gameURL)
            .then(() => {
                setLinkCopied(true);
                // Send a message to the server indicating the clipboard operation was successful
                client.current.send(
                    JSON.stringify({
                        type: "clipboard_success",
                        index: null
                    })
                );
            })
            .catch((err) => {
                console.error('Async: Could not copy text: ', err);
            });
    };


    const renderRow = (start) => (
        <tr>
            {Array(3).fill().map((_, i) => (
                <td key={start + i}>
                    <button
                        disabled={gameState.state[start + i] !== "n" || playerID.toString() !== gameState.state[9] || gameState.state[10] === "W"}
                        onClick={() => onButtonClicked(start + i)}
                    >
                        {gameState.state[start + i]}
                    </button>
                </td>
            ))}
        </tr>
    );

    return (
        <div id='game'>
            {playerCount < 2 ?
                <button onClick={copyToClipboard}>
                    {linkCopied ? "Link copied to clipboard. Waiting for friend to join." : "Invite your friend"}
                </button>
                : (
                    <>
                        {gameState.state[10] === "W" &&
                            <h1>{playerID.toString() === gameState.state[9] ? "You won" : "You lost"}</h1>}
                        <table>
                            <tbody>
                                {renderRow(0)}
                                {renderRow(3)}
                                {renderRow(6)}
                            </tbody>
                        </table>
                    </>
                )}
        </div>
    );
};

export default TicTacToe;
