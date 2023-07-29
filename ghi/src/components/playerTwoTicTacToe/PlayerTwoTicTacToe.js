import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useCreateGameRecordMutation } from '../../store/Api';
import './TicTacToe.css'


const PlayerTwoTicTacToe = ({ match, gameURL, game, user }) => {
    const [gameState, setGameState] = useState({ "state": "nnnnnnnnn0" });
    const [playerCount, setPlayerCount] = useState(1)
    const playerID = 1
    const client = useRef(null);
    const [linkCopied, setLinkCopied] = useState(false);
    const [draw, setDraw] = useState(false)
    const [win, setWin] = useState(false)
    const [createGameRecord] = useCreateGameRecordMutation()
    const [recordCreated, setRecordCreated] = useState(false);


    useEffect(() => {
        if (match) {
            client.current = new W3CWebSocket('ws://127.0.0.1:8000/ws/TicTacToe/' + match + '/');
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
                    setDraw(dataFromServer.state[10] === "D")
                    setWin(dataFromServer.state[10] === "W")
                }
            };
            // Clean up the connection when the component is unmounted
            return () => {
                client.current.close();
            };
        }
    }, [match]);


    useEffect(() => {
        if (win && !recordCreated && playerID.toString() === gameState.state[9]) {
            createGameRecord({
                game: game,
                user: user,
            });
            setRecordCreated(true);
        }
    })


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
                        disabled={gameState.state[start + i] !== "n" || playerID.toString() !== gameState.state[9] || win}
                        onClick={() => onButtonClicked(start + i)}
                    >
                        {gameState.state[start + i]}
                    </button>
                </td>
            ))}
        </tr>
    );

    const playAgain = () => {
        setRecordCreated(false)
        client.current.send(
            JSON.stringify({
                type: "reset_game_board",
                index: null,
            })
        );
    }

    return (
        <div id='game'>
            {playerCount < 2 ?
                <button onClick={copyToClipboard}>
                    {linkCopied ? "Link copied to clipboard. Waiting for friend to join." : "Invite your friend"}
                </button>
                : (
                    <>
                        {draw &&
                            <>
                                <h1>Draw!</h1>
                                <button onClick={playAgain}>Play Again</button>
                            </>
                        }
                        {win &&
                            <>
                                <h1>{playerID.toString() === gameState.state[9] ? "You won" : "You lost"}</h1>
                                <button onClick={playAgain}>Play Again</button>
                            </>
                        }
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

export default PlayerTwoTicTacToe;
