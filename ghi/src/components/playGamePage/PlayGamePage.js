import { useParams } from "react-router-dom";
import { useGetGameDetailsQuery } from "../../store/Api";
import { useState, useEffect } from "react";
import Chat from "../chat/chat";
import TicTacToe from "../ticTacToe/TicTacToe";
import Battleship from "../battleship/Battleship";
import jwt_decode from "jwt-decode"
import { useSelector } from 'react-redux';
import './PlayGamePage.css'


function PlayGamePage() {
    const { gameName } = useParams()
    const { data: game, isLoading } = useGetGameDetailsQuery(gameName)
    const [gameURL, setGameURL] = useState()
    const [match, setMatch] = useState(null)
    const [props, setProps] = useState({ "id": undefined })
    const token = useSelector(state => state.token)
    const user = jwt_decode(token).user_id
    const componentMap = {
        'TicTacToe': TicTacToe,
        'Battleship': Battleship,
    };
    const GameComponent = componentMap[gameName];

    useEffect(() => {
        fetch(`http://localhost:8000/${gameName}-match/`, { method: "POST" })
            .then(res => res.json())
            .then(data => {
                const newMatch = data['id'];
                const newGameURL = `http://localhost:3000/play/${gameName}/${data['id']}`;
                setMatch(newMatch);
                setGameURL(newGameURL);
                setProps({
                    "match": newMatch,
                    "gameURL": newGameURL,
                    "setMatch": setMatch
                })
            })
    }, [])


    if (isLoading || props.match === undefined) {
        return (
            <div>Loading...</div>
        )
    } else {
        return (
            <>
                <div className="play-games-page">
                    <h1>{game.name}</h1>
                    <h4>{game.description}</h4>
                    <div id="play-game-area">
                        <GameComponent match={props.match} gameURL={props.gameURL} game={game['id']} user={user} />
                    </div>
                    <Chat room={props.match} />
                </div>
            </>
        )
    }
}

export default PlayGamePage