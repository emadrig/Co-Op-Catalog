import { useParams } from "react-router-dom";
import { useGetGameDetailsQuery } from "../../store/Api";
import { useState, useEffect } from "react";
import './PlayGamePage.css'
import Chat from "../chat/chat";
import TicTacToe from "../ticTacToe/TicTacToe";



function PlayGamePage() {
    const { gameName, id } = useParams()
    const { data: game, isLoading } = useGetGameDetailsQuery(gameName)
    const [gameURL, setGameURL] = useState()
    const [match, setMatch] = useState(null)
    const [props, setProps] = useState({ "id": id })

    useEffect(() => {
        if (id === undefined) {
            fetch('http://localhost:8000/tictactoe-match/', { method: "POST" })
                .then(res => res.json())
                .then(data => {
                    const newMatch = data['id'];
                    const newGameURL = `http://localhost:3000/play/Tic%20Tac%20Toe/${data['id']}`;
                    setMatch(newMatch);
                    setGameURL(newGameURL);
                    setProps({
                        "id": id,
                        "match": newMatch,
                        "gameURL": newGameURL,
                        "setMatch": setMatch
                    })
                })
        } else {
            setProps({
                "id": id,
                "match": id,
            })
        }
    }, [])


    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    } else {
        return (
            <>
                <div className="play-games-page">
                    <h1>{game.name}</h1>
                    <div id="game-area">
                        <TicTacToe id={props.id} match={props.match} gameURL={props.gameURL} />
                    </div>
                    <div>{game.description}</div>
                    <div>{game.rules}</div>
                    <Chat room={props.match} id={props.id} />
                </div>
            </>
        )
    }
}

export default PlayGamePage