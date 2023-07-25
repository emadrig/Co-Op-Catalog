import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useCreateGameRecordMutation } from '../../store/Api';
import './Battleship.css'


const Battleship = ({ id, match, gameURL, game, user }) => {
    const [playerOneBoard, setPlayerOneBoard] = useState(null);
    const [playerTwoBoard, setPlayerTwoBoard] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [playerCount, setPlayerCount] = useState(1)
    const [win, setWin] = useState(false)
    const playerID = id ? 2 : 1
    const client = useRef(null);
    const [linkCopied, setLinkCopied] = useState(false);
    const [createGameRecord] = useCreateGameRecordMutation()
    const [recordCreated, setRecordCreated] = useState(false);

    console.log("currentPlayer: ", currentPlayer);
    console.log('playerID: ', playerID);

    useEffect(() => {
        if (match) {
            client.current = new W3CWebSocket('ws://127.0.0.1:8000/ws/Battleship/' + match + '/');
            client.current.onopen = () => {
                console.log("WebSocket Client Connected for Battleship");
            };
            client.current.onmessage = (message) => {
                const dataFromServer = JSON.parse(message.data);
                console.log('dataFromServer: ', dataFromServer);
                if (dataFromServer) {
                    setPlayerOneBoard(dataFromServer.player_one_board);
                    setPlayerTwoBoard(dataFromServer.player_two_board);
                    setCurrentPlayer(dataFromServer.current_player)
                    setPlayerCount(dataFromServer.count_of_connected_users)
                    setWin(dataFromServer.winner)
                }
            };
            // Clean up the connection when the component is unmounted
            return () => {
                client.current.close();
            };
        }
    }, [match]);


    useEffect(() => {
        if (win && !recordCreated && playerID === currentPlayer) {
            createGameRecord({
                game: game,
                user: user,
            });
            setRecordCreated(true);
        }
    })


    const onButtonClicked = (index) => {
        if (playerID === currentPlayer) {
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


    const playAgain = () => {
        setRecordCreated(false)
        client.current.send(
            JSON.stringify({
                type: "reset_game_board",
                index: null,
            })
        );
    }


    const renderRow = (board, row) => (
        <tr key={row}>
            {[...board[row]].map((cell, i) => (
                <td key={row * 10 + i} className='game-space'>
                    <button
                        disabled={cell !== "n" || playerID !== currentPlayer || win}
                        onClick={() => onButtonClicked(row * 10 + i)}
                        className='game-button'
                    >
                        {cell}
                    </button>
                </td>
            ))}
        </tr>
    );


    return (
        <div id='game'>
            {playerCount < 0 ? // Will need to change the 0 to a 2 later
                <button onClick={copyToClipboard}>
                    {linkCopied ? "Link copied to clipboard. Waiting for friend to join." : "Invite your friend"}
                </button>
                : (
                    <>
                        {win &&
                            <>
                                <h1>{playerID === currentPlayer ? "You won" : "You lost"}</h1>
                                <button onClick={playAgain}>Play Again</button>
                            </>
                        }
                        {playerOneBoard &&
                            <div id='game-boards'>
                                <div className='player-board'>
                                    <h1>Your Board</h1>
                                    <table>
                                        <tbody>
                                            {playerOneBoard.map((row, i) => renderRow(playerOneBoard, i))}
                                        </tbody>
                                    </table>
                                </div >
                                <div className='player-board'>
                                    <h1>Enemy's Board</h1>
                                    <table>
                                        <tbody>
                                            {playerTwoBoard.map((row, i) => renderRow(playerTwoBoard, i))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                    </>
                )
            }
        </div >
    );
};

export default Battleship;
