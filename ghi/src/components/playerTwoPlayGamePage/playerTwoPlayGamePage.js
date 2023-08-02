import { useParams } from "react-router-dom";
import { useGetGameDetailsQuery } from "../../store/Api";
import { useState, useEffect } from "react";
import '../playGamePage/PlayGamePage.css'
import PlayerTwoChat from "../playerTwoChat/playerTwoChat";
import PlayerTwoTicTacToe from "../playerTwoTicTacToe/PlayerTwoTicTacToe";
import PlayerTwoBattleship from "../playerTwoBattleship/playerTwoBattleship";
import jwt_decode from "jwt-decode"
import { useSelector } from 'react-redux';


function PlayerTwoPlayGamePage() {
    const { gameName, id } = useParams()
    const { data: game, isLoading } = useGetGameDetailsQuery(gameName)
    const token = useSelector(state => state.token)
    const user = jwt_decode(token).user_id
    const componentMap = {
        'TicTacToe': PlayerTwoTicTacToe,
        'Battleship': PlayerTwoBattleship,
    };
    const GameComponent = componentMap[gameName];

    if (isLoading || id === undefined) {
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
                        <GameComponent id={id} match={id} gameURL={`http://localhost:3000/play/${game['name']}/${game['id']}`} game={game['id']} user={user} />
                    </div>
                    <PlayerTwoChat room={id} />
                </div>
            </>
        )
    }
}

export default PlayerTwoPlayGamePage