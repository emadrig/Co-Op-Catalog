import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useCreateGameRecordMutation } from '../../store/Api';
import './Battleship.css'


const PlayerTwoBattleship = ({ match, gameURL, game, user }) => {
    const [playerOneBoard, setPlayerOneBoard] = useState(null);
    const [playerTwoBoard, setPlayerTwoBoard] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [playerCount, setPlayerCount] = useState(1)
    const [win, setWin] = useState(false)
    const playerID = 2
    const client = useRef(null);
    const [linkCopied, setLinkCopied] = useState(false);
    const [createGameRecord] = useCreateGameRecordMutation()
    const [recordCreated, setRecordCreated] = useState(false);
    const [playerOneCount, setPlayerOneCount] = useState({ 'A': 0, 'B': 1, 'C': 2, 'D': 2, 'E': 3, 'sunk': 0 })
    const [playerTwoCount, setplayerTwoCount] = useState({ 'A': 0, 'B': 1, 'C': 2, 'D': 2, 'E': 3, 'sunk': 0 })


    console.log('playerOneCount: ', playerOneCount);
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
                    setPlayerOneCount(dataFromServer.player_one_count)
                    setplayerTwoCount(dataFromServer.player_two_count)
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
        if (playerID === currentPlayer) { //Will need to check if it's the player's turn or not
            client.current.send(
                JSON.stringify({
                    type: "move",
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


    const cellStyling = (cell, whoseBoard) => {
        if (whoseBoard === 'your-board') {
            if (cell === ' ') {
                return 'ocean'
            }else if (cell === 'm') {
                return 'miss'
            } else if (cell === cell.toLowerCase() && playerTwoCount[cell.toUpperCase()] >= 5) {
                return 'destroyed'
            }  else if (cell === cell.toLowerCase() && cell !== '.') {
                return 'hit'
            } else if (cell !== ' ' && cell.match(/[A-Z]/i) && cell !== cell.toLowerCase()) {
                return 'ship'
            }
        } else {
            if (cell !== cell.toLowerCase() || cell === ' ') {
                return 'ocean'
            } else if (cell === 'm') {
                return 'miss'
            } else if (cell === cell.toLowerCase() && playerOneCount[cell.toUpperCase()] >= 5) {
                return 'destroyed'
            } else if (cell === cell.toLowerCase() && cell !== 'm') {
                return 'hit'
            } else if (cell !== ' ' && cell.match(/[A-Z]/i) && cell !== cell.toLowerCase()) {
                return 'ship'
            }
        }

    }


    const renderRow = (board, row, whoseBoard) => {
        if (true) {
            return (
                <tr key={row}>
                    {[...board[row]].map((cell, i) => (
                        <td key={row * 10 + i} className='game-space'>
                            <div
                                disabled={playerID !== currentPlayer || win}
                                onClick={() => onButtonClicked(row * 10 + i)}
                                className={cellStyling(cell, whoseBoard)}
                            >
                                {/* {cell} */}
                            </div>
                        </td>
                    ))}
                </tr>
            )
        }
    };


    return (
        <div id='game'>
            {playerCount < 2 ?
                <button onClick={copyToClipboard}>
                    {linkCopied ? "Link copied to clipboard. Waiting for friend to join." : "Invite your friend"}
                </button>
                : (
                    <>
                        {win &&
                            <>
                                <h1>{playerID === currentPlayer ? "You Lost" : "You Won"}</h1>
                                <button onClick={playAgain}>Play Again</button>
                            </>
                        }
                        {playerID === currentPlayer ?
                            <p>Your Turn</p>
                            :
                            <p>Not your turn</p>
                        }
                        <div id='game-boards'>
                            <div className='player-board'>
                                {playerID === 1 ?
                                    <h1>Your Board</h1>
                                    :
                                    <h1>Enemy Board</h1>
                                }
                                <table>
                                    <tbody>
                                        {playerOneBoard &&
                                            playerOneBoard.map((row, i) => renderRow(playerOneBoard, i, 'enemy-board'))}
                                    </tbody>
                                </table>
                            </div >
                            <div className='player-board'>
                                {playerID === 1 ?
                                    <h1>Enemy Board</h1>
                                    :
                                    <h1>Your Board</h1>
                                }
                                <table>
                                    <tbody>
                                        {playerTwoBoard &&
                                            playerTwoBoard.map((row, i) => renderRow(playerTwoBoard, i, 'your-board'))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )
            }
        </div >
    );
};

export default PlayerTwoBattleship;
