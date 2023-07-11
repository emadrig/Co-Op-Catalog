import { useParams } from "react-router-dom";
import { useGetGameDetailsQuery } from "../../store/Api";
import { useState } from "react";
import './PlayGamePage.css'
import Chat from "../chat/chat";
import TicTacToe from "../ticTacToe/TicTacToe";



function PlayGamePage() {
    const { gameName } = useParams()
    const { data: game, isLoading } = useGetGameDetailsQuery(gameName)
    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    } else {
        return (
            <>
                <div className="play-games-page">
                    <TicTacToe />
                    {/* <div>{game.name}</div>
                    <div>{game.description}</div>
                    <div>{game.rules}</div> */}
                </div>
                <Chat />
            </>
        )
    }
}

export default PlayGamePage