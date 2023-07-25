import { useParams } from "react-router-dom";
import { useGetGameDetailsQuery } from "../../store/Api";
import { useState, useEffect } from "react";
import './PlayGamePage.css'
import Chat from "../chat/chat";
import TicTacToe from "../ticTacToe/TicTacToe";
import Battleship from "../battleship/Battleship";
import jwt_decode from "jwt-decode"
import { useSelector } from 'react-redux';


function PlayGamePage() {
    const { gameName, id } = useParams()
    const { data: game, isLoading } = useGetGameDetailsQuery(gameName)
    const [gameURL, setGameURL] = useState()
    const [match, setMatch] = useState(null)
    const [props, setProps] = useState({ "id": id })
    const token = useSelector(state => state.token)
    const user = jwt_decode(token).user_id


    const componentMap = {
        'TicTacToe': TicTacToe,
        'Battleship': Battleship,
    };

    const GameComponent = componentMap[gameName];


    useEffect(() => {
        if (id === undefined) {
            fetch(`http://localhost:8000/${gameName}-match/`, {method: "POST"})
                .then(res => res.json())
                .then(data => {
                    const newMatch = data['id'];
                    const newGameURL = `http://localhost:3000/play/${gameName}/${data['id']}`;
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

                    <div id="play-game-area">
                        <GameComponent id={props.id} match={props.match} gameURL={props.gameURL} game={game['id']} user={user} />
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